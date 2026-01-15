import { useState } from "react"

const Switcher = () => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }
  return (
    <>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div
            className={`block h-8 w-14 rounded-full ${
              isChecked ? "bg-[#242b31]" : "bg-[#363636]"
            }`}
          ></div>
          <div
            className={`absolute top-1 h-6 w-6 rounded-full ${
              isChecked
                ? "bg-[#1b75db] translate-x-[calc(100%+4px)]"
                : "bg-[#f1f1f1] translate-x-1"
            } transition`}
          ></div>
        </div>
      </label>
    </>
  )
}

export default Switcher
