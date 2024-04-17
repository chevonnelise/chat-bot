import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": "Explain things like you're talking to a software professional with 1 year of experience."
}


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
      direction:"outgoing"
    }

    // clone array to update newMessage
    const newMessages = [...messages, newMessage];

    // update message state
    setMessages(newMessages);

    // set up typing indicator
    setTyping(true);
    // process message to ChatGPT
    await processMessageToChatGPT(newMessages);

  }

  async function processMessageToChatGPT(chatMessages) {
    // chatMessages {sender:"user" or "ChatGPT", message: "The message content"}
    // apiMessages {role:"user" or "assistant", content: "The message content"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender === "ChatGPT") {
        role="assistant"
      } else {
        role ="user"
      }
      return { role: role, content: messageObject.message}
    });

    // const systemMessage = {
    //   role:"system",
    //   content:"You are a helpful assistant." // Explain all concepts like I am a junior software developer.
    // }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [ 
        systemMessage,
        ...apiMessages //message1,2,3
      ]
    }

    // [{"role": "system", "content": "You are a helpful assistant."},
    //     {"role": "user", "content": "Who won the world series in 2020?"},
    //     {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
    //     {"role": "user", "content": "Where was it played?"}]


    await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization": "Bearer " + `${import.meta.env.VITE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data)=> {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming"
        }]
      );
      setTyping(false);
    })
  }

  return (
    <div className="App">
      <div style={{position:"relative", height: "700px", width: "700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth" 
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
