import React, { Component } from "react"
import "./main.css"
import { Form, Button } from "react-bootstrap"
import fetch from "node-fetch"
import { authorize } from "./index"
import { Redirect } from "react-router-dom"

const urlLogin = "http://mep.re:8080/login"

class Login extends Component {
  constructor() {
    super()
    this.tryLogin = this.tryLogin.bind(this)
    this.state = {
      errorVisibility: "none",
      redirect: false
    }
  }

  tryLogin() {
    fetch(urlLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: document.getElementById("username").value,
        password: document.getElementById("password").value
      })
    })
      .then(async data => {
        if(data.status === 200) {
          data = await data.json()
          authorize()
          localStorage.setItem("token", data.token) // TODO: check and use localStorage.getItem("token") in add and remove buttons
          this.setState({redirect: true})
        } else {
          this.setState({errorVisibility: "block"})
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({errorVisibility: "block"})
      })
  }

  renderRedirect = () => {
    if(this.state.redirect === true) {
      return (
        <Redirect to={{
          pathname: "/"
        }} />
      )
    }
  }

  render() {
    return(
      <div className="formLogin">
        {this.renderRedirect()}
        <Form encType="multipart/form-data">
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="username" id="username"/>
          </Form.Group>
          <Form.Group>
          <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="password" id="password"/>
            <p style={{color: "red", marginTop: "3px", display: this.state.errorVisibility}}>Error in login, something went wrong</p>
          </Form.Group>
          <Form.Group>
            <Button id="submitLogin" onClick={this.tryLogin}>Login</Button>
          </Form.Group>
        </Form>
      </div>
    )
  }
}

export default Login
