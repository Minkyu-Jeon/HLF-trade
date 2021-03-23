import axios from 'axios'
import {
  GET_USED_THING_LIST,
  GET_USED_THING,
  SUBMIT_USED_THING_FORM
} from './types'

export function getUsedThingList() {
  const request = axios.get('/api/used_things')
    .then(response => response.data)
    .catch(error => error.response.data)

  return {
    type: GET_USED_THING_LIST,
    payload: request
  }
}

export function getUsedThing(key) {
  const request = axios.get(`/api/used_things/${key}`)
    .then(response => response.data)
    .catch(error => error.response.data)

  return {
    type: GET_USED_THING,
    payload: request
  }
}

export function registerUsedThing(body) {
  const request = axios.post(`/api/used_things`, body)
    .then(response => response.data)
    .catch(error => error.response.data)

  return {
    type: SUBMIT_USED_THING_FORM,
    payload: request
  }
}