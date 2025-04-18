import "./leftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const { userData, chatData } = useContext(AppContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value; 
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username","==",input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExists = false;

          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExists = true;
            }
          })

          if (!userExists) {
            setUser(querySnap.docs[0].data());
          }

        } else {
          setUser(null);
        }

      } else {
        setShowSearch(false);
      }

    } catch (error) {
      
    }
  };

  const addChat = async () => {
    if (!user) return;

    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
  
    try {
      // Check if the user is already in the chatData
      const userExists = chatData.some((chat) => chat.rId === user.id);
      if (userExists) {
        toast.info("User is already in your chat list.");
        return;
      }
  
      // Create a new messages document
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: []
      });
  
      // Add chat to the other user's chat list
      const newChatForOtherUser = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: userData.id,
        updatedAt: Date.now(),
        messageSeen: true,
      };
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion(newChatForOtherUser),
      });
  
      // Add chat to the current user's chat list
      const newChatForCurrentUser = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
      };
      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion(newChatForCurrentUser),
      });
  
      // Update the local chatData state
      const updatedChatData = [...chatData, { ...newChatForCurrentUser, userData: user }];
      setChatUser({ ...newChatForCurrentUser, userData: user });
      setMessagesId(newMessageRef.id);
      // toast.success("Chat added successfully!");
  
      // Trigger the chat immediately
      settingChat({ ...newChatForCurrentUser, userData: user });

      updateChatData({ ...newChatForCurrentUser, userData: user });
  
    } catch (error) {
      console.log(error);
      toast.error("Failed to add chat. Please try again.");
    }
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profileUpdate")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>

        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input onChange={inputHandler} type="text" placeholder="Search here... " />
        </div>
      </div>

      <div className="ls-list">
        {
          showSearch && user
               ?              
          <div onClick={!chatData.some((chat) => chat.rId === user.id) ? addChat : null} className={`friends add-user ${chatData.some((chat) => chat.rId === user.id) ? "disabled" : ""}`}>
            <img src={user.avatar || assets.avatar_icon} alt="" />
            <p>{user.name}</p>
          </div>
               :      
          chatData.map((item, index) => (
            <div key={index} className="friends">
              <img src={item.userData.avatar || assets.avatar_icon} alt="" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default LeftSidebar