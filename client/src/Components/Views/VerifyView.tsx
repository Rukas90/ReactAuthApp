import React from "react"
import AuthView from "./AuthView"
import VerifyForm from "Components/Templates/Forms/VerifyForm"

const VerifyView = () => {
  return <AuthView formComponent={<VerifyForm />} />
}

export default VerifyView
