import "./rightSidebar.css";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

const RightSidebar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    let tempVar = [];
    messages.map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    })
    setMsgImages(tempVar);

  }, [messages]);


  return chatUser ? (
    <div className="rs">
      <div className="rs-profile">
        <img src={chatUser.userData.avatar || assets.avatar_icon} alt="" />
        <h3>{Date.now() - chatUser.userData.lastSeen <= 70000 ? <img className="dot" src={assets.green_dot} alt="" /> : null}
          {chatUser.userData.name}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />

      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImages.map((url, index) => (
            <img key={index} onClick={() => window.open(url)} src={url} alt="" />
          ))}
        </div>
      </div>

      <div className="buttons">
        <button onClick={() => logout()} className="logout-btn">Logout</button>
        <button className="block-btn">Block</button>
      </div>
    </div>
  ) :
    (<div className="rs second">
      <button onClick={() => logout()}>Logout</button>
    </div>)
}

export default RightSidebar