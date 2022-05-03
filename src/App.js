import './App.css';
import React from 'react';

import Main from './components/Main';
import Login from './components/Forms/Login';
import { useAuth0 } from "@auth0/auth0-react";
import { FormContext } from './context/FormContext';
import axios from 'axios'
import io from 'socket.io-client'

const socket = io('https://live-chat-messaging.herokuapp.com')

function App() {
  const [messages, setMessages] = React.useState([])
  const [message, setMessage] = React.useState("")
  const [room, setRoom] = React.useState("")
  const [block, setBlock] = React.useState([])
  const [blocked, setBlocked] = React.useState(false)
  let myBlockList={}
  let otherBlockList ={}
  const [users, setUsers] = React.useState([])
  const [email, setEmail] = React.useState("")
  const [chatInfo, setChatInfo] = React.useState({})
  const [activeUsers, setActiveUsers] = React.useState([])
  const [isBlocked, setIsBlocked] = React.useState(false)


  const { user } = useAuth0()
  const host = 'https://live-chat-messaging.herokuapp.com'
  const port = '25377'
  const url = host

  const fetchData = (url) => {
    axios.get(url).then((res) => {
      console.log(res);
      setUsers(res.data.users)
      setMessages(res.data.messages)
      setBlock(res.data.block)
    })
  }

  function setSocketListeners() {
    socket.on('message_sent', (data) => {
      data['received'] = Date.now()
      setMessages(data)
      console.log('message',data);
    })

    socket.on('user_activated', (data) => {
      setActiveUsers(Object.values(data))
    })

    socket.on('user_deactivated', (data) => {
      setActiveUsers(Object.values(data))
    })

    socket.on('user_blocked', (data) => {
      setIsBlocked(true)
      console.log(data);
      console.log(block);
    })

    socket.on('user_unblocked', (data) => {
      fetchData(url)
      console.log(block);
    })

    socket.on('error', (data) => {
      console.log("error", data);
    })
    socket.on('connect_failed', (data) => {
      console.log("conect_failed",data);
    })

    socket.on('connect', (res) => {
      console.log("conect",res);
    })
  }

  React.useEffect(() => {
    fetchData(url)
    setSocketListeners()
  }, [])

  React.useEffect(() => {
    fetchData(url)
  }, [isBlocked])

  return (
    <FormContext.Provider value={{ users,blocked,setBlocked, myBlockList, otherBlockList,block, room, messages, setMessages, chatInfo, setChatInfo, user, socket, email, setEmail, message, setMessage, activeUsers, setActiveUsers }}>
      <div>
        {user ? <Main />  : <Login />}
      </div>
    </FormContext.Provider>

  );
}

export default App;
