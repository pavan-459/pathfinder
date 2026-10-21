// The N+1 problem in GraphQL, and how DataLoader fixes it. Counts "database" calls.
// Run: node concepts/examples/graphql-n-plus-one.js
//
// No packages needed. `execute` below mimics how graphql-js runs resolvers (parent first, then each
// list item's child resolvers started together), and `MiniDataLoader` is a ~25-line version of the
// `dataloader` package, so you can see the batching mechanism itself.
// In a real project: npm install graphql dataloader, and use `new DataLoader(batchFn)` the same way.

// ---------- fake database that counts every query ----------
let dbCalls = 0;
const HOTELS = Array.from({ length: 10 }, (_, i) => ({ id: `h${i}`, name: `Hotel ${i}` }));
const ROOMS = HOTELS.flatMap(h => [
  { id: `${h.id}-r1`, hotelId: h.id, type: 'King', price: 9000 },
  { id: `${h.id}-r2`, hotelId: h.id, type: 'Twin', price: 7000 },
]);
const db = {
  async allHotels() { dbCalls++; return HOTELS; },
  async roomsByHotelId(id) { dbCalls++; return ROOMS.filter(r => r.hotelId === id); },          // one hotel per query
  async roomsByHotelIds(ids) { dbCalls++; return ROOMS.filter(r => ids.includes(r.hotelId)); },  // WHERE hotelId IN (...)
};

// ---------- a tiny DataLoader ----------
class MiniDataLoader {
  constructor(batchFn) {
    this.batchFn = batchFn;  // (keys) => Promise<values in the same order as keys>
    this.queue = [];         // pending { key, resolve, reject }
    this.cache = new Map();  // key -> promise (per-request cache)
  }
  load(key) {
    if (this.cache.has(key)) return this.cache.get(key);
    const promise = new Promise((resolve, reject) => {
      this.queue.push({ key, resolve, reject });
      // First load in this tick schedules ONE dispatch. Every other load made
      // synchronously in the same tick joins the same batch.
      if (this.queue.length === 1) process.nextTick(() => this.dispatch());
    });
    this.cache.set(key, promise);
    return promise;
  }
  async dispatch() {
    const batch = this.queue;
    this.queue = [];
    try {
      const values = await this.batchFn(batch.map(b => b.key));
      if (values.length !== batch.length) throw new Error('batchFn must return one value per key, in order');
      batch.forEach((b, i) => (values[i] instanceof Error ? b.reject(values[i]) : b.resolve(values[i])));
    } catch (err) {
      batch.forEach(b => b.reject(err));
    }
  }
}

// ---------- resolvers for: { hotels { name rooms { type price } } } ----------
const naiveResolvers = {
  Query: { hotels: () => db.allHotels() },
  Hotel: { rooms: (hotel) => db.roomsByHotelId(hotel.id) },              // runs once PER hotel -> N queries
};

const batchedResolvers = {
  Query: { hotels: () => db.allHotels() },
  Hotel: { rooms: (hotel, _args, ctx) => ctx.loaders.roomsByHotel.load(hotel.id) },
};

// New loaders for every request (in Apollo: inside the context function),
// so one user's cached data is never served to another.
function createContext() {
  return {
    loaders: {
      roomsByHotel: new MiniDataLoader(async (hotelIds) => {
        const rooms = await db.roomsByHotelIds(hotelIds);
        return hotelIds.map(id => rooms.filter(r => r.hotelId === id));  // same order as the keys
      }),
    },
  };
}

// ---------- simplified executor: parent resolver, then all children started together ----------
async function execute(resolvers, ctx = {}) {
  const hotels = await resolvers.Query.hotels(null, {}, ctx);
  const withRooms = await Promise.all(
    hotels.map(async (hotel) => ({
      name: hotel.name,
      rooms: (await resolvers.Hotel.rooms(hotel, {}, ctx)).map(({ type, price }) => ({ type, price })),
    })),
  );
  return { data: { hotels: withRooms } };
}

(async () => {
  dbCalls = 0;
  const r1 = await execute(naiveResolvers);
  console.log(`Naive resolvers:  ${r1.data.hotels.length} hotels -> ${dbCalls} DB calls (1 + N)`);

  dbCalls = 0;
  const r2 = await execute(batchedResolvers, createContext());
  console.log(`With DataLoader:  ${r2.data.hotels.length} hotels -> ${dbCalls} DB calls (1 + 1)`);
  console.log('Same data both ways:', JSON.stringify(r1.data) === JSON.stringify(r2.data));
})();
