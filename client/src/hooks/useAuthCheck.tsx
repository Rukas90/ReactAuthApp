import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const useAuthCheck = (redirectPath = "/login") => {
  const [isLoading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/status")
      .then((res) => {
        if (!res.data.authenticated) {
          navigate(redirectPath)
        }
      })
      .catch((error) => {
        console.error("Error checking auth status: ", error)
        navigate(redirectPath)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [navigate, redirectPath])

  return isLoading
}

export default useAuthCheck
