import useAuthContext from "./useAuthContext"

const useUser = () => {
  const { user } = useAuthContext()
  return user
}
export default useUser
