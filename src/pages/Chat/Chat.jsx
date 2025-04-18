import { useContext, useEffect, useState } from "react";
import ChatBox from "../../components/chatBox/ChatBox";
import LeftSidebar from "../../components/leftSidebar/LeftSidebar";
import RightSidebar from "../../components/rightSidebar/RightSidebar";
import "./chat.css";
import { AppContext } from "../../context/AppContext";

const Chat = () => {

  const { userData, chatData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData && chatData) {
      setLoading(false);
    }
  }, [userData, chatData]);

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