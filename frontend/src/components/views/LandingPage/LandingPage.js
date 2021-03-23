import React from 'react'
import { withRouter } from 'react-router-dom'
import Container from '../Container/Container'

function LandingPage(props) {


  return (
    <Container>
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
      }}>
        LandingPage
      </div>
    </Container>
  )
}

export default withRouter(LandingPage)
