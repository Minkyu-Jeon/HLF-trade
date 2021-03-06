import {
  AUTH_USER,
  ENROLL_USER,
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER
} from '../_actions/types'

export default function(state={}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {...state, loginSuccess: action.payload}
    case REGISTER_USER:
      return {...state, registerSuccess: action.payload}
    case AUTH_USER:
      return {...state, currentUser: action.payload}
    case LOGOUT_USER:
      return {...state, logoutSuccess: action.payload}
    case ENROLL_USER:
      return {...state, enrollSuccess: action.payload}
    default:
      return state
  }
}