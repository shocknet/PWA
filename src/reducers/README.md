# Reducers

## Guidelines

- Define an state interface, named according to the reducer, e.g. `interface NodeState { foo: string }`.
- Declare an initial state, of the state type, e.g: `const INITIAL_STATE: NodeState = { foo: 'baz' }`.
- Import `AnyAction` from `redux`, this will be the type for the `action` the reducer accepts.
- Either import the actions enum from an action creators file, e.g. `import { NODE_ACTIONS } from '../actions/NodeActions'` or use a single action creator's `.match()` method if it was created via `createAction` from `@reduxjs/toolkit`:

```ts
import { AnyAction } from "redux";
import { NODE_ACTIONS, setFoo } from "../actions/NodeActions";
// ...
const node = (state: NodeState, action: ShockAction) => {
  try {
    if (action.type === NODE_ACTIONS.setFoo) {
      // foo will NOT be typed as string
      const { foo } = action.payload;
      return { ...state, foo };
    }
    if (setFoo.match(action)) {
      // foo will be typed as string
      const { foo } = action.payload;
      return { ...state, foo };
    }
  } catch (e) {
    logger.error(`Error inside Node reducer:`);
    logger.error(e);
  }
};
```

- Prefer `immer` over homegrown immutable data, especially for complex updates, the resulting code will be cleaner/shorter/less buggier. Small example:

```ts
const node = produce((draft: NodeState, action: ShockAction) => {
  try {
    if (action.type === "setFoo") {
      draft.foo = action.data.foo;
    }
  } catch (e) {
    logger.error(`Error inside Node reducer:`);
    logger.error(e);
  }
}, INITIAL_STATE);
```

- Wrap every reducer's body in a try-catch. Inside the catch block, if the reducer can reasonably handle the error, then it should handle it, otherwise, return the current state, always log the error and pre-pend a `logger.error('Error inside X reducer:')` before logging the actual error.

- Only one default export per file, the reducer, if something else "needs" to be exported, then it doesn't belong in a reducer file. E.g. typings should go into `shock-common`.
