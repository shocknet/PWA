import { ACTIONS } from "../actions/ContentActions";
const INITIAL_STATE = {
  seedProviderPub:'test',
  streamUserToken:'',
  streamLiveToken:'',
  publishedContent:{},
  unlockedContent:{},
  seedInfo:"{}"
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
      return {...state, streamLiveToken:data.liveToken,streamUserToken:data.seedToken}
    }
    case ACTIONS.REMOVE_STREAM:{
      return {...state, streamLiveToken:'',streamUserToken:''}
    }
    case ACTIONS.SET_SEED_INFO:{
      const {data} = action
      return {...state, seedInfo:data}
    }
    default:
      return state;
  }
};

export default content;
