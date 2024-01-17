import React from "react"
import AuthView from "./AuthView"
import VerifyForm from "../VerifyForm"

const VerifyView = () => {
  return <AuthView formComponent={<VerifyForm />} />
}

export default VerifyView
