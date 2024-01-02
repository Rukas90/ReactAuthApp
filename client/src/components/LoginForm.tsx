import React from "react"
import GoogleLoginButton from "./GoogleLoginButton"
import XLoginButton from "./XLoginButton"
import FormHeader from "../templates/FormHeader"
import LabelHorizontalSeparator from "../templates/LabelHorizontalSeparator"
import Spacer from "../templates/Spacer"
import InputField from "./InputField"
import CustomButton from "./CustomButton"

const LoginForm = () => {
  return (
    <>
      <FormHeader
        header="Login"
        secondary="Don't have an account?"
        linkText="Register"
        linkHref="/register"
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center align-items-center vstack">
        <GoogleLoginButton />
        <XLoginButton />
        <LabelHorizontalSeparator label="OR" />
        <Spacer space={1.5} unit="rem" isVertical />
        <div className="w-100">
          <InputField type="email" placeholder="Email" autocomplete="email" />
          <Spacer space={1.5} unit="rem" isVertical />
          <InputField
            type="password"
            placeholder="Password"
            hideable
            isVisible={false}
          />
        </div>
        <Spacer space={1.5} unit="rem" isVertical />
        <span>
          <a href="#" className="link-light fw-light">
            Forgot the password?
          </a>
        </span>
        <Spacer space={1.5} unit="rem" isVertical />
        <CustomButton text="Log in" icon="" link="#" extendWidth />
      </div>
    </>
  )
}

export default LoginForm
