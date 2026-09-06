# Node.js Event Loop — Why "File Reading CB" Prints Last

## The code

```javascript
const fs = require("fs");
const a = 100;

fs.readFile("./file.txt", "utf-8", () => {
  console.log("File Reading CB");
});
setImmediate(() => console.log("setImmediate"));

Promise.resolve("Promise").then(console.log("Promise"));

setTimeout(() => console.log("Timer expired"), 0);

process.nextTick(() => console.log("process.nextTick"));

function printA() {
  console.log("A=", a);
}

printA();
console.log("Last line of the file");
```

## The order things actually run in

### 1. Synchronous script (call stack) — runs first, top to bottom
Everything that isn't wrapped in a callback runs immediately, in order, before
Node even looks at the event loop:
- `printA()` -> prints `A= 100`
- `console.log("Last line of the file")`

Along the way, `fs.readFile`, `setImmediate`, `setTimeout`, and
`process.nextTick` don't execute anything yet — they just *register* their
callbacks for later.

### 2. Microtask queues — drained completely before any event loop phase
Once the main script finishes, Node empties two queues, in this order:
1. **`process.nextTick` queue** — always goes first, always fully drained
2. **Promise microtask queue** — resolved `.then()` callbacks

This is why `process.nextTick` prints before `Timer expired`, `setImmediate`,
or the file callback — nextTick always wins against every event loop phase.

### 3. Event loop phases — one pass per iteration
After the microtask queues are empty, Node moves through the event loop
phases in this fixed order:

```
Timers -> Pending callbacks -> Poll -> Check -> Close callbacks
```

- **Timers phase**: `setTimeout(..., 0)` fires here -> `Timer expired`
- **Poll phase (pass 1)**: Node checks for finished I/O. The file read
  hasn't finished yet (disk I/O takes real time), so there's nothing to run.
  Since a `setImmediate` is waiting, Node doesn't block here — it moves on.
- **Check phase**: `setImmediate` fires here -> `setImmediate`
- **Poll phase (pass 2)**: the loop comes back around, and by now the file
  read has finished -> `File Reading CB`

### Final order
```
A= 100
Last line of the file
process.nextTick
Promise          <- see note below, this line is actually a bug
Timer expired
setImmediate
File Reading CB
```

## Why the file callback is always last

`setTimeout` and `setImmediate` are cheap: the callback is already sitting in
memory, just waiting for its phase to come around, and each phase resolves in
microseconds when there's nothing to wait for.

`fs.readFile` is different — Node hands it off to **libuv's thread pool**, a
set of background OS threads that do the actual disk read. That callback
can only be queued into the Poll phase once the OS-level read genuinely
finishes, which takes real time (disk access, OS scheduling, thread pool
queueing) — far slower than just checking an empty queue. So on the first
pass through Poll it usually isn't ready, and it gets picked up on the next
lap of the loop, after `setImmediate` has already fired.

## Does everything go through the Poll phase? (timers vs. immediates vs. I/O)

No — each type of callback has its own dedicated phase. Poll is *not* a
catch-all:

| Callback type                    | Which phase runs it       |
|-----------------------------------|----------------------------|
| `setTimeout` / `setInterval`      | **Timers** phase            |
| `setImmediate`                    | **Check** phase              |
| `fs.readFile`, network sockets, DNS lookups, most other async I/O | **Poll** phase |
| `socket.on('close', ...)`         | **Close callbacks** phase   |
| `process.nextTick` / Promise `.then` | Not a phase at all — drained as a microtask queue between every phase |

So timers never "go to poll" — they have their own phase that runs *before*
Poll in every iteration. Poll is specifically for callbacks tied to actual
I/O operations that libuv is watching (files, sockets, pipes, DNS). It's
also the one phase that can *block* and wait for new I/O events if nothing
else (no pending timer or immediate) needs to run.

## Bonus bug: the `Promise.resolve(...).then(...)` line

```javascript
Promise.resolve("Promise").then(console.log("Promise"));
```

`console.log("Promise")` is evaluated immediately, as an argument — it isn't
deferred at all. It runs synchronously the instant this line executes and
returns `undefined`, which becomes a no-op `.then(undefined)`.

If you actually ran this code, `"Promise"` would print **synchronously**,
before `A= 100` — not after `process.nextTick` as shown in the "expected"
output. To make it a real microtask (and get the output as originally
shown), it needs an arrow function:

```javascript
Promise.resolve("Promise").then(() => console.log("Promise"));
```

This is one of the most common typos in event-loop teaching examples —
dropping the arrow function silently turns an async microtask into an
immediate synchronous call.
