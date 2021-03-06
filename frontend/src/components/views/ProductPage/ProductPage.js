import React, { useEffect, useState } from 'react'
import Container from '../Container/Container'
import { useDispatch } from 'react-redux'
import { getUsedThingList } from '../../../_actions/used_thing_action'
import { Button, Table } from 'antd'
import { Link, withRouter } from 'react-router-dom'


function ProductPage() {
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const columns = [
    {
      title: 'Category',
      key: 'Category',
      dataIndex: 'Category'
    },
    {
      title: 'Title',
      key: 'Title',
      dataIndex: 'Title',
      render: (text, record) => {
        return <Link to={`/products/${record.SerialNumber}/${record.ProductName}`}>{text}</Link>
      }
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'Price'
    },
    {
      title: 'ProductName',
      key: 'product_name',
      dataIndex: 'ProductName'
    },
    {
      title: 'Seller',
      key: 'seller',
      dataIndex: 'Seller'
    },
  ]

  const transformArray = (originAry) => {
    return originAry.map((item) => {
      return {key: item.Key, ...item.Record}
    })
  }

  useEffect(() => {
    dispatch(getUsedThingList()).then(response => {
      if ( response.payload.code != 200 ) {
        alert("an error occured")
        return
      }

      setProducts(transformArray(response.payload.data))
    })
  }, [])
  return (
    <Container>
      <h1>Product List</h1>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <Button type='primary' href='/products/new'>Register New Product</Button>
      </div>
      <Table dataSource={products} columns={columns} />
    </Container>
  )
}

export default withRouter(ProductPage)
