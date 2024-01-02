import React, { useEffect, useState } from "react"
import NavigationBar from "../components/NavigationBar"
import LoginForm from "../components/LoginForm"
import axios from "axios"

const Home = () => {
  const [bg, setBg] = useState("")

  /*useEffect(async () => {
    const data = await FetchBackground()

    console.log(data)

    setBg("#29373a")
  })*/

  const loginContainerStyle = {
    width: "32.5%",
  }

  return (
    <>
      <div className="w-100 h-100 hstack">
        <div className="h-100 bg-black py-4 px-6" style={loginContainerStyle}>
          <LoginForm />
        </div>
        <div className="h-100 flex-grow-1 p-4 bg">
          <NavigationBar />
        </div>
      </div>
    </>
  )
}

const FetchBackground = async () => {
  try {
    const response = await axios.get("https://api.unsplash.com/photos/random")
    return response.data
  } catch {
    return null
  }
}

export default Home
