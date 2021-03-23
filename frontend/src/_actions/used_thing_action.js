import axios from 'axios'
import {
  GET_USED_THING_LIST,
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
