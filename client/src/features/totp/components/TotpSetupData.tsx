import { CopyableField, HeadingText, PlainText } from "@features/shared"
import type { TotpData } from "@project/shared"

interface Props {
  data: TotpData | null
}
const TotpSetupData = ({ data }: Props) => {
  return (
    <>
      <HeadingText>Setup authenticator app</HeadingText>
      <PlainText>Scan the QR code below using an authenticator app:</PlainText>
      <img className="my-4 rounded-sm w-48" src={data?.qrCodeURi} />
      <PlainText>Or enter the setup key manually:</PlainText>
      <CopyableField
        id="totp-setup-key"
        value={data?.setupKey}
        readOnly
        isHidden
      />
      <PlainText className="mt-2">Verify the code from the app:</PlainText>
    </>
  )
}
export default TotpSetupData
