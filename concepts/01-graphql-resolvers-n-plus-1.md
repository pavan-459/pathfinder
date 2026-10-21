# 1. GraphQL, resolvers and the N+1 problem

## GraphQL in one minute

GraphQL is a query language for APIs with **one endpoint** and a **typed schema**. The client sends a query describing exactly the fields it wants, and the server returns exactly that shape.

| | REST | GraphQL |
|---|---|---|
| Endpoints | Many (`/hotels`, `/hotels/:id/rooms`) | One (`/graphql`) |
| Response shape | Fixed by the server | Chosen by the client |
| Over-fetching | Common (you get every field) | Avoided |
| Under-fetching | Common (several round trips) | Avoided (nested query in one request) |
| Caching | Easy with HTTP caching on GET URLs | Needs client cache (Apollo) or persisted queries |
| Errors | HTTP status codes | Usually `200` with an `errors` array; partial data is possible |

**How to say it:** "A hotel detail page on mobile needs name, price and rating. On web it also needs amenities and reviews. With REST both clients get the same fixed payload or call several endpoints. With GraphQL each client asks for exactly what it renders, in one request."

## Schema, queries and mutations

```graphql
type Room  { id: ID!, type: String!, price: Int! }
type Hotel { id: ID!, name: String!, rating: Float, rooms: [Room!]! }

type Query    { hotel(id: ID!): Hotel, hotels(city: String): [Hotel!]! }
type Mutation { createBooking(hotelId: ID!, roomId: ID!, nights: Int!): Booking! }
```

- `!` means non-null. Only use it when the field can truly never be null; removing a `!` later is a breaking change for clients.
- **Query** = reads, no side effects. Top-level query fields may resolve in parallel.
- **Mutation** = writes. Top-level mutation fields run **in order**, one after another.
- **Subscription** = server pushes updates, usually over WebSockets (e.g. live room availability).

## Resolvers

A resolver is the function that produces the value for one field. GraphQL walks the query tree and calls a resolver for each field it needs.

```js
const resolvers = {
  Query: {
    hotel: (parent, args, context, info) => context.db.hotels.findById(args.id),
  },
  Hotel: {
    // parent is the Hotel object returned by the resolver above
    rooms: (parent, args, context) => context.db.rooms.findByHotelId(parent.id),
  },
};
```

The four arguments, in order:

| Argument | What it holds | Typical use |
|---|---|---|
| `parent` (or `root`) | The result of the parent field's resolver | `parent.id` to fetch children |
| `args` | Arguments passed to this field in the query | `args.id`, filters, pagination |
| `context` | Object shared by every resolver in one request | Logged-in user, DB clients, DataLoaders |
| `info` | The query AST and schema details | Rarely needed; field selection, tracing |

**Default resolvers:** if you don't write a resolver for a field, GraphQL returns `parent[fieldName]`. That's why `Hotel.name` usually needs no resolver.

**Resolver chain:** `Query.hotel` runs first and returns a hotel. Then `Hotel.name` and `Hotel.rooms` run with that hotel as `parent`. Then `Room.type` runs for each room. Each level waits for its parent.

**Context in Apollo Server:** the context function runs once per request. Put the authenticated user there (validate the JWT once) and create fresh DataLoaders there.

```js
context: async ({ req }) => ({
  user: verifyJwt(req.headers.authorization),   // auth once, every resolver can read context.user
  loaders: createLoaders(),                     // new loaders per request: no cache leaks between users
}),
```

## The N+1 problem

Query: `{ hotels { name rooms { type } } }`

1. `Query.hotels` runs **1** query and returns N hotels.
2. `Hotel.rooms` runs once **per hotel**, so **N** more queries.

Total: **1 + N** queries. With 50 hotels that's 51 round trips to the database for one page, and it gets worse with every nested level.

**Why GraphQL makes this easy to hit:** each resolver only knows about its own `parent`. The `rooms` resolver for hotel 3 has no idea that resolvers for hotels 1 to 50 are about to make the same kind of query.

## The fix: DataLoader (batching + per-request caching)

DataLoader collects every `.load(key)` call made during one tick of the event loop, then calls your **batch function once** with all the keys.

```js
const DataLoader = require('dataloader');

function createLoaders() {
  return {
    roomsByHotel: new DataLoader(async (hotelIds) => {
      const rooms = await db.rooms.find({ hotelId: { $in: hotelIds } });   // ONE query
      return hotelIds.map(id => rooms.filter(r => r.hotelId === id));    // same order as keys
    }),
  };
}

const resolvers = {
  Hotel: { rooms: (hotel, _, ctx) => ctx.loaders.roomsByHotel.load(hotel.id) },
};
```

Result: **1 + 1** queries no matter how many hotels.

Run it yourself (no packages needed; it includes a 25-line DataLoader so you can see how batching works): `node concepts/examples/graphql-n-plus-one.js`

```
Naive resolvers:  10 hotels -> 11 DB calls (1 + N)
With DataLoader:  10 hotels -> 2 DB calls (1 + 1)
Same data both ways: true
```

### Rules people get wrong

- **The batch function must return results in the same order as the keys**, with the same length. Return `null` or an `Error` for missing keys, never skip them.
- **Create loaders per request**, not globally. DataLoader also caches by key, so a global loader would serve one user's data to another and never see updates.
- **How it batches:** the first `.load()` in a tick schedules one dispatch with `process.nextTick`; every other `.load()` made in the same synchronous run joins that queue. The sibling `rooms` resolvers are all started together, so they land in one batch. This is the event loop in action: see [the event loop notes](05-event-loop-and-libuv.md) and the `MiniDataLoader` class in the example.
- DataLoader is not a cross-request cache. For that, use Redis or HTTP/CDN caching on top.

## Other performance and safety questions

| Question | Answer in one line |
|---|---|
| Malicious deeply nested query? | Limit query depth (`graphql-depth-limit`) and complexity (`graphql-query-complexity`); reject before resolving. |
| Introspection in production? | Usually disable it, or restrict it, so the full schema isn't exposed publicly. |
| Persisted queries? | Client sends a hash of a pre-registered query. Smaller requests, cacheable as GET, and the server only runs known queries. |
| Errors? | Throw `GraphQLError` with `extensions.code` (e.g. `NOT_FOUND`). Other fields can still return data: partial success. |
| Pagination? | Cursor-based (`first`, `after`, `pageInfo { hasNextPage endCursor }`) is stable when rows are inserted. |
| Many teams, one graph? | Apollo Federation: each team owns a subgraph; a gateway or router composes them into one schema. |
| Client caching? | Apollo Client keeps a normalised cache keyed by `__typename:id`, so updating `Hotel:123` updates every view of it. |

## 30-second answer: "What is the N+1 problem?"

> "In GraphQL each field has its own resolver. If I fetch a list of N hotels and each hotel's `rooms` resolver queries the database separately, that's one query for the list plus N for the rooms. I fix it with DataLoader: the resolvers call `loader.load(hotelId)`, DataLoader collects all the IDs from the same tick and makes one batched query, then hands each resolver its own rooms. I create the loaders per request in the context so caching can't leak between users. That turns 1 + N queries into 2."
