import React from "react"
import CustomButton from "./CustomButton"
import TwitterIcon from "../img/icons/social/twitter.png"

const XLoginButton = () => {
  return (
    <>
      <CustomButton
        text="Continue with Twitter"
        icon={TwitterIcon}
        link="#"
        extendWidth
      />
    </>
  )
}
export default XLoginButton
