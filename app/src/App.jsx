import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message:"Hello, I'm ChatGPT :)",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    // clone array to update newMessage
    const newMessages = [...messages, newMessage];

    // update message state
    setMessages(newMessages);

    // set up typing indicator
    setTyping(true);
    // process message to ChatGPT
  }

  return (
    <div className="App">
      <div style={{position:"relative", height: "800px", width: "700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing"/> : null }>
              {messages.map((message, i) => {
                return <Message key={i} model={message}/>
              })}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
