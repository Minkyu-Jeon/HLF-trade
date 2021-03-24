import axios from 'axios'
import {
  GET_USED_THING_LIST,
  GET_USED_THING,
  SUBMIT_USED_THING_FORM,
  BUY_REQUEST,
  SEND_THING,
  RECEIVE_THING,
  CONFIRM_PURCHASE
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

export function getUsedThing(serial_number, product_name) {
  const request = axios.get(`/api/used_things/${serial_number}/${product_name}`)
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

export function sendBuyRequest(serial_number, product_name) {
  const request = axios.post(`/api/used_things/${serial_number}/${product_name}/buy_request`)
    .then(response => response.data)
    .catch(error => error.response.data)

  return {
    type: BUY_REQUEST,
    payload: request
  }
}

export function sendThing(serial_number, product_name) {
  const request = axios.post(`/api/used_things/${serial_number}/${product_name}/send`)
    .then(response => response.data)
    .catch(error => error.response.data)

  return {
    type: SEND_THING,
    payload: request
  }
}

export function receiveThing(serial_number, product_name) {
  const request = axios.post(`/api/used_things/${serial_number}/${product_name}/receive`)
    .then(response => response.data)
    .catch(error => error.response.data)

  return {
    type: RECEIVE_THING,
    payload: request
  }
}

export function confirmThing(serial_number, product_name) {
  const request = axios.post(`/api/used_things/${serial_number}/${product_name}/confirm`)
    .then(response => response.data)
    .catch(error => error.response.data)

  return {
    type: CONFIRM_PURCHASE,
    payload: request
  }
}
