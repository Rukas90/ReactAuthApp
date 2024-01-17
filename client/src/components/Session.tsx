import React from "react"
import { SessionData } from "utils/SessionData"
import moment from "moment"
import { useMediaQuery } from "react-responsive"
import ArrowRight from "../img/icons/common/arrow-right.svg"
import CustomButton from "./Buttons/CustomButton"

interface Props {
  data: SessionData
  onSelect?: (sessionID: string) => void
}

const Session = ({ data, onSelect = undefined }: Props) => {
  const iconSrc = `./src/img/icons/devices/${data.device_type.toLowerCase()}.svg`

  const handleSessionSelection = () => onSelect && onSelect(data.session_id)

  return (
    <>
      <div className="d-flex animate-slide-down position-relative w-100 px-4 py-3 rounded bg-darker m-auto flex-row align-items-center justify-content-between">
        <div className={`overflow-hidden ${onSelect && "pe-4"}`}>
          <div className="d-flex flex-row gap-3">
            <div className="d-flex flex-row gap-3">
              <div
                className={`bg-${
                  data.is_current ? "success" : "danger"
                } fs-9 py-1 px-1 text-light rounded l tracking-wide m-auto`}
              />
              <img src={iconSrc} className=" invert opacity-75" />
            </div>
            <div className="d-flex flex-row gap-3 overflow-scroll hide-scrollbar">
              <div className="m-0 bg-dark px-3 py-1 rounded text-nowrap fs-res-body">
                <p className="m-auto text-secondary fs-7 fw-semibold">IP:</p>
                {data.ip_address}
              </div>

              <div className="m-0 bg-dark px-3 py-1 rounded text-nowrap fs-res-body">
                <p className="m-auto text-secondary fs-7 fw-semibold">
                  Location:
                </p>
                {data.location}
              </div>

              <div className="m-0 bg-dark px-3 py-1 rounded text-nowrap fs-res-body">
                <p className="m-auto text-secondary fs-7 fw-semibold">
                  Source:
                </p>
                {data.source}
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute end-0">
          <div className="d-flex gap-3 me-3 overflow-hidden">
            {
              <div className="m-0 bg-dark px-3 py-1 rounded d-lg-block d-none">
                <p className="m-auto text-secondary fs-7 fw-semibold">
                  Last Activity:
                </p>
                {moment(data.last_activity_time).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              </div>
            }
            {onSelect && (
              <CustomButton
                style="blank"
                padding={false}
                icon={ArrowRight}
                action={handleSessionSelection}
                classes="m-auto icon-btn"
                invertImg
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default Session
