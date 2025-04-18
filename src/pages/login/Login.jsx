import "./login.css";
import assets from "../../assets/assets";
import { useState } from "react";
import { login, signUp } from "../../config/firebase";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currentState === "Sign Up") {
      signUp(userName, email, password);

    } else {
      login(email, password);
    }
  }

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currentState}</h2>
        {
          currentState !== "Sign Up" 
               ?
              <></>
               :
          <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" placeholder="username" required className="form-input" />
        }
        <input onChange={(e) => setEmail(e.target.value)} type="email" value={email} placeholder="Email Address" required className="form-input" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" value={password} placeholder="password" required className="form-input" />
        <button type="submit">{currentState === "Sign Up" ? "Create account" : "Login now"}</button>

        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="login-forgot">
         {           currentState === "Sign Up"
                              ?
          <p className="login-toggle">Already have an account? <span onClick={() => setCurrentState("Login")}>Login here</span></p>
                              :
          <p className="login-toggle">Create an account <span onClick={() => setCurrentState("Sign Up")}>Click here</span></p>
         }
        </div>
      </form>
    </div>
  )
}

export default Login