import React, { useEffect, useState } from "react"
import Spinner from "Components/Spinner"
import { GET } from "Utils/Requests"
import Spacer from "Components/Spacer"
import UserPasswordUpdater from "./UserPasswordUpdater"
import UserPasswordSetter from "./UserPasswordSetter"
import { TextSizeOption } from "Utils/Types/TextSizeOption"
import { HorizontalAlignment } from "Utils/Types/HorizontalAlignment"
import LabelHorizontalSeparator from "Templates/LabelHorizontalSeparator"
import withNotifications, {
  WithNotificationsProps,
} from "Contexts/NotificationsContexts"
import { Bag } from "Utils/Bag"

export class PasswordBag extends Bag {
  #PRIMARY_INDICATOR_KEY = "PrimaryIndicator"
  #SECONDARY_INDICATOR_KEY = "SecondaryIndicator"

  SetPrimaryIndicator = (state: boolean) => {
    this.Set(this.#PRIMARY_INDICATOR_KEY, state)
  }
  SetSecondaryIndicator = (state: boolean) => {
    this.Set(this.#SECONDARY_INDICATOR_KEY, state)
  }
  GetPrimaryIndicator = (): boolean =>
    this.TryGet(this.#PRIMARY_INDICATOR_KEY, false).value || false
  GetSecondaryIndicator = (): boolean =>
    this.TryGet(this.#SECONDARY_INDICATOR_KEY, false).value || false

  Reset = () => {
    this.SetPrimaryIndicator(false)
    this.SetSecondaryIndicator(false)
  }
}

export interface PasswordManagementProps extends WithNotificationsProps {
  args: PasswordBag
}

const UserPasswordManagement = ({ notifications }: WithNotificationsProps) => {
  const [hasPassword, setHasPassword] = useState<boolean | null | undefined>(
    null
  )
  const [args] = useState<PasswordBag>(new PasswordBag())

  useEffect(() => {
    const getMetadata = async () => {
      try {
        const response = await GET("/session/user")
        setHasPassword(response.data.hasPassword)
      } catch (error) {
        setHasPassword(undefined)

        notifications.error("Internal Server Error!")
      }
    }
    getMetadata()
  }, [])

  const headerNode = (
    <div className="animate-fade-in">
      <LabelHorizontalSeparator
        label="Account Password"
        alignment={HorizontalAlignment.Start}
        textSize={TextSizeOption.Regular}
      />
      <Spacer space={3.0} unit="rem" isVertical />
    </div>
  )
  const primaryNode = hasPassword ? (
    <UserPasswordUpdater args={args} notifications={notifications} />
  ) : (
    <UserPasswordSetter args={args} notifications={notifications} />
  )

  return (
    <>
      {headerNode}
      {hasPassword !== undefined &&
        (hasPassword === null ? <Spinner /> : primaryNode)}
    </>
  )
}
export default withNotifications(UserPasswordManagement)
