import React from "react"
import { SessionData } from "utils/SessionData"
import CustomButton from "components/Buttons/CustomButton"
import ArrowLeft from "img/icons/common/arrow-left.svg"
import Session from "components/Session"
import Spacer from "components/Templates/Spacer"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import moment from "moment"

interface Props {
  session: SessionData
  onBack: () => void
}

const SessionViewer = ({ session, onBack }: Props) => {
  const position: [number, number] = [55.7236338846973, 24.324018242382845]

  return (
    <div className="d-flex flex-col w-100">
      <div className="mb-4 animate-slide-left">
        <CustomButton
          text="Back to Sessions"
          icon={ArrowLeft}
          style="blank"
          invertImg
          classes="icon-btn"
          padding={false}
          action={onBack}
        />
      </div>
      <Session data={session} />
      <Spacer space={1.5} unit="rem" isVertical />
      <div className="bg-darker animate-fade-in rounded overflow-hidden">
        <span className="d-flex flex-col gap-2 bg-dark px-4 pt-4 d-lg-none">
          <p className="text-secondary m-0 fw-semibold fs-7">Last Activity:</p>
          <p className="opacity-75 fs-res-body">
            {moment(session.last_activity_time).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}
          </p>
        </span>
        <div className="p-4">
          <MapContainer
            center={position}
            zoom={13}
            style={{
              height: "400px",
              borderRadius: "0.375rem",
              overflow: "hidden",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                Location based on IP address. <br /> Approximate area.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
export default SessionViewer
