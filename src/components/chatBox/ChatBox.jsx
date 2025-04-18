
import "./chatBox.css";
import assets from "../../assets/assets";
import EmojiPicker from "emoji-picker-react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import upload from "../../lib/upload";

const ChatBox = () => {

  const { userData, messagesId, chatUser, messages, setMessages, isCurrentUserBlocked, isReceiverBlocked, chatVisible, setChatVisible, rightSidebarVisible, setRightSideVisible } = useContext(AppContext);
  const [openPicker, setOpenPicker] = useState(false);
  const [input, setInput] = useState("");

  const sendEmoji = (e) => {
    setInput(prev => prev + e.emoji);
    setOpenPicker(false);
  };

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);
        
          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30); // Update lastMessage
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
        
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
        
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setInput("");
  };

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date()
          })
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
            // userChatData.chatsData[chatIndex].lastMessage = "Image",
            userChatData.chatsData[chatIndex].lastMessage = {
              type: "image",
              url: fileUrl,
            },
            userChatData.chatsData[chatIndex].updatedAt = Date.now();

            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData
            })
          }
        });
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + minute + "PM";

    } else {
      return hour + ":" + minute + "AM";
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
      });

      return () => {
        unSub();
      };
    }
  }, [messagesId]);

 
  return (
        chatUser
           ?
    (<div className={`chat-box ${chatVisible ? "" : "hidden"} ${rightSidebarVisible ? "hide-chat" : ""}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar || assets.avatar_icon} alt="" />
        <div>
          {chatUser.userData.name}
          {
            Date.now() - chatUser.userData.lastSeen <= 70000 
                          ? 
            <div className="online">
              <img src={assets.green_dot} className="dot" alt="" />
              <p>Online</p>
            </div>
                         : 
            <div className="offline">
              <div className="gray-dot"></div>
              <p>Offline</p>
            </div>
          }
        </div>
        <img src={assets.help_icon} className="help" alt="" />

        <img onClick={() => setChatVisible(false)} src={assets.arrow_icon} className="arrow" alt="" />
        <img onClick={() => setRightSideVisible(true)} src={assets.arrow_icon} className="arrow-reverse" alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div className={msg.sId === userData.id ? "s-msg" : "r-msg"} key={index}>
            {msg["image"] ? <img className="msg-img" src={msg.image} alt="" /> : <p className="msg">{msg.text}</p>}
            <div>
              <img src={msg.sId === userData.id ? userData.avatar || assets.avatar_icon : chatUser.userData.avatar || assets.avatar_icon} className="avatar" alt="" />
              <p>{convertTimestamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You can't send a message" : "Type a message..."} disabled={isCurrentUserBlocked || isReceiverBlocked} />
        <input onChange={(e) => { if (isCurrentUserBlocked || isReceiverBlocked) { toast.error("You can't upload an image."); return; } sendImage(e) }} type="file" id="image" accept="image/png, image/jpeg" hidden />
        <label htmlFor="image">
          <img onClick={() => { if (isCurrentUserBlocked || isReceiverBlocked) { toast.error("You can't upload an image."); } }} src={assets.gallery_icon} alt="" />
        </label>

        <div className="emoji">
          <button onClick={() => {
             if (isCurrentUserBlocked || isReceiverBlocked) { 
              toast.error("You can't use emojis.");
              return; 
            } setOpenPicker((prev) => !prev); 
          }}
            aria-expanded={openPicker}
            aria-label="Toggle emoji picker"
            className="emoji-toggle"
          >
          <img  src={assets.emoji} alt="" />

          </button>
          {
            openPicker
               &&
            <div className="picker">
              <EmojiPicker onEmojiClick={(e) => { if (isCurrentUserBlocked || isReceiverBlocked) { toast.error("You can't use emojis."); return; } sendEmoji(e); }} />
            </div>    
          }
        </div>
        
        <img onClick={() => { if (isCurrentUserBlocked || isReceiverBlocked) { toast.error("You can't send a message"); return; } sendMessage(); }} src={assets.send_button} alt="" />
      </div>
    </div>)
       :
    <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatBox
