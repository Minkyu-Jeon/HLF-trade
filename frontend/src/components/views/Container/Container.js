import { Layout, Menu, Modal, Button } from 'antd'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logout, enrollNetwork } from '../../../_actions/user_action'

function Container(props) {
  const { Header, Footer, Content } = Layout
  const { SubMenu } = Menu 
  const dispatch = useDispatch()

  const { currentUser: currentUser } = useSelector((state) => state.user)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const handleClickButton = (event) => {
    event.preventDefault()
    dispatch(enrollNetwork('Org1')).then(response => {
      if ( response.payload.code == 200 ) {
        alert('You are successfully enrolled')
        setIsModalVisible(false)
      } else {
        alert('an error occured')
      }
    })
  } 


  const handleClick = (event) => {
    const link = event.item.props.link
    const key = event.key

    if ( link === 'logout' ) {
      dispatch(logout()).then(response => {
        if ( response.payload.success ) {
          props.history.push('/')
          window.location.href = '/'
        } else {
          alert('로그아웃 실패')
        }
      })
    } else if ( key === 'myinfo:show' ) {
      showModal()
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
            currentUser && currentUser.code == 200 &&
            (
            <SubMenu key='myinfo' title={ currentUser.data.user.nickname }>
              <Menu.Item key='myinfo:logout' link='/logout'>Logout</Menu.Item>
              <Menu.Item key='myinfo:show'>MyInfo</Menu.Item>
            </SubMenu>
            )
          }
          {
            currentUser && currentUser.code === 200 &&
            (
            <Menu.Item key='products' link='/products'>Products</Menu.Item>
            )
          }
          {
            currentUser && currentUser.code === 200 &&
            (
            <Menu.Item key='upload' link='/upload'>Upload</Menu.Item>
            )
          }
          {
            currentUser && currentUser.code !== 200 &&
            (
            <Menu.Item key='login' link='/login'>Login</Menu.Item>
            )
          }
          {
            currentUser && currentUser.code !== 200 &&
            (
            <Menu.Item key='signup' link='/register'>Signup</Menu.Item>
            )
          }
        </Menu>
      </Header>
      <Layout>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            {props.children}
          </div>
        </Content>
      </Layout>
      <Footer></Footer>
      {
        currentUser && currentUser.code == 200 && (
          <Modal title="My Information" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>Nickname: { currentUser.data.user.nickname }</p>
            <p>Email: { currentUser.data.user.email }</p>
            <p>Phone: { currentUser.data.user.phone }</p>
            <p>Address: { currentUser.data.user.address }</p>
            <p>Org: { currentUser.data.org || (
              <Button type="primary" onClick={handleClickButton}>Enroll Org</Button>
            ) }</p>
          </Modal>
        )
      }
    </Layout>
  )
}

export default withRouter(Container)
