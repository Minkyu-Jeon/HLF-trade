import React, { useState } from 'react'
import { registerUser } from '../../../_actions/user_action'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Container from '../Container/Container'

function RegisterPage(props) {
  const dispatch = useDispatch()

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [Nickname, setNickname] = useState("")
  const [Address, setAddress] = useState("")
  const [Phone, setPhone] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  const onNicknameHandler = (event) => {
    setNickname(event.currentTarget.value)
  }
  const onAddressHandler = (event) => {
    setAddress(event.currentTarget.value)
  }
  const onPhoneHandler = (event) => {
    setPhone(event.currentTarget.value)
  }
  const onSubmitHandler = (event) => {
    event.preventDefault()

    let body = {
      email: Email,
      password: Password,
      address: Address,
      nickname: Nickname,
      phone: Phone
    }
    
    dispatch(registerUser(body)).then(response => {
      if ( response.payload.success ) {
        props.history.push('/login')
      } else {
        alert('error')
      }
    })

  } 

  return (
    <Container>
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
      }}>
        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
          <label>Email</label>
          <input type='email' value={Email} onChange={onEmailHandler} />
          <label>Password</label>
          <input type='password' value={Password} onChange={onPasswordHandler} />
          <label>Nickname</label>
          <input type='text' value={Nickname} onChange={onNicknameHandler} />
          <label>Address</label>
          <input type='text' value={Address} onChange={onAddressHandler} />
          <label>Phone</label>
          <input type='text' value={Phone} onChange={onPhoneHandler} />

          <br />
          <button>
            회원가입
          </button>
        </form>
      </div>
    </Container>
  )
}

export default withRouter(RegisterPage)