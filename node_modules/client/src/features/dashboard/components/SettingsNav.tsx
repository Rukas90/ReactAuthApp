import NavButton from "./NavButton"

export const SettingsNav = () => {
  return (
    <ul className="mx-auto flex w-fit gap-10 py-12">
      <NavButton to={"security"}>Security</NavButton>
      <NavButton to={"activity"}>Activity</NavButton>
      <NavButton to={"preferences"}>Preferences</NavButton>
      <NavButton to={"account"}>Account</NavButton>
    </ul>
  )
}
export default SettingsNav
