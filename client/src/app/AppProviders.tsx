import { AuthProvider } from "#features/auth/contexts/AuthContext"
import { AuthInitializer } from "#features/auth/contexts/AuthInitializer"
import { LanguageProvider } from "#features/shared/contexts/LanguageContext"
import LanguageInitializer from "#features/shared/contexts/LanguageInitializer"

const AppProviders = ({ children }: React.ComponentProps<"div">) => {
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
