import './App.css';
import React from 'react';

import Main from './components/Main';
import Login from './components/Forms/Login';
import { useAuth0 } from "@auth0/auth0-react";
import { FormContext } from './context/FormContext';
import axios from 'axios'
import io from 'socket.io-client'

const socket = io.connect('https://live-chat-messaging2.herokuapp.com/',{
  "force new connection" : true,
  "reconnectionAttempts": "Infinity", 
  "timeout" : 10000,                  
  "transports" : ["polling"]
})

function App() {
  const [messages, setMessages] = React.useState([])
  const [message, setMessage] = React.useState("")
  const [room, setRoom] = React.useState("")
  const [block, setBlock] = React.useState([])
  const [blocked, setBlocked] = React.useState(false)
  const [users, setUsers] = React.useState([])
  const [email, setEmail] = React.useState("")
  const [chatInfo, setChatInfo] = React.useState({})
  const [activeUsers, setActiveUsers] = React.useState([])
  const [myBlockList, setMyBlockList] = React.useState({})
  const [otherBlockList, setOtherBlockList] = React.useState({})
  let holdBlockList={}
  let holdOtherBlocklist ={}

  const { user } = useAuth0()
  // const host = 'https://localhost:5000'

  const handleBlock=(block)=>{
    block?.forEach(e=>{
      if(holdBlockList[e.user]){
        holdBlockList[e.user]= holdBlockList[e.user]+"/"+e.blocked_user
      }
      else{
        holdBlockList[e.user]=e.blocked_user
      }
      if(holdOtherBlocklist[e.blocked_user]){
        holdOtherBlocklist[e.blocked_user]= holdOtherBlocklist[e.blocked_user]+"/"+e.user
      }
      else{
        holdOtherBlocklist[e.blocked_user]=e.user
      }
    })
    setMyBlockList(holdBlockList)
    setOtherBlockList(holdOtherBlocklist)
    
  }

  function setSocketListeners() {
    socket.on('fetched', (data) => {
      setUsers(data.users)
      setMessages(data.messages)
      setBlock(data.block)
      handleBlock(data.block)
    })

    // socket.on('message_sent', (data) => {
    //   setMessages(data)
    // })

    socket.on('user_activated', (data) => {
      setActiveUsers(Object.values(data))
    })

    socket.on('user_deactivated', (data) => {
      setActiveUsers(Object.values(data))
    })

    socket.on('user_blocked', (data) => {
      setBlock(data)
      handleBlock(data)
    })

    socket.on('user_unblocked', (data) => {
      setBlock(data)
      handleBlock(data)
    })

    socket.on('connect', () => {
      socket.emit("fetch");
    })
  }



  return (
    <FormContext.Provider value={{ users,blocked,setBlocked,setMyBlockList, myBlockList, otherBlockList,block, room, messages, setMessages, chatInfo, setChatInfo, user, socket, email, setEmail, message, setMessage, activeUsers, setActiveUsers }}>
      {setSocketListeners()}
      <div>
        {user ? <Main />  : <Login />}
      </div>
    </FormContext.Provider>

  );
}

export default App;
