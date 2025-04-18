import "./rightSidebar.css";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";

const RightSidebar = () => {
  return (
    <div className="rs">
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>John Doe <img className="dot" src={assets.green_dot} alt="" /></h3>
        <p>Hey, There I'am John Doe using this chat</p>
      </div>
      <hr />

      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
        </div>
      </div>

      <button>Logout</button>
      
      <div className="buttons">
      <button onClick={() => logout()}>Logout</button>
        <button className="block-btn">Block</button>
      </div>

    </div>
  )
}

export default RightSidebar