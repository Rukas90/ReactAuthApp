import React from "react"
import AuthView from "./AuthView"
import OAuthIdentificationForm from "Components/Forms/OAuthIdentificationForm"

const OAuthIdentifyView = () => {
  return <AuthView formComponent={<OAuthIdentificationForm />} />
}

export default OAuthIdentifyView
