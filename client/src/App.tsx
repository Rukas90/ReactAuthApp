import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./views/Home"
import Login from "./views/Login"
import Register from "./views/Register"
import useLanguageSetting from "./hooks/useLanguageSetting"

/**
 * App Component
 *
 * The main component that orchestrates the routing and language settings of the application.
 *
 * Features:
 * - Utilizes the `useLanguageSetting` hook to manage language preferences across the application.
 * - Defines routes for different pages using react-router-dom.
 */
const App = () => {
  useLanguageSetting() // Initialize language settings

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
