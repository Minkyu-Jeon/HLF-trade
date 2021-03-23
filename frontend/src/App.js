import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import ProductPage from './components/views/ProductPage/ProductPage'
import ProductDetailPage from './components/views/ProductPage/ProductDetailPage'
import ProductRegisterPage from './components/views/ProductPage/ProductRegisterPage'
import Auth from './hoc/auth'

function App() {
  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/" component={Auth(LandingPage, null)} />
        <Route exact path="/products" component={Auth(ProductPage, true)} />
        <Route exact path="/products/new" component={Auth(ProductRegisterPage, true)} />
        <Route exact path="/products/:id" component={Auth(ProductDetailPage, true)} />
        <Route exact path="/login" component={Auth(LoginPage, false)} />
        <Route exact path="/register" component={Auth(RegisterPage, false)} />
      </Switch>
    </Router>
  );
}

export default App;