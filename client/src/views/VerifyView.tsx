import React from "react"
import AuthView from "./AuthView"
import VerifyForm from "../components/VerifyForm"

const VerifyView = () => {
  return <AuthView formComponent={<VerifyForm />} />
}

export default VerifyView
