import { Layout, Menu } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logout } from '../../../_actions/user_action'
import { useDispatch } from 'react-redux'

function Container(props) {
  const { Header, Footer, Content } = Layout

  const currentUser = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const handleClick = (event) => {
    const link = event.item.props.link

    if ( link === 'logout' ) {
      dispatch(logout()).then(response => {
        if ( response.payload.success ) {
          props.history.push('/')
          window.location.href = '/'
        } else {
          alert('로그아웃 실패')
        }
      })
    } else {
      props.history.push(link)
    }
  }

  return (
    <Layout className='layout'>
      <Header>
        <div className='logo' />
        <Menu 
          theme='dark' 
          mode='horizontal'
          onClick={handleClick}
        >
          <Menu.Item key='home' link='/'>Home</Menu.Item>
          {
            currentUser && currentUser.code === 200 &&
            (
            <Menu.Item key='logout' link='logout'>Logout</Menu.Item>
            )
          }
          {
            currentUser && currentUser.code === 200 &&
            (
            <Menu.Item key='mypage' link='mypage'>My Page</Menu.Item>
            )
          }
          {
            currentUser && currentUser.code === 200 &&
            (
            <Menu.Item key='upload' link='upload'>Upload</Menu.Item>
            )
          }
          {
            currentUser && currentUser.code !== 200 &&
            (
            <Menu.Item key='login' link='login'>Login</Menu.Item>
            )
          }
          {
            currentUser && currentUser.code !== 200 &&
            (
            <Menu.Item key='signup' link='register'>Signup</Menu.Item>
            )
          }
        </Menu>
      </Header>
      <Layout>
        <Content>
          {props.children}
        </Content>
      </Layout>
      <Footer>footer</Footer>
    </Layout>
  )
}

export default withRouter(Container)
