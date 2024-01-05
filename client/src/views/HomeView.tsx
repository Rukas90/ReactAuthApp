import React from "react"
import useAuthCheck from "../hooks/useAuthCheck"
import LoadingScreen from "../templates/LoadingScreen"
import CustomButton from "../components/CustomButton"
import { useTranslation } from "react-i18next"
import { Logout } from "../utils/Auth"
import { useNavigate } from "react-router-dom"

const HomeView = () => {
  const authCheck = useAuthCheck()
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (authCheck.isLoading) {
    return <LoadingScreen />
  }
  const handleLogout = async () => {
    const response = await Logout()

    if (response.status === 200) {
      navigate("/login")
    }
  }
  return (
    <div>
      <CustomButton
        text={t("LOG_OUT")}
        icon=""
        action={handleLogout}
        extendWidth
      />
    </div>
  )
}

export default HomeView
