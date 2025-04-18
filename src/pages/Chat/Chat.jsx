import "./chat.css";
import LeftSidebar from "../../components/leftSidebar/LeftSidebar";
import ChatBox from "../../components/chatBox/ChatBox";
import RightSidebar from "../../components/rightSidebar/RightSidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);

  return (
    <div className="chat">
      {
        loading
          ?
        <div className="loader">
          <p>Loading...</p>
          <div className="loading"></div>
        </div>
          :
        <div className="chat-container">
          <LeftSidebar />
          <ChatBox />
          <RightSidebar />
        </div>
      }
    </div>
  )
}

export default Chat