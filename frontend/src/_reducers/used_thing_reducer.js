import {
  GET_USED_THING_LIST
} from '../_actions/types'

export default function(state={}, action) {
  switch (action.type) {
    case GET_USED_THING_LIST:
      return {...state, getUsedThingsSuccess: action.payload}
    default:
      return state
  }
}