import React from "react"
import AuthView from "./AuthView"
import LoginForm from "../Forms/LoginForm"

const LoginView = () => {
  return <AuthView formComponent={<LoginForm />} />
}

export default LoginView
