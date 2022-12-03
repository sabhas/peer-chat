import React from "react"
import { Link } from "react-router-dom"
import cameraIcon from "../../icons/camera.png"
import micIcon from "../../icons/mic.png"
import phoneIcon from "../../icons/phone.png"
import "./index.css"

const commonPropsForVideoTag = {
  className: "video-player",
  autoPlay: true,
  playsInline: true,
}

export const Room = () => {
  return (
    <>
      <div id="videos">
        <video {...commonPropsForVideoTag} id="user-1"></video>
        <video {...commonPropsForVideoTag} id="user-2"></video>
      </div>

      <div id="controls">
        <div className="control-container" id="camera-btn">
          <img src={cameraIcon} />
        </div>

        <div className="control-container" id="mic-btn">
          <img src={micIcon} />
        </div>

        <Link to="/">
          <div className="control-container" id="leave-btn">
            <img src={phoneIcon} />
          </div>
        </Link>
      </div>
    </>
  )
}
