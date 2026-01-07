import { AuthProvider } from "#features/auth/contexts/AuthContext"
import { LanguageProvider } from "#features/shared/contexts/LanguageContext"
import LanguageInitializer from "#features/shared/contexts/LanguageInitializer"

const AppProviders = ({ children }: React.ComponentProps<"div">) => {
  return (
    <LanguageProvider>
      <LanguageInitializer>
        <AuthProvider>{children}</AuthProvider>
      </LanguageInitializer>
    </LanguageProvider>
  )
}
export default AppProviders
