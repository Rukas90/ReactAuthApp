import { AuthProvider } from "#contexts/AuthContext"
import useLanguageSetting from "#hooks/useLanguageSetting"
import AppRouter from "./AppRouter"

const App = () => {
  useLanguageSetting()

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
export default App
