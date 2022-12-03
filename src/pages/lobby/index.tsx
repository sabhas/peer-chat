import React from "react"
import "./index.css"

export const Lobby = () => {
  return (
    <main id="lobby-container">
      <div id="form-container">
        <div id="form__container__header">
          <p>👋 Create OR Join a Room</p>
        </div>

        <div id="form__content__wrapper">
          <form id="join-form">
            <input type="text" name="invite_link" required />
            <input type="submit" value="Join Room" />
          </form>
        </div>
      </div>
    </main>
  )
}
