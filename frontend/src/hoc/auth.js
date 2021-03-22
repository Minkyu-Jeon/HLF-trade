import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'

export default function(SpecificComponent, option) {

  function AuthenticationCheck(props) {
    const dispatch = useDispatch()
  
    useEffect(() => {
      dispatch(auth()).then(response => {
        // Not logined
        if ( !response.payload.success ) {
          if ( option ) {
            props.history.push('/')
          }
        } else {
          if ( option === false ) {
            props.history.push('/')
          }
        }

      })
    }, [])

    return (
      <SpecificComponent />
    )
  }

  return AuthenticationCheck
}
