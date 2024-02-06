import React from "react"
import { useMediaQuery } from "react-responsive"
import LanguageSwitcher from "Components/LanguageSwitcher"
import Spacer from "Components/Spacer"
import ErrorMessage from "Components/ErrorMessage"
import { broadcast } from "Contexts/MessageContext"

interface Props {
  formComponent: React.ReactNode // Prop to accept a form component (e.g., LoginForm, RegisterForm).
}

const AuthView: React.FC<Props> = ({ formComponent }) => {
  const { message } = broadcast() // Retrieves broadcasted messages from the MessageContext.

  const fullScreen = useMediaQuery({ query: "(max-width: 1400px)" })

  const containerStyle = {
    width: fullScreen ? "100%" : "32.5%",
  }
  const backgroundStyle = {
    width: "67.5%",
    backgroundColor: "#29373a",
    backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
  }
  return (
    <div className="w-100 d-flex h-min-100vh">
      <div
        className="bg-black pt-2 pt-mb-4 pb-4 pb-md-5 px-3 px-md-6 justify-content-center flex-row d-flex h-auto"
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
      {!fullScreen && (
        <div className="background-cover d-flex" style={backgroundStyle}></div>
      )}
    </div>
  )
}
export default AuthView
