import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
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
            email,
            name: "",
            avatar: "",
            bio: "Hey There, I'am using this chat app.",
            lastSeen: Date.now(),
            blocked: []
        });

        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        })

    } catch (error) {
        console.log(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
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

const ressetPassword = async (email) => {
    if (!email) {
        toast.error("Enter your email");
        return null;
    }

    try {
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", email));
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent");

        } else {
            toast.error("Email doesn't exists");
        }

    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signUp, login, logout, ressetPassword };