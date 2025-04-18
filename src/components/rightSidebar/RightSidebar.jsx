import "./rightSidebar.css";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

const RightSidebar = () => {
  const {
    chatUser,
    userData,
    messages,
    isCurrentUserBlocked,
    isReceiverBlocked,
    handleBlock,
    rightSidebarVisible,
    setRightSideVisible,
  } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Collect all images from messages
    const tempVar = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);
    setMsgImages(tempVar);
  }, [messages]);

  useEffect(() => {
    if (chatUser?.userData.id && userData?.id) {
      const chatUserDocRef = doc(db, "users", chatUser.userData.id);

      // Listen to changes in the `blocked` array of the chat user
      const unsubscribe = onSnapshot(chatUserDocRef, (docSnap) => {
        const updatedBlocked = docSnap.data().blocked || [];
        setIsBlocked(updatedBlocked.includes(userData.id)); // Update block status in real-time
      });

      return () => unsubscribe(); // Cleanup listener on unmount
    }
  }, [chatUser, userData]);

  return chatUser ? (
    <div className={`rs ${rightSidebarVisible ? "block" : "hidden"}`}>
      <img
        onClick={() => setRightSideVisible(false)}
        src={assets.arrow_icon}
        className="back-arrow"
        alt=""
      />

      <div className="rs-profile">
        <img src={chatUser.userData.avatar || assets.avatar_icon} alt="" />
        <h3>
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <div className="online">
              <img src={assets.green_dot} className="dot" alt="" />
              <p>Online</p>
            </div>
          ) : (
            <div className="offline">
              <div className="gray-dot"></div>
              <p>Offline</p>
            </div>
          )}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />

      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImages.map((url, index) => (
            <img onClick={() => window.open(url)} key={index} src={url} alt="" />
          ))}
        </div>
      </div>

      <div className="buttons">
        <button onClick={() => logout()} className="logout-btn">
          Logout
        </button>
        <button
          onClick={handleBlock}
          className={`block-btn ${isBlocked ? "disabled" : ""}`}
          disabled={isBlocked} // Dynamically disable button if blocked
        >
          {isCurrentUserBlocked
            ? "You Are Blocked"
            : isReceiverBlocked
            ? "Unblock"
            : "Block"}
        </button>
      </div>
    </div>
  ) : (
    <div className="rs second">
      <button onClick={() => logout()} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;