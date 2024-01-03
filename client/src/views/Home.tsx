import React from "react"
import useAuthCheck from "../hooks/useAuthCheck"
import LoadingScreen from "../templates/LoadingScreen"

const Home = () => {
  if (useAuthCheck()) {
    return (
      <>
        <LoadingScreen />
      </>
    )
  }
  return <>HOME PAGE</>
}

export default Home
