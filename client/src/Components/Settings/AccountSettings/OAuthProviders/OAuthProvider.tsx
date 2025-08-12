import React from "react"
import DefaultIcon from "Img/Icons/Common/person.svg"
import { OAuthProviderProps } from "Components/Props/OAuthProviderProps"

interface Props extends OAuthProviderProps {
  icon?: string
  invertIcon?: boolean
}

const OAuthProvider = ({ data, icon, invertIcon }: Props) => {
  const username = data?.profile?.username

  if (!icon) {
    invertIcon = true
  }

  return (
    <div className="col-12 col-md-6 animate-fade-in">
      <div className="d-flex bg-dark ps-4 py-3 rounded gap-3 align-items-center">
        <img
          src={icon ?? DefaultIcon}
          className={`icon ${invertIcon && "invert"}`}
        />
        <div className="d-flex flex-col overflow-hidden pe-3">
          <span>{data?.provider_name}</span>
          <div className="overflow-scroll hide-scrollbar">
            <span className="fs-7">{username}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default OAuthProvider
