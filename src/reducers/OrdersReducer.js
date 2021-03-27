import { ACTIONS } from "../actions/OrdersActions";

const INITIAL_STATE = {
    myServices:{},
    services:{},
    boughtServices:{}
};



const orders = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.ADD_MY_SERVICE: {
      const {id,serviceInfo} = action.data
      const tmp = {...state.myServices}
      tmp[id] = serviceInfo
      return { ...state, myServices: tmp };
    }
    case ACTIONS.REMOVE_MY_SERVICE:{
      const id = action.data
      const tmp = {...state.myServices}
      delete tmp[id]
      return { ...state, myServices: tmp };
    }
    case ACTIONS.ADD_BOUGHT_SERVICE:{
      const {orderAck,owner,serviceID} = action.data
      const servicesTmp = {...state.boughtServices}
      
      if(!servicesTmp[owner]){
        servicesTmp[owner] = {}
      }
      const selectedService = servicesTmp[owner]
      if(!selectedService[serviceID]){
        selectedService[serviceID] = []
      }
      selectedService[serviceID].push(orderAck)
      return {...state, boughtServices:servicesTmp}
    }
    default:
      return state;
  }
};

export default orders;
