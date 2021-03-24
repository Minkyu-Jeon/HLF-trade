import {
  GET_MY_SELLING_LIST,
  GET_MY_BUYING_LIST,
} from '../_actions/types'

export default function(state={}, action) {
  switch (action.type) {
    case GET_MY_SELLING_LIST:
      return {...state, sellingListSuccess: action.payload}
    case GET_MY_BUYING_LIST:
      return {...state, buyingListSuccess: action.payload}
    default:
      return state
  }
}