import { SectionText, TagLabel } from "@features/shared"

const TfaSectionHeader = () => {
  return (
    <div className="flex justify-between my-auto">
      <SectionText>Two-factor authentication</SectionText>
      <TagLabel style="red">Not Active</TagLabel>
    </div>
  )
}
export default TfaSectionHeader
