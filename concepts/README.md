# Concepts

JavaScript, Node.js and GraphQL theory that came up in interview rounds, with small examples you can run. First added after the [Marriott Tech Accelerator round](../interviews/2026-10-21-marriott.md).

Every output shown in these notes comes from actually running the code in Node.js 22. No packages to install.

| # | Topic | Run it |
|---|---|---|
| 1 | [GraphQL, resolvers, N+1 and DataLoader](01-graphql-resolvers-n-plus-1.md) | `node concepts/examples/graphql-n-plus-one.js` |
| 2 | [var / let / const, hoisting, TDZ, lexical scope, closures](02-var-let-const-lexical-scope.md) | `node concepts/examples/scope-quiz.js` |
| 3 | [Output prediction drills (10 questions, answers hidden)](03-output-prediction.md) | `node concepts/examples/async-order.js` |
| 4 | [Callback hell -> Promises -> async/await, `Promise.all`](04-callback-hell-to-async-await.md) | `node concepts/examples/callback-hell.js` |
| 5 | [Event loop phases, microtasks, libuv and its thread pool](05-event-loop-and-libuv.md) | `node concepts/examples/event-loop.js`<br>`node concepts/examples/io-callback-order.js`<br>`node concepts/examples/libuv-threadpool.js` |

Run commands from the repo root.

## Quick answers

**GraphQL vs REST.** One endpoint and a typed schema; the client asks for exactly the fields it needs, so there's no over- or under-fetching. The trade-off: HTTP caching is harder and you must guard against expensive queries.

**Resolver.** A function that returns the value for one field: `(parent, args, context, info)`. Fields without a resolver return `parent[field]`.

**N+1.** A list of N items, each with a field resolver that queries the database, gives 1 + N queries. DataLoader batches all `.load(id)` calls from the same tick into one query. Create the loaders per request.

**var / let / const.** `var` is function-scoped and hoisted as `undefined`. `let`/`const` are block-scoped and in the TDZ until declared. `const` blocks reassignment, not mutation.

**Lexical scope.** A function sees variables from where it was *written*, not where it's *called*. `this` is the exception, except in arrow functions.

**Callback hell.** Nested callbacks with repeated error handling and no composition. Promises settle once and chain flat; async/await reads top to bottom; use `Promise.all` for independent work.

**Event loop.** Sync code, then microtasks (`nextTick`, then promises), then the loop phases: timers -> poll (I/O) -> check (`setImmediate`) -> close. Microtasks drain after every callback.

**libuv.** The C library behind Node's event loop. Network I/O uses OS async APIs (epoll, kqueue, IOCP). File system, `dns.lookup`, crypto and zlib use a thread pool of 4 threads by default (`UV_THREADPOOL_SIZE`).
