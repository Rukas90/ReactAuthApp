import React from "react"
import CustomButton from "./CustomButton"
import GoogleIcon from "../img/icons/social/google.png"

const GoogleLoginButton = () => {
  return (
    <>
      <CustomButton
        text="Continue with Google"
        icon={GoogleIcon}
        link="#"
        extendWidth
      />
    </>
  )
}
export default GoogleLoginButton
