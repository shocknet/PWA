# Sagas

Sagas are preferred over thunks because:

- No overloading of `dispatch()`.
- More expressive power.
- Called on every store tick so they can react to state changes.

## Guidelines

- Sagas can import from services, actions and selectors but not from reducers.
- Only one default export per file, a saga named according to the file name and scope of the code, e.g. `nodeSaga` in `node.ts`, if something else "needs" to be exported, then it doesn't belong in a saga file. E.g. in utils. That saga can then run other sagas as needed. Naming helps error traces.
- Use `getStore()` from `./_store` and not from elsewhere.
- In the future we should switch to channel events to avoid the `getStore()` conundrum.
- Ping saga handles online state.
- Build and connect sockets/polls when `Selectors.isReady(yield select())` returns true, disconnect them and tear them down when false, this simplifies token/user handling.
- Call `_setStore()` on store creation but before running the root saga.
- Wrap every single saga's body in a try-catch. Inside the catch block, if the saga can reasonably handle the error, then it should handle it, always log the error and pre-pend a `logger.error('Error inside [sagaName]* ()')` before logging the actual error. E.g.:

```ts
function* handlePing() {
  try {
    // ...
  } catch (e) {
    logger.error("Error inside handlePing* ()");
    logger.error(e);
  }
}
```

- Do not do conditional dispatch based on state inside the saga, let the reducer handle the action as it seems fit, reducers are pure and are more easily testable, only check for conditions inside of those.
- Use `Common.YieldReturn<T>` for type safety.
- There's one exception to all of these rules and that is the `_store` file.
