import React from "react"
import { SessionData } from "Utils/SessionData"
import CustomButton from "Components/Buttons/CustomButton"
import ArrowLeft from "Img/Icons/Common/arrow-left.svg"
import Session from "Components/Session"
import Spacer from "Components/Spacer"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import moment from "moment"

interface Props {
  session: SessionData
  onBack: () => void
}

const SessionViewer = ({ session, onBack }: Props) => {
  const lat = session.geo?.latitude ?? 58.25535754980529
  const log = session.geo?.longitude ?? -4.7551862167938825

  const position: [number, number] = [lat, log]

  return (
    <div className="d-flex flex-col w-100">
      <div className="mb-4 animate-fade-in">
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
            zoom={4}
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
