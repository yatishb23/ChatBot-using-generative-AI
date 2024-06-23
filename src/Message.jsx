import React from 'react'
import "./Message.css"

function Message({text}) {
  return (
    <div className='user-message'>
    <div className='message-bubble'>
        <p>{text}</p>
    </div>
    </div>
  )
}

export default Message