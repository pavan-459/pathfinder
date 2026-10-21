// Callback hell -> Promises -> async/await, with the same fake data layer.
// Run: node concepts/examples/callback-hell.js
const { promisify } = require('util');

// Fake async data layer in Node "error-first callback" style
const db = {
  users: { u1: { id: 'u1', name: 'Pavan', bookingId: 'b1' } },
  bookings: { b1: { id: 'b1', hotelId: 'h1', nights: 2 } },
  hotels: { h1: { id: 'h1', name: 'Marriott Hyderabad', pricePerNight: 9000 } },
};
const later = (fn) => setTimeout(fn, 10);
function getUser(id, cb) { later(() => db.users[id] ? cb(null, db.users[id]) : cb(new Error('user not found'))); }
function getBooking(id, cb) { later(() => db.bookings[id] ? cb(null, db.bookings[id]) : cb(new Error('booking not found'))); }
function getHotel(id, cb) { later(() => db.hotels[id] ? cb(null, db.hotels[id]) : cb(new Error('hotel not found'))); }

// 1) Callback hell: each step nests inside the last, and every level repeats error handling
function totalCostCallbacks(userId, done) {
  getUser(userId, (err, user) => {
    if (err) return done(err);
    getBooking(user.bookingId, (err, booking) => {
      if (err) return done(err);
      getHotel(booking.hotelId, (err, hotel) => {
        if (err) return done(err);
        done(null, `${user.name}: ${hotel.name}, ${booking.nights} nights = ${hotel.pricePerNight * booking.nights}`);
      });
    });
  });
}

// 2) Promises: flat chain, one .catch for every step
const getUserP = promisify(getUser), getBookingP = promisify(getBooking), getHotelP = promisify(getHotel);
function totalCostPromises(userId) {
  let user, booking;
  return getUserP(userId)
    .then(u => { user = u; return getBookingP(u.bookingId); })
    .then(b => { booking = b; return getHotelP(b.hotelId); })
    .then(h => `${user.name}: ${h.name}, ${booking.nights} nights = ${h.pricePerNight * booking.nights}`);
}

// 3) async/await: reads top to bottom, one try/catch
async function totalCostAsync(userId) {
  const user = await getUserP(userId);
  const booking = await getBookingP(user.bookingId);
  const hotel = await getHotelP(booking.hotelId);
  return `${user.name}: ${hotel.name}, ${booking.nights} nights = ${hotel.pricePerNight * booking.nights}`;
}

// 4) Independent calls should run in parallel with Promise.all, not one after another
async function parallelDemo() {
  const t = Date.now();
  await getHotelP('h1'); await getHotelP('h1'); await getHotelP('h1');
  const sequential = Date.now() - t;
  const t2 = Date.now();
  await Promise.all([getHotelP('h1'), getHotelP('h1'), getHotelP('h1')]);
  const parallel = Date.now() - t2;
  console.log(`4 sequential awaits ~${sequential}ms vs Promise.all ~${parallel}ms`);
}

totalCostCallbacks('u1', (err, res) => {
  console.log('1 callbacks  ', err ? err.message : res);
  totalCostPromises('u1').then(r => console.log('2 promises   ', r))
    .then(() => totalCostAsync('u1')).then(r => console.log('3 async/await', r))
    .then(async () => {
      try { await totalCostAsync('nobody'); } catch (e) { console.log('3 error path ', e.message); }
    })
    .then(parallelDemo);
});
