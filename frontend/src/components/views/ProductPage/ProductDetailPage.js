import React, { useEffect, useState } from 'react'
import { Button, Descriptions } from 'antd'
import Container from '../Container/Container'
import { useDispatch, useSelector } from 'react-redux'
import { getUsedThing, sendBuyRequest } from '../../../_actions/used_thing_action'
import { withRouter } from 'react-router-dom'

function ProductDetailPage(props) {
  const [product, setProduct] = useState({})
  const { currentUser: currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const pathParams = [props.match.params.serial_number, props.match.params.product_name]

  useEffect(() => {
    dispatch(getUsedThing(...pathParams)).then(response => {
      if ( response.payload.code != 200 ) {
        alert("an error occured")
        return
      }

      setProduct(response.payload.data)
    })
  }, [])

  const handleBuyRequest = (event) => {
    event.preventDefault()
    
    dispatch(sendBuyRequest(...pathParams)).then(response => {
      if ( response.payload.code != 200 ) {
        alert("an error occured")
        return
      } else {
        alert('Your buy request is successfully sent')
        props.history.push('/products')
      }
    })
  }

  const backToList = (event) => {
    event.preventDefault()

    props.history.goBack()
  }

  return (
    <Container>
      <Descriptions title="Product Details" bordered size='small' column={2}>
        <Descriptions.Item label="Title" span={2}>{product.Title}</Descriptions.Item>
        <Descriptions.Item label="ProductName">{product.ProductName}</Descriptions.Item>
        <Descriptions.Item label="Category">{product.Category}</Descriptions.Item>
        <Descriptions.Item label="Price">{product.Price}원</Descriptions.Item>
        <Descriptions.Item label="Seller">
          {product.Seller}
        </Descriptions.Item>
        {
          currentUser.data.user.email != product.Seller &&
          (
            <Descriptions.Item label="Buy Request" span={2}>
              <Button type='primary' onClick={handleBuyRequest}>Buy Request</Button>
            </Descriptions.Item>
          )
        }
      </Descriptions>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <img src={product.ImageUrl} />
      </div>
      <p>
        {product.Description}
      </p>
      <div style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={backToList}>Back</Button>
      </div>
    </Container>
  )
}

export default withRouter(ProductDetailPage)
