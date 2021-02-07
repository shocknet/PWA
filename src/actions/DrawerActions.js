export const ACTIONS = {
  SET_DRAWER_OPEN: "drawer/open"
};

export const openDrawer = () => async dispatch => {
  dispatch({
    type: ACTIONS.SET_DRAWER_OPEN,
    data: true
  });
};

export const closeDrawer = () => async dispatch => {
  dispatch({
    type: ACTIONS.SET_DRAWER_OPEN,
    data: false
  });
};
