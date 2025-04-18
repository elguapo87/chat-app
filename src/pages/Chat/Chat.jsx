import "./chat.css";
import LeftSidebar from "../../components/leftSidebar/LeftSidebar";
import ChatBox from "../../components/chatBox/ChatBox";
import RightSidebar from "../../components/rightSidebar/RightSidebar";

const Chat = () => {
  return (
    <div className="chat">
      <div className="chat-container">
        <LeftSidebar />
        <ChatBox />
        <RightSidebar />
      </div>
    </div>
  )
}

export default Chat