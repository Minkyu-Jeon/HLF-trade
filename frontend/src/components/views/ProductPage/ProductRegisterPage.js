import { Button, Input, Form, InputNumber } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import Container from '../Container/Container'
import { withRouter } from 'react-router-dom'
import { registerUsedThing } from '../../../_actions/used_thing_action'

function ProductRegisterPage(props) {
  const dispatch = useDispatch()

  const handleOnFinished = (formData) => {
    dispatch(registerUsedThing(formData)).then(response => {
      if ( response.payload.code != 200 ) {
        alert('an error occurred')
        return
      }

      props.history.push('/products')
    })
  }

  return (
    <Container>
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
      }}>
      <Form
        layout='horizontal'
        onFinish={handleOnFinished}
        initialValues={{
          title: '',
          product_name: '',
          image_url: '',
          price: 0,
          description: ''
        }}
      >
        <Form.Item label='Title' 
          name='title' 
          required 
          tooltip='This is a required field' 
          rules={[{ required: true }]} >
          <Input placeholder='Title' />
        </Form.Item>
        <Form.Item label='ProductName' 
          name='product_name' 
          required 
          tooltip='This is a required field'
          rules={[{ required: true }]}>
          <Input placeholder='ProductName' />
        </Form.Item>
        <Form.Item label='Category' 
          name='category' 
          required 
          tooltip='This is a required field'
          rules={[{ required: true }]}>
          <Input placeholder='Category' />
        </Form.Item>
        <Form.Item label='ImageUrl' 
          name='image_url' 
          required 
          tooltip='This is a required field'
          rules={[{ required: true }]}>
          <Input placeholder='ImageUrl' />
        </Form.Item>
        <Form.Item label='Price' name='price' required tooltip='This is a required field'>
          <InputNumber placeholder='Price' />
        </Form.Item>
        <Form.Item label='Description' name='description'>
          <Input placeholder='Description' />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit'>Submit</Button>
          <Button type='link' onClick={props.history.goBack}>Back</Button>
        </Form.Item>

      </Form>
      </div>
    </Container>
  )
}

export default withRouter(ProductRegisterPage)
