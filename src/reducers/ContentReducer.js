import { ACTIONS } from "../actions/ContentActions";
const INITIAL_STATE = {
  seedProviderPub:'qsgziGQS99sPUxV1CRwwRckn9cG6cJ3prbDsrbL7qko.oRbCaVKwJFQURWrS1pFhkfAzrkEvkQgBRIUz9uoWtrg',
  streamUserToken:'',
  streamLiveToken:'',
  streamUrl:'',
  publishedContent:{},
  unlockedContent:{},
  seedInfo:{},
  availableTokens:{},
  availableStreamTokens:{}
};

const content = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.SET_SEED_PROVIDER_PUB: {
      return { ...state, seedProviderPub: action.data };
    }
    case ACTIONS.ADD_PUBLISHED_CONTENT:{
      const {data} = action
      const {content,res} = data
      const contentTmp = {...state.publishedContent}
      if(res.ok){
        contentTmp[res.id] = content 
      }
      return { ...state, publishedContent:contentTmp} 
    }
    case ACTIONS.ADD_UNLOCKED_CONTENT:{
      const {data} = action
      const unlockedTmp = {...state.unlockedContent}
      unlockedTmp[data.contentPath] = data.content
      return {...state,unlockedContent:unlockedTmp}
    }
    case ACTIONS.ADD_STREAM:{
      const {data} = action
      return {...state, streamLiveToken:data.liveToken,streamUserToken:data.seedToken,streamUrl:data.streamUrl}
    }
    case ACTIONS.REMOVE_STREAM:{
      return {...state, streamLiveToken:'',streamUserToken:'',streamUrl:''}
    }
    case ACTIONS.SET_SEED_INFO:{
      const {data} = action
      return {...state, seedInfo:data}
    }
    case ACTIONS.ADD_AVAILABLE_TOKEN:{
      const {data} = action
      const {seedUrl,userToken} = data
      const availableTmp = {...state.availableTokens}
      if(!availableTmp[seedUrl]){
        availableTmp[seedUrl] = []
      }
      availableTmp[seedUrl].push(userToken)
      return {...state,availableTokens:availableTmp}
    }
    case ACTIONS.REMOVE_USED_TOKEN:{
      const {data} = action
      const {seedUrl,userToken} = data
      const availableTmp = {...state.availableTokens}
      if(!availableTmp[seedUrl]){
        return state
      }
      const index = availableTmp[seedUrl].indexOf(userToken);
      if (index > -1) {
        availableTmp[seedUrl].splice(index, 1);
        return {...state,availableTokens:availableTmp}
      }
      return state
    }
    case ACTIONS.ADD_STREAM_TOKEN:{
      const {data} = action
      const {seedUrl,userToken} = data
      const availableTmp = {...state.availableStreamTokens}
      if(!availableTmp[seedUrl]){
        availableTmp[seedUrl] = []
      }
      availableTmp[seedUrl].push(userToken)
      return {...state,availableStreamTokens:availableTmp}
    }
    case ACTIONS.REMOVE_STREAM_TOKEN:{
      const {data} = action
      const {seedUrl,userToken} = data
      const availableTmp = {...state.availableStreamTokens}
      if(!availableTmp[seedUrl]){
        return state
      }
      const index = availableTmp[seedUrl].indexOf(userToken);
      if (index > -1) {
        availableTmp[seedUrl].splice(index, 1);
        return {...state,availableStreamTokens:availableTmp}
      }
      return state
    }
    default:
      return state;
  }
};

export default content;
