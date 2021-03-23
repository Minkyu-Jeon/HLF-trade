import axios from 'axios'
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ENROLL_USER
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
    .catch(error => error.response.data)

  return {
    type: AUTH_USER,
    payload: request
  }
}

export function logout() {
  const request = axios.delete('/api/sessions/logout')
    .then(response => response.data)
    .catch(error => error.response.data)
  
  return {
    type: LOGOUT_USER,
    payload: request
  }
}

export function enrollNetwork(orgName) {
  const request = axios.post('/api/users/enroll', {
    orgName: orgName
  })
    .then(response => response.data)
    .catch(error => error.response.data)
  
  return {
    type: ENROLL_USER,
    payload: request
  }
}