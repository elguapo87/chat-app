import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Chat from "./pages/Chat/Chat";
import ProfileUpdate from "./pages/profileUpdate/ProfileUpdate";
import { ToastContainer } from 'react-toastify';
import { useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { AppContext } from "./context/AppContext";

const App = () => {

  const { loadUserData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid);

      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <div>
      <>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile-update" element={<ProfileUpdate />} />
        </Routes>
      </>
    </div>
  )
}

export default App