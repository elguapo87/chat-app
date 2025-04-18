import { useContext, useEffect, useState } from "react";
import "./profileUpdate.css";
import assets from "../../assets/assets";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import upload from "../../lib/upload";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";

const ProfileUpdate = () => {

  const { setUserData } = useContext(AppContext);

  const [image, setImage] = useState(false);
  const [prevImage, setPrevImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");

  const navigate = useNavigate();

  const profileUpdate = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "users", uid);
      if (image) {
        const imageUrl = await upload(image);
        setPrevImage(imageUrl);
        await updateDoc(docRef, {
          avatar: imageUrl,
          name,
          bio
        });

      } else {
        await updateDoc(docRef, {
          name,
          bio
        });
      }

      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();
      setUserData(docData);

      navigate("/chat");
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();

        if (docData.name) {
          setName(docData.name);
        }

        if (docData.bio) {
          setBio(docData.bio);
        }

        if (docData.avatar) {
          setPrevImage(docData.avatar);
        }

      } else {
        navigate("/");
      }
    })
  }, []);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />
            <img src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.avatar_icon} alt="" />
            upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Your name" required />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder="Write profile bio" required></textarea>
          <button type="submit">Save</button>
        </form>

        <img src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} className="profile-pic" alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate