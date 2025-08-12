import React from "react"
import CustomButton from "./CustomButton"
import GithubIcon from "Img/Icons/Social/github.svg"
import { BuildApiUrl } from "Utils/Requests"

/**
 * GithubLoginButton Component
 *
 * Renders a button for Github login functionality.
 *
 * Utilizes the CustomButton component to create a specialized button for Github login.
 */
const GithubLoginButton = () => {
  const url = BuildApiUrl(`/auth/github`)

  return (
    <>
      <CustomButton
        text={Translate("CONTINUE_WITH_GITHUB")}
        icon={GithubIcon}
        link={url}
        extendWidth
      />
    </>
  )
}
export default GithubLoginButton
