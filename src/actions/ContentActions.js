import Http from '../utils/Http'

export const ACTIONS = {
  SET_SEED_PROVIDER_PUB:'content/setSeedProviderPub',
  ADD_PUBLISHED_CONTENT:'content/addPublishedContent',
  ADD_UNLOCKED_CONTENT:'content/addUnlocked',
  ADD_STREAM:'content/addStream',
  REMOVE_STREAM:'content/removeStream',
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

export const unlockContent = (amt,owner,postID) => async dispatch => {
  const {data} = await Http.post('/api/lnd/unifiedTrx',{
    type: 'contentReveal',
    amt,
    to: owner,
    memo:'',
    feeLimit:500,
    ackInfo:postID
  })
  const revealRes = JSON.parse(data.orderAck.response)
  if(revealRes && revealRes.unlockedContents){
    for (const contentID in revealRes.unlockedContents) {
      if (Object.hasOwnProperty.call(revealRes.unlockedContents, contentID)) {
        const content = revealRes.unlockedContents[contentID];
        dispatch({
          type:ACTIONS.ADD_UNLOCKED_CONTENT,
          data:{contentPath:`${owner}>posts>${postID}`,content}
        })
      }
    }
  }
}
export const addStream = (seedToken, liveToken) => dispatch => {
  dispatch({
    type: ACTIONS.ADD_STREAM,
    data: {seedToken,liveToken}
  });
};
export const removeStream = () => dispatch => {
  dispatch({
    type: ACTIONS.REMOVE_STREAM,
  });
};