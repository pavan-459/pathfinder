# 5. The event loop and libuv

## The big picture

Node.js runs your JavaScript on **one main thread**. It can still handle thousands of concurrent requests because slow work (network, disk, timers) is handed off, and the main thread only runs the short callbacks when results are ready.

Three pieces make that work:

| Piece | What it does |
|---|---|
| **V8** | Google's JavaScript engine. Compiles and runs your JS, manages the heap and the call stack. Knows nothing about files or sockets. |
| **libuv** | A C library that gives Node its **event loop**, **non-blocking I/O** and a **thread pool**. It works across operating systems. |
| **Node bindings / APIs** | Connect the two: `fs.readFile` in JS calls into C++, which asks libuv to do the work and later queues your callback. |

## The call stack and the queues

1. Synchronous code runs on the **call stack** until it's empty.
2. Then the **microtask queues** are drained completely:
   - first the `process.nextTick` queue (Node only),
   - then promise callbacks (`.then`, `.catch`, code after `await`, `queueMicrotask`).
3. Then the event loop moves on to its next **phase** and runs that phase's callbacks (macrotasks).
4. After **each** callback, Node drains the microtask queues again before the next callback.

So the order to remember is: **sync -> nextTick -> promises -> next phase -> (microtasks after every callback) -> ...**

## The phases of Node's event loop (libuv)

```
   ┌───────────────────────────┐
┌─>│          timers           │  setTimeout / setInterval callbacks whose time has passed
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  some system-level I/O callbacks deferred from last loop
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  internal
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  wait for new I/O events; run I/O callbacks (fs, network)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  e.g. socket.on('close')
   └───────────────────────────┘
```

**`setImmediate` vs `setTimeout(fn, 0)`:**
- Inside an I/O callback (we're in the poll phase), `setImmediate` **always** runs first, because check comes right after poll, while timers wait for the next loop. Run `node concepts/examples/io-callback-order.js`.
- At the top level of a script the order is **not guaranteed**; it depends on how long the loop takes to start. Running it five times here gave `timeout immediate` once and `immediate timeout` four times.

**`process.nextTick` vs `Promise.then`:** both are microtasks, but the nextTick queue is drained first. Overusing `nextTick` recursively can starve I/O, because the loop can't move on until the queue is empty.

Run: `node concepts/examples/event-loop.js`

```
1 sync start
2 sync end
3 nextTick
4 promise.then
5 queueMicrotask
7 setImmediate      <- these two can swap at top level
6 setTimeout
```

## libuv in more detail

**Non-blocking network I/O:** for sockets (HTTP, database connections), libuv uses the operating system's own event notification: **epoll** on Linux, **kqueue** on macOS, **IOCP** on Windows. No extra threads are needed; the OS tells libuv when data is ready.

**The thread pool:** some work has no good non-blocking OS API, so libuv runs it on a pool of worker threads:
- file system operations (`fs.*` except the sync versions),
- `dns.lookup`,
- CPU-heavy `crypto` (`pbkdf2`, `scrypt`, `randomBytes`),
- `zlib` compression.

The pool has **4 threads by default**. Change it with the `UV_THREADPOOL_SIZE` environment variable (set before Node starts, max 1024).

Run `node concepts/examples/libuv-threadpool.js`: it starts 8 CPU-heavy hashes at once. With the default pool they finish in two groups of four:

```
hash 4 done after 380 ms
hash 2 done after 381 ms
hash 3 done after 431 ms
hash 1 done after 435 ms
hash 5 done after 674 ms      <- second group had to wait for a free thread
hash 6 done after 674 ms
hash 7 done after 725 ms
hash 8 done after 754 ms
```

Then try `UV_THREADPOOL_SIZE=8 node concepts/examples/libuv-threadpool.js`. (Exact times depend on your CPU cores.)

## What blocks the event loop (and what to do)

| Blocks the loop | Fix |
|---|---|
| Heavy sync CPU work (big loops, `JSON.parse` of huge payloads, sync regex on big input) | Break it into chunks, move it to `worker_threads`, or to a separate service/queue (e.g. BullMQ) |
| `fs.readFileSync` and other `*Sync` calls inside request handlers | Use the async versions |
| Recursive `process.nextTick` | Use `setImmediate` to yield to I/O |

**Worker threads vs the libuv pool:** the libuv pool is internal and used by Node's own APIs. `worker_threads` is what *you* use to run your own CPU-heavy JavaScript in parallel.

## Browser vs Node (if asked)

Both have a call stack, microtasks and macrotasks. The browser loop also has a **rendering** step between tasks, and has no `setImmediate` or `process.nextTick`. Node's loop is libuv with the phases above.

## 30-second answer: "Explain the event loop and libuv"

> "Node runs JavaScript on one thread with V8. When I call something async like a file read or a network request, Node hands it to libuv. Network I/O uses the OS's own async mechanism like epoll, and things without a good async OS API, like file system work, DNS lookup and crypto, go to libuv's thread pool, which has four threads by default. When the work finishes, its callback is queued. The event loop cycles through phases (timers, poll for I/O, check for setImmediate, close callbacks), and after every callback it drains the microtask queues: nextTick first, then promises. That's why one thread can serve many concurrent requests, as long as I never block it with heavy synchronous work."
