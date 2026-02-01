import { OutlineBoxContainer, SectionText } from "@features/shared"
import SettingsPanel from "../components/SettingsPanel"
import { LanguagePicker } from "@src/features/localization"
import { useTranslation } from "react-i18next"

const PreferenceSettings = () => {
  const { t } = useTranslation()
  return (
    <SettingsPanel>
      <OutlineBoxContainer
        className="flex justify-between items-center "
        useDefaultPadding={false}
      >
        <div className="pl-4">
          <SectionText>{t("LANGUAGE")}</SectionText>
        </div>

        <div className="h-full px-4 py-3 bg-stone-900">
          <LanguagePicker />
        </div>
      </OutlineBoxContainer>
    </SettingsPanel>
  )
}
export default PreferenceSettings
