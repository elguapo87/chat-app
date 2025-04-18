import "./chatBox.css";
import assets from "../../assets/assets";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const ChatBox = () => {

  const [openPicker, setOpenPicker] = useState(false);                   
  const [input, setInput] = useState("");                                

  const sendEmoji = (e) => {                                           
    setInput(prev => prev + e.emoji);
    setOpenPicker(false);
  };

  return (
    <div className="chat-box">
      <div className="chat-user">
        <img src={assets.profile_img} alt="" />
        <p>John Doe <img className="dot" src={assets.green_dot} alt="" /></p>
        <img src={assets.help_icon} className="help" alt="" />
      </div>

      <div className="chat-msg">
        <div className="s-msg">
          <p className="msg">Lorem ipsum is placeholder text commonly used in  ..</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>

        <div className="s-msg">
          <img className="msg-img" src={assets.pic1} alt="" />
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>

        <div className="r-msg">
          <p className="msg">Lorem ipsum is placeholder text commonly used in  ..</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>
      </div>

      <div className="chat-input">
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder="Send a message" />                                            
        <input type="file" id="image" accept="image/png, image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        
        <div className="emoji">
          <img onClick={() => setOpenPicker(prev => !prev)} src={assets.emoji} alt="" />              
          <div className="picker">
            <EmojiPicker open={openPicker} onEmojiClick={sendEmoji} />
          </div>
        </div>
     
        <img src={assets.send_button} alt="" />
      </div>
      
    </div>
  )
}

export default ChatBox