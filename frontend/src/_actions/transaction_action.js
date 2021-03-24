import axios from 'axios'
import {
  GET_MY_SELLING_LIST,
  GET_MY_BUYING_LIST,
} from './types'

export function getSellingList(user_id) {
  const request = axios.get(`/api/users/${user_id}/used_things/sellings`)
    .then(response => response.data)
    .catch(error => error.response.data)

  return {
    type: GET_MY_SELLING_LIST,
    payload: request
  }
}

export function getBuyingList(user_id) {
  const request = axios.get(`/api/users/${user_id}/used_things/buyings`)
    .then(response => response.data)
    .catch(error => error.response.data)

  return {
    type: GET_MY_BUYING_LIST,
    payload: request
  }
}