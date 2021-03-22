import React from 'react'
import { withRouter } from 'react-router-dom'

function LandingPage() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
    }}>
      LandingPage
    </div>
  )
}

export default withRouter(LandingPage)
