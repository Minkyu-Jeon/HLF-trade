import {
  GET_USED_THING_LIST,
  GET_USED_THING
} from '../_actions/types'

export default function(state={}, action) {
  switch (action.type) {
    case GET_USED_THING_LIST:
      return {...state, getUsedThingsSuccess: action.payload}
    case GET_USED_THING:
      return {...state, getUsedThingSuccess: action.payload}
    default:
      return state
  }
}