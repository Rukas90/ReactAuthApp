import React from "react"
import LanguageSwitcher from "../components/LanguageSwitcher"
import Spacer from "../templates/Spacer"
import ErrorMessage from "../components/ErrorMessage"
import { broadcast } from "../contexts/MessageContext"

interface Props {
  formComponent: React.ReactNode // Prop to accept a form component (e.g., LoginForm, RegisterForm).
}

const AuthView: React.FC<Props> = ({ formComponent }) => {
  const { message } = broadcast() // Retrieves broadcasted messages from the MessageContext.

  const containerStyle = {
    width: "32.5%",
  }
  const backgroundStyle = {
    width: "67.5%",
    backgroundColor: "#29373a",
    backgroundImage: `url('https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
  }

  return (
    <div className="w-100 hstack flex-grow-1">
      <div
        className="bg-black pt-4 pb-5 px-6 justify-content-center hstack flex-grow-1"
        style={containerStyle}
      >
        <div className="auth-form-container vstack justify-content-between">
          <div>
            <div>{formComponent}</div>
            {message && <ErrorMessage content={message} />}
          </div>
          <div>
            <Spacer space={3.0} unit="rem" isVertical />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      <div
        className="background-cover hstack position-static"
        style={backgroundStyle}
      ></div>
    </div>
  )
}
export default AuthView
