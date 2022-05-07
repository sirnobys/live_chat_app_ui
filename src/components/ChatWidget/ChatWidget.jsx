import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";
import { FormContext } from "../../context/FormContext";

export default function ChatWdget() {
  const {
    chatInfo,
    message,
    messages,
    setMessage,
    setChatInfo,
    socket,
    user,
    users,
    data,
    myBlockList,
    otherBlockList,
  } = useContext(FormContext);
  
  const messagesEndRef = React.useRef(null);
  const blockInfo={
    user: user.email,
    blocked_user: chatInfo.email,
  }
  let room = [user.email, chatInfo.email].sort();
  const [change, setChange]=React.useState(false)
  room = room.join("|")
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages,[]]);


  if (!chatInfo.name) {
    return "open message";
  }
  const submit = (e) => {
    e.preventDefault();
    socket.emit("send_message", {
      room: room,
      message: message,
      sender: user?.email,
      receiver: chatInfo?.email,
      sent: Date.now(),
    });

    setMessage("");
  };
  
  const blockUser=()=>{
    socket.emit("block_user", blockInfo);
    setChange(myBlockList[user.email]?.split("/").includes(chatInfo.email))
  }
  const unBlockUser=()=>{
    setChange(!myBlockList[user.email]?.split("/").includes(chatInfo.email))
    socket.emit("unblock_user", blockInfo);
  }
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const messageBox = () => {
    return (
      <div
        style={{
          bottom: "0",
          position: "fixed",
          zIndex: "1",
          backgroundColor: "white",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        <form onSubmit={(e) => submit(e)}>
          <TextField
            style={{ width: "50%" }}
            id="outlined-textarea"
            label="Type message"
            multiline
            required
            value={message}
            onChange={(e) => handleChange(e)}
          />
          
          <Button
            className="mt-2 m-2"
            variant="contained"
            endIcon={<SendIcon />}
            type="submit"
            // onClick={() => submit()}
          >
            Send
          </Button>
        </form>
      </div>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div className="row">
        <div
          className="chat col-lg-12"
          style={{
            top: "0",
            position: "fixed",
            zIndex: "1",
            backgroundColor: "white",
          }}
        >
          <div className="chat-header clearfix">
            <div className="row">
              <div className="col-lg-12">
                <a href="javascript:void(0);">
                  <img src={chatInfo?.picture} alt="avatar" />
                </a>
                <div className="chat-about">
                  {
                    
                      change?
                      <Button variant="contained" className="float-right" size="small" color="warning" onClick={()=>[blockUser()]}>Block</Button>
                    :
                  <Button variant="contained" className="float-right" size="small" color="warning" onClick={()=>[unBlockUser()]}>Unblock</Button>
                  }
                  <h6 className="m-b-0">{chatInfo?.name}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        <div>
          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="chat">
                  <div className="chat-history">
                    <ul className="m-b-0">
                      {messages?.map(
                        (e) =>
                          e.room?.includes(room) && (
                            <li className="clearfix">
                              <div
                                align={
                                  e.sender == user.email ? "right" : "left"
                                }
                                className="message-data"
                              >
                                <span className="message-data-time">
                                  10:10 AM, Today
                                </span>
                              </div>
                              <div
                                className={
                                  e.sender == user.email
                                    ? "message other-message float-right"
                                    : "message my-message"
                                }
                              >
                                {e.message}
                              </div>
                            </li>
                          )
                      )}

                      {/* <li className="clearfix">
                      <div className="message-data">
                        <span className="message-data-time">10:12 AM, Today</span>
                      </div>
                      <div className="message my-message">
                        Are we meeting today?
                      </div>
                    </li>
                    <li className="clearfix">
                      <div className="message-data">
                        <span className="message-data-time">10:15 AM, Today</span>
                      </div>
                      <div className="message my-message">
                        Project has been already finished and I have results to
                        show you.
                      </div>
                    </li> */}
                    </ul>
                    {messageBox()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ref={messagesEndRef} />
        </div>
      }
    </Box>
  );
}
