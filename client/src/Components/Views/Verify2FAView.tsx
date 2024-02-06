import React from "react"
import AuthView from "./AuthView"
import Verify2FAForm from "Components/Forms/Verify2FAForm"

const VerifyView = () => {
  return <AuthView formComponent={<Verify2FAForm />} />
}

export default VerifyView
