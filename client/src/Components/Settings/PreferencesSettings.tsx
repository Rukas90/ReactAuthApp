import React from "react"
import LanguageSwitcher from "Components/UI/LanguageSwitcher"
import WrappedLabeledNode from "Components/UI/WrappedLabeledNode"

const PreferencesSettings = () => {
  return (
    <div className="animate-slide-down">
      <WrappedLabeledNode
        labelID={Localized("LANGUAGE")}
        node={<LanguageSwitcher />}
      />
    </div>
  )
}
export default PreferencesSettings
