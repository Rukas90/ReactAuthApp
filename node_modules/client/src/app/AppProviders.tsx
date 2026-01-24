import { AuthProvider, AuthInitializer } from "@features/auth"
import { LanguageProvider, LanguageInitializer } from "@features/localization"
import { SkeletonTheme } from "react-loading-skeleton"

const AppProviders = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  return (
    <LanguageProvider>
      <LanguageInitializer>
        <AuthProvider>
          <AuthInitializer>
            <SkeletonTheme baseColor="#202020" highlightColor="#404040">
              {children}
            </SkeletonTheme>
          </AuthInitializer>
        </AuthProvider>
      </LanguageInitializer>
    </LanguageProvider>
  )
}
export default AppProviders
