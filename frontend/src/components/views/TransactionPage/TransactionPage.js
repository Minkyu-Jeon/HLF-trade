import React, { useState, useEffect } from 'react'
import Container from '../Container/Container'
import { Tabs, List, Skeleton, Avatar, Button } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSellingList, getBuyingList } from '../../../_actions/transaction_action'
import { sendThing, receiveThing, confirmThing } from '../../../_actions/used_thing_action'

function TransactionPage(props) {
  const { currentUser: currentUser } = useSelector((state) => state.user)

  const { TabPane } = Tabs
  const dispatch = useDispatch()

  const handleTabChanged = (key) => {
    setCurrentTab(parseInt(key))
    loadUsedThing(key)
  }
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [currentTab, setCurrentTab] = useState(1)

  const sendProduct = (event, product) => {
    dispatch(sendThing(product.SerialNumber, product.ProductName)).then(response => {
      if ( response.payload.code != 200 ) {
        alert('an error occured')
        return
      }

      loadUsedThing(currentTab)
      alert('successfully sent')
    })
  }

  const receiveProduct = (event, product) => {
    dispatch(receiveThing(product.SerialNumber, product.ProductName)).then(response => {
      if ( response.payload.code != 200 ) {
        alert('an error occured')
        return
      }

      loadUsedThing(currentTab)
      alert('successfully received')
    })
  }

  const confirmProduct = (event, product) => {
    dispatch(confirmThing(product.SerialNumber, product.ProductName)).then(response => {
      if ( response.payload.code != 200 ) {
        alert('an error occured')
        return
      }

      loadUsedThing(currentTab)
      alert('successfully confirmed')
    })
  }

  useEffect(() => {
    loadUsedThing(currentTab)
  }, [currentUser])

  const decorateArray = (originAry) => {
    return originAry.map((item) => {
      let newItem = { key: item.Key, ...item.Record }
      newItem.actions = []

      const transactionHistoryButton = <Button type='primary'>Show Transaction History</Button>
      newItem.actions.push(transactionHistoryButton)
      switch(newItem.currentState) {
        case 1:
          newItem.actions.pop()
          break
        case 2:
          if ( newItem.Buyer != currentUser.data.user.email ) {
            newItem.actions.push(<Button type='primary' onClick={(e) => sendProduct(e, newItem)}>Send Product</Button>)
          }
          break
        case 3:
          if ( newItem.Seller != currentUser.data.user.email ) {
            newItem.actions.push(<Button type='primary' onClick={(e) => receiveProduct(e, newItem)}>Receive Product</Button>)
          }
          break
        case 4:
          if ( newItem.Seller != currentUser.data.user.email ) {
            newItem.actions.push(<Button type='primary' onClick={(e) => confirmProduct(e, newItem)}>Confirm purchase</Button>)
          }
          break
        case 5:
          break
        default:
          break
      }
      return newItem
    })
  }

  const loadUsedThing = (type) => {
    setIsLoading(true)
    if ( currentUser == undefined ) {
      setIsLoading(false)
      return
    }
    let method = getSellingList
    if ( type == 2 ) {
      method = getBuyingList
    }

    dispatch(method(currentUser.data.user.id)).then(response => {
      if ( response.payload.code != 200 ) {
        alert('an error ouccured')
        setIsLoading(false)
        return
      }
      setIsLoading(false)
      setProducts(decorateArray(response.payload.data))
    })
  }

  return (
    <Container>
      <h1>My Transaction History</h1>
      <Tabs defaultActiveKey={currentTab} onChange={handleTabChanged}>
        <TabPane tab="Selling" key="1">
          <List
          itemLayout="horizontal"
          loading={isLoading}
          dataSource={products}
          renderItem={item => (
            <List.Item
              actions={item.actions}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item.ImageUrl} />
                  }
                  title={<Link to={`/products/${item.SerialNumber}/${item.ProductName}`}>{item.Title}</Link>}
                  description={item.Description}
                />
              </Skeleton>
            </List.Item>
          )}
        />
        </TabPane>
        <TabPane tab="Buying" key="2">
          <List
            itemLayout="horizontal"
            loading={isLoading}
            dataSource={products}
            renderItem={item => (
              <List.Item
                actions={item.actions}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.ImageUrl} />
                    }
                    title={<Link to={`/products/${item.SerialNumber}/${item.ProductName}`}>{item.Title}</Link>}
                    description={item.Description}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Container>
  )
}

export default withRouter(TransactionPage)
