import React, { useEffect, useState } from 'react'
import { Button, Descriptions } from 'antd'
import Container from '../Container/Container'
import { useDispatch } from 'react-redux'
import { getUsedThing } from '../../../_actions/used_thing_action'
import { withRouter } from 'react-router-dom'

function ProductDetailPage(props) {
  const [product, setProduct] = useState({})
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUsedThing(props.match.params.id)).then(response => {
      if ( response.payload.code != 200 ) {
        alert("an error occured")
        return
      }

      setProduct(response.payload.data)
    })
  }, [])

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