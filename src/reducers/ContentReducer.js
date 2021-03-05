import { ACTIONS } from "../actions/ContentActions";
const INITIAL_STATE = {
  seedProviderPub:'test',
  publishedContent:{}
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
    default:
      return state;
  }
};

export default content;
