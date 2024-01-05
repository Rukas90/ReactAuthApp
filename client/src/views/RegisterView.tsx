import React from "react"
import AuthView from "./AuthView"
import RegisterForm from "../components/RegisterForm"

const RegisterView = () => {
  return <AuthView formComponent={<RegisterForm />} />
}

export default RegisterView
