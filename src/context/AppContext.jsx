import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [isCurrentUserBlocked, setIsCurrentUserBlocked] = useState(false);
    const [isReceiverBlocked, setIsReceiverBlocked] = useState(false);

    const [chatVisible, setChatVisible] = useState(false);
    const [rightSidebarVisible, setRightSideVisible] = useState(false);

    const navigate = useNavigate();

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);

            if (userData.name) {
                navigate("/chat");

            } else {
                navigate("/profile-update");
            }

            const updateLastSeen = async () => {
                await updateDoc(userRef, {
                    lastSeen: Date.now()
                });
            };

            await updateLastSeen();

            const intervalId = setInterval(() => {
                if (auth.chatUser) {
                    updateLastSeen()
                }
            }, 6000);

            return () => clearInterval(intervalId);

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const updateChatData = (newChat) => {
        setChatData((prevChatData) => {
            if (prevChatData.some((chat) => chat.messageId === newChat.messageId)) {
                return prevChatData; // Avoid duplicate entries
            }
            return [newChat, ...prevChatData].sort((a, b) => b.updatedAt - a.updatedAt);
        });
    };

    const changeBlockState = () => {
        setIsReceiverBlocked((prevState) => !prevState);
    };

    const handleBlock = async () => {
        if (!chatUser || !userData) return;
    
        const userDocRef = doc(db, "users", userData.id);
    
        try {
            // Optimistically update the local state (optional)
            const newBlockStatus = !isReceiverBlocked;
            setIsReceiverBlocked(newBlockStatus);
    
            // Update the database
            if (newBlockStatus) {
                await updateDoc(userDocRef, {
                    blocked: arrayUnion(chatUser.userData.id),
                });
            } else {
                await updateDoc(userDocRef, {
                    blocked: arrayRemove(chatUser.userData.id),
                });
            }
    
        } catch (error) {
            console.error("Failed to update block status:", error);
            toast.error("Failed to update block status.");
            
            // Revert local state if there's an error
            setIsReceiverBlocked(!isReceiverBlocked);
        }
    };

    useEffect(() => {
        if (chatUser && userData) {
            const currentUserBlocked = chatUser.userData.blocked.includes(userData.id);
            const receiverBlocked = userData.blocked.includes(chatUser.userData.id);

            setIsCurrentUserBlocked(currentUserBlocked);
            setIsReceiverBlocked(receiverBlocked);

            // Listen for updates in the current user's blocked list
            const userDocRef = doc(db, "users", userData.id);
            const unsubscribeCurrentUser = onSnapshot(userDocRef, (docSnap) => {
                const updatedBlocked = docSnap.data().blocked; // Extract only the blocked field

                // Update the receiver blocked status if chatUser exists
                if (chatUser) {
                    const updatedReceiverBlocked = updatedBlocked.includes(chatUser.userData.id);
                    setIsReceiverBlocked(updatedReceiverBlocked);
                }
            });

            // Listen for updates in the chat user's blocked list
            const chatUserDocRef = doc(db, "users", chatUser.userData.id);
            const unsubscribeChatUser = onSnapshot(chatUserDocRef, (docSnap) => {
                const updatedBlocked = docSnap.data().blocked; // Extract only the blocked field

                // Update current user block status
                const updatedCurrentUserBlocked = updatedBlocked.includes(userData.id);
                setIsCurrentUserBlocked(updatedCurrentUserBlocked);
            });

            // Cleanup listeners
            return () => {
                unsubscribeCurrentUser();
                unsubscribeChatUser();
            };
        }

    }, [chatUser, userData]);

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, "chats", userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data().chatsData;
                const tempData = await Promise.all(
                  chatItems.map(async (item) => {
                    const userRef = doc(db, "users", item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    return { ...item, userData }; // Ensure item includes updated lastMessage
                  })
                );
                setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt)); // Sort by updatedAt
              });
            return () => {
                unSub();
            };
        }

        if (messagesId) {
            const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
                console.log("Messages updated:", res.data());
                setMessages(res.data().messages.reverse());
            });
    
            return () => {
                unSub();
            };
        }
    }, [userData, messagesId]);

    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData,
        messagesId, setMessagesId,
        messages, setMessages,
        chatUser, setChatUser,
        updateChatData,
        isCurrentUserBlocked,
        isReceiverBlocked,
        handleBlock,
        chatVisible, setChatVisible,
        rightSidebarVisible, setRightSideVisible
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;