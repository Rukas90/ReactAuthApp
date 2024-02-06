import React from "react"
import AuthView from "./AuthView"
import RegisterForm from "Components/Forms/RegisterForm"

const RegisterView = () => {
  return <AuthView formComponent={<RegisterForm />} />
}

export default RegisterView
