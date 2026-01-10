import { AuthProvider, AuthInitializer } from "@auth/providers"
import { LanguageInitializer } from "@localization/components"
import { LanguageProvider } from "@localization/providers"

const AppProviders = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  return (
    <LanguageProvider>
      <LanguageInitializer>
        <AuthProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </AuthProvider>
      </LanguageInitializer>
    </LanguageProvider>
  )
}
export default AppProviders
