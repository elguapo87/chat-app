import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-v2-60f5b.firebaseapp.com",
  projectId: "react-chat-v2-60f5b",
  storageBucket: "react-chat-v2-60f5b.firebasestorage.app",
  messagingSenderId: "327511941808",
  appId: "1:327511941808:web:0c01cc371a61d02d4e5175"
};

const signUp = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email: email,  // this now works
            name: "",
            avatar: "",
            bio: "Hey There, I'am using this chat app.",
            lastSeen: Date.now()
        });

        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        });

    } catch (error) {
        console.log(error);
        toast.error(error.code?.split("/")[1]?.split("-").join(" ") || "signup failed");
    }
};

const login = async ( email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);

    } catch (error) {
        console.log(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
};

const logout = async () => {
    try {
        await signOut(auth);

    } catch (error) {
        console.log(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signUp, login, logout };