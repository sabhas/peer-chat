import React, { useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./index.css"

export const Lobby = () => {
  const navigate = useNavigate()
  const inviteLink = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate(inviteLink.current!.value)
  }

  return (
    <main id="lobby-container">
      <div id="form-container">
        <div id="form__container__header">
          <p>👋 Create OR Join a Room</p>
        </div>

        <div id="form__content__wrapper">
          <form id="join-form" onSubmit={handleSubmit}>
            <input ref={inviteLink} type="text" name="invite_link" required />
            <input type="submit" value="Join Room" />
          </form>
        </div>
      </div>
    </main>
  )
}
