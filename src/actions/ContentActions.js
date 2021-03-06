import Http from '../utils/Http'

export const ACTIONS = {
  SET_SEED_PROVIDER_PUB:'content/setSeedProviderPub',
  ADD_PUBLISHED_CONTENT:'content/addPublishedContent'
};
  
export const setSeedProviderPub = pub => async dispatch => {
  await Http.post('/api/gun/put',{
    path:'$user>seedServiceProviderPubKey',
    value:{
      $$__ENCRYPT__FOR:'me',
      value:pub
    }
  })
  dispatch({
    type: ACTIONS.SET_SEED_PROVIDER_PUB,
    data: pub
  });
};
export const addPublishedContent = content => async dispatch => {
  let toSet = content
  if(typeof content !== 'string'){
    toSet = JSON.stringify(content)
  }
  const {data} = await Http.post('/api/gun/set',{
    path:'$user>publishedContent',
    value:{
      $$__ENCRYPT__FOR:'me',
      value:toSet
    }
  })
  dispatch({
    type: ACTIONS.ADD_PUBLISHED_CONTENT,
    data: {content,res:data}
  });
  return data
};