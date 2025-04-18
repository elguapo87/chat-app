import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);

            if (userData.avatar && userData.name) {
                navigate("/chat");

            } else {
                navigate("/profileUpdate");
            }

            await updateDoc(userRef, {
                lastSeen: Date.now()
            });

            setInterval(async () => {
                if (auth.chatUser) {             
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    });
                }
            }, 60000);

	    const updateLastSeen = async () => {
                await updateDoc(userRef, {
                    lastSeen: Date.now(),
                });
                console.log("Updated lastSeen:", Date.now());    
            };
    
            await updateLastSeen();
    
            const intervalId = setInterval(() => {
                if (userData) {
                    updateLastSeen().catch(console.error);  
                }
            }, 6000);
    
            return () => clearInterval(intervalId);

        } catch (error) {
            
        }
    };

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;