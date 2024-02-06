import { useTranslation } from "react-i18next"

export const useLocalizedText = (
  key: LocalizableText,
  options?: TranslationOptions
): string => {
  const { t } = useTranslation()

  if (typeof key === "object" && "_type" in key) {
    return key._type === "LocalizedTextID" ? t(key.value, options) : key.value
  }
  return key
}
