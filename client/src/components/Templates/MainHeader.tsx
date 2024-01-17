import React from "react"
import { useMediaQuery } from "react-responsive"
import Spacer from "./Spacer"
import Logo from "img/icons/common/logo.png"
import LogoutButton from "../LogoutButton"

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
              <span className="fs-5 fw-light text-light">
                OVector Technologies
              </span>
            </>
          )}
        </div>
        <LogoutButton />
      </div>
    </>
  )
}
export default MainHeader
