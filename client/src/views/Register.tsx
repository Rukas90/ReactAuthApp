import React from "react"
import RegisterForm from "../components/RegisterForm"

const Register = () => {
  const loginContainerStyle = {
    width: "32.5%",
  }
  const backgroundStyle = {
    backgroundColor: "#29373a",
    backgroundImage: `url('https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
  }

  return (
    <>
      <div className="w-100 h-100 hstack">
        <div className="h-100 bg-black py-4 px-6" style={loginContainerStyle}>
          <RegisterForm />
        </div>
        <div
          className="h-100 flex-grow-1 p-4 background-cover"
          style={backgroundStyle}
        ></div>
      </div>
    </>
  )
}

export default Register
