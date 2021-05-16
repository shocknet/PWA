import {
  addDialogCallback,
  callDialogCallBack
} from '../utils/dialogCallback'
export const ACTIONS = {
  OPEN_DIALOG: "app/openDialog",
  CLOSE_DIALOG:"app/closeDialog"
};
export const openDialog = ({text,cb = null}) => dispatch => {
  addDialogCallback(cb)
  dispatch({
    type: ACTIONS.OPEN_DIALOG,
    data: {text,hasCallback: !!cb}
  });
};

export const closeDialog = executeCb => dispatch => {
  if(executeCb){
    callDialogCallBack()
  }
  dispatch({
    type: ACTIONS.CLOSE_DIALOG
  });
}