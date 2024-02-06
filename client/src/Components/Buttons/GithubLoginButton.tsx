import React from "react"
import CustomButton from "./CustomButton"
import GithubIcon from "Img/Icons/Social/github.svg"
import { BuildApiUrl } from "Utils/Requests"

interface Props {
  prompt?: boolean
}

/**
 * GithubLoginButton Component
 *
 * Renders a button for Github login functionality.
 *
 * Utilizes the CustomButton component to create a specialized button for Github login.
 */
const GithubLoginButton = ({ prompt = false }: Props) => {
  const url = BuildApiUrl(`/auth/github${prompt ? "/register" : ""}`)

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
