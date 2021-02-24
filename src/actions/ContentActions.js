export const ACTIONS = {
  SET_SEED_PROVIDER_PUB:'content/setSeedProviderPub'
};
  
export const setSeedProviderPub = pub => dispatch => {
  dispatch({
    type: ACTIONS.SET_SEED_PROVIDER_PUB,
    data: pub
  });
};