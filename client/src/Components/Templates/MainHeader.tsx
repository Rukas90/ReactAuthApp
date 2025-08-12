import React from "react"
import { useMediaQuery } from "react-responsive"
import Spacer from "Components/UI/Spacer"
import Logo from "Img/Icons/Common/logo.png"
import LogoutButton from "Components/UI/LogoutButton"

const MainHeader = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 429px)" })

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-between w-100"
        style={{ height: "65px" }}
      >
        <div className="d-flex align-items-center">
          <img src={Logo} className="logo min" />
          {!isMobile && (
            <>
              <Spacer space={1.0} unit="rem" isVertical={false} />
              <span className="fs-5 text-light">Authentification App</span>
            </>
          )}
        </div>
        <LogoutButton />
      </div>
    </>
  )
}
export default MainHeader
