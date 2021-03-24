import {
  GET_USED_THING_LIST,
  GET_USED_THING,
  SUBMIT_USED_THING_FORM,
  BUY_REQUEST
} from '../_actions/types'

export default function(state={}, action) {
  switch (action.type) {
    case GET_USED_THING_LIST:
      return {...state, getUsedThingsSuccess: action.payload}
    case GET_USED_THING:
      return {...state, getUsedThingSuccess: action.payload}
    case SUBMIT_USED_THING_FORM:
      return {...state, submitUsedThingFormSuccess: action.payload}
    case BUY_REQUEST:
      return {...state, buyRequestSuccess: action.payload}
    default:
      return state
  }
}