import axios from 'axios'
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER
} from './types'

export function loginUser(dataToSubmit) {
  const request = axios.post('/api/sessions', dataToSubmit)
    .then(response => response.data)

  return {
    type: LOGIN_USER,
    payload: request
  }
}


export function registerUser(dataToSubmit) {
  const request = axios.post('/api/users', dataToSubmit)
    .then(response => response.data)

  return {
    type: REGISTER_USER,
    payload: request
  }
}

export function auth() {
  const request = axios.get('/api/sessions/info')
    .then(response => response.data)
    .catch(error => error.response.status)

  return {
    type: AUTH_USER,
    payload: request
  }
}