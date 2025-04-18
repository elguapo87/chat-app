import "./login.css";
import assets from "../../assets/assets";
import { useState } from "react";
import { login, ressetPassword, signUp } from "../../config/firebase";
import { toast } from "react-toastify";

const Login = () => {

  const [currentState, setCurrentState] = useState("Login");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentState === "Login") {
        login(email, password);
        
      } else {
        signUp(userName, email, password);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="login" >
      <img src={assets.logo_pg} alt="" className="logo" />
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{currentState}</h2>
        {
          currentState !== "Login"
                  &&
          <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" placeholder="username" className="form-input" required />
        }
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="email" className="form-input" required />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="password" className="form-input" required />
        <button type="submit">{currentState === "Login" ? "Login" : "Sign Up"}</button>

        <div className="login-term">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="login-forgot">
          {
            currentState === "Login"
                   ?
            <p className="login-toggle">Create an account <span onClick={() => setCurrentState("Sign Up")}>Click here</span></p>
                   :
            <p className="login-toggle">Already have an account <span onClick={() => setCurrentState("Login")}>Login here</span></p>
          }

          {
            currentState === "Login"
                   ?
            <p className="login-toggle reset">Forgot Password ? <span onClick={() => ressetPassword(email)}>rest here</span></p>
                  :
                 null
          }
        </div>
      </form>
    </div>
  )
}

export default Login