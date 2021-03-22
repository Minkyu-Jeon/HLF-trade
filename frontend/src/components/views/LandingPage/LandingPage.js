import React, { useEffect } from 'react'
import axios from 'axios'

function LandingPage() {
  useEffect(() => {
    axios.post('/api/sessions', {
      email: "minkyujeon1@gmail.com",
      password: "passw0rd!"
    })
      .then(response => console.log(response.data))
  }, [])

  return (
    <div>
      LandingPage
    </div>
  )
}

export default LandingPage
