import React from "react"

const NavigationBar = () => {
  return (
    <>
      <nav className="w-100">
        <ul className="navbar-nav navbar-expand-lg navbar-light bg-light hstack gap-3 p-3 rounded">
          <li className="nav-item text-black">
            <a className="nav-link active" aria-current="page" href="/">
              Home
            </a>
          </li>
          <li className="nav-item text-black">
            <a className="nav-link active" aria-current="page" href="/">
              Home
            </a>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default NavigationBar
