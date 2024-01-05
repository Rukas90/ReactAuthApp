import React from "react"
import AuthView from "./AuthView"
import LoginForm from "../components/LoginForm"

const LoginView = () => {
  return <AuthView formComponent={<LoginForm />} />
}

export default LoginView
