import React from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../../_actions/user_action'

function LandingPage(props) {

  const dispatch = useDispatch()

  const onClickHandler = (event) => {
    console.log(props)
    event.preventDefault()
    
    dispatch(logout()).then(response => {
      if ( response.payload.success ) {
        props.history.push('/')
      } else {
        alert('로그아웃 실패')
      }
    })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
    }}>
      LandingPage
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  )
}

export default withRouter(LandingPage)
