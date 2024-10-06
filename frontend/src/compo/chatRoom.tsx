import { useEffect, useState } from "react";
import { url3 } from "../assets/ImageURL";
import { FaArrowLeft, FaSyncAlt, FaTrash, FaUser } from "react-icons/fa"; // Import the back arrow and user icons
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate, } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

interface DataType {
    id: string;
    username: string;
}
interface FilterUserType {
    id: string;
    username: string;
}
interface FilterUserMap {
    id: string;
    username: string;
}
interface User_ReceiverID {
    ReceiverId: string;
    username: string;
}
interface MessageDataType {
    id: string;
    content: string;
    timestamp: Date;
    senderId: number;
}

export const ChatRoom = () => {
    const [fetched, setFetched] = useState(true);
    const [fetchUser, setFetchUser] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isNightMode, setIsNightMode] = useState(true);
    const [filteredUsers, setFilteredUsers] = useState<FilterUserMap[]>([]);
    const navigate = useNavigate();
    // // SAVE FETCHED MESSAGES BETWEEN Those 2 users
    const [PrevMsg, setPrevMsg] = useState<MessageDataType[]>([])
    const [PrevMsgLength, setPrevMsgLength] = useState('')
    // // SAVE Re-RENDERED FETCHED MESSAGES BETWEEN Those 2 users
    // const [NewPrevMsg, setNewPrevMsg] = useState([])
    // // Post new Message
    const [newMsgPost, setNewMsgPost] = useState("")
    // // User LOgged
    // const UserLogged_ID = parseInt(localStorage.getItem('userId'), 10)
    const CHAT_ID = parseInt(localStorage.getItem('ChatId') || '-1', 10)
    const UserName = localStorage.getItem('username')
    // For Re-Render trigger Call condition

    // // COunt
    const [Count, setCount] = useState(0)
    // // Hover name
    const [isCreatePostTooltipVisible, setIsCreatePostTooltipVisible] = useState(false);
    const [isCreatePostTooltipVisible2, setIsCreatePostTooltipVisible2] = useState(false);
    console.log("C_ID", CHAT_ID)
    console.log("PrevMSGLength: ", PrevMsgLength)
    console.log("PrevMSGs: ", PrevMsg)

    useEffect(() => {
        if (!CHAT_ID) {
            setPrevMsg([])
            setSelectedUser("Select User")
            console.log("Not Chat_id")
        }
    }, [CHAT_ID])

    useEffect(() => {
        const fetchUsers = async () => {

            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/user/getUsers`);
                console.log("Fetched users:", response.data.users);
                const usersData = response.data.users
                const UserName = localStorage.getItem('username')
                console.log("Set: ", usersData)
                setAllUsers(usersData.filter((data: DataType) => data.username != UserName) || []);
                setFetched(false); // Set to false once data is fetched
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setFetchUser(false); // Disable the loading state
            }
            localStorage.removeItem('ChatId')
        };
        fetchUsers();
    }, []);
    // Filter users based on the search term
    useEffect(() => {
        const FilteredUsers = allUsers.filter((user: FilterUserType) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 11); // Show only the first 8 users
        setFilteredUsers(FilteredUsers)
    }, [allUsers, searchTerm])
    // SELECT_USER TO CHAT
    //MESSAGING---------------------------
    const HandelSelectUserToChat = async ({ username, ReceiverId }: User_ReceiverID) => {
        // console.log("Name", username);
        // console.log("R_id", ReceiverId);
        const SenderId = localStorage.getItem("UserId");
        // console.log("S-Id", SenderId);
        setSelectedUser(username);
        // Ensure SenderId is found and is a number
        if (!SenderId) {
            console.log("Error: SenderId not found in local storage");
            return;
        }
        // Convert SenderId and ReceiverId to numbers if needed
        const senderIdNum = Number(SenderId);
        const receiverIdNum = Number(ReceiverId);
        // Prevent chatting with yourself
        if (receiverIdNum === senderIdNum) {
            console.log("You cannot start a chat with yourself");
            return;
        }
        console.log("Different users, proceeding with chat initialization");
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/msg/startChat`, {
                user1Id: senderIdNum,  // Send as number
                user2Id: receiverIdNum  // Send as number
            });
            console.log("Chat created or fetched successfully ");
            // console.log("data: ", response.data)
            console.log("data: ", response.data.chat)
            const CHatID = response.data.ChatId
            console.log("ChatID", CHatID)
            localStorage.setItem("ChatId", CHatID)
            // FETCHING ALL MESSAGES Between 2 users-----
            const response2 = await axios.get(`${BACKEND_URL}/api/v1/msg/chats/${CHatID}/messages`)
            // console.log(response2)
            // console.log("PrevMsg: ", response2.data)
            // console.log("PrevLength: ", response2.data.length)
            setPrevMsgLength(response2.data.length)
            setPrevMsg(response2.data)
        } catch (err) {
            console.error("Error starting chat: ", err);
        }
    };
    // // SEND MESSAGES
    const handleSendMessage = async () => {
        console.log("IN send msg")
        if (newMsgPost === "") {
            toast.error("message is blank! Can't send")
            return
        };
        const chatID = parseInt(localStorage.getItem('ChatId') || '0', 10)
        const userID = parseInt(localStorage.getItem('UserId') || '0', 10)
        console.log("chatID", chatID)
        console.log("userID", userID)
        if (!chatID || !userID) {
            console.log("User ID & ChatId not present in localStorage");

            toast.error("Select the User to Chat! ")

            return;
        }
        try {
            console.log("IN ")
            const response = await axios.post(`${BACKEND_URL}/api/v1/msg/sendMessage`, {
                chatId: chatID,
                senderId: userID,
                content: newMsgPost
            })
            const Data = response.data
            console.log("SenderMsg: ", response.data)
            setPrevMsg([...PrevMsg, Data.messageData]);
            setNewMsgPost("");
        } catch (err) {
            console.log("errOr in sendMsg: ", err)
        }
    }
    // // re-render to check any message came every second render
    useEffect(() => {
        const intervalId = setInterval(() => {
            const fetchLength = async () => {
                try {
                    const CHAT_ID2 = parseInt(localStorage.getItem('ChatId') || '0', 10)
                    if (CHAT_ID2) {
                        // console.log("ChatId present: ", CHAT_ID)
                        const response = await axios.get(`${BACKEND_URL}/api/v1/msg/chats/${CHAT_ID2}/messages`)
                        const length = response.data.length
                        // console.log("PrevMsg Length: ", PrevMsg.length )
                        // console.log("Render No: ",Count + 1)
                        console.log("Re-Render Msg_Length: ", length)
                        if (length === PrevMsgLength) {
                            console.log("No Changes in Msgs Array")
                        } else {
                            setPrevMsg(response.data)

                            setPrevMsgLength(length)
                        }

                    } else {
                        console.log("ChatId not present")
                    }
                } catch (err) {
                    console.log("erRor in Re_render Length: ", err)
                }
                setCount(Count => Count + 1)
                console.log("COunt: ", Count)
            }
            fetchLength()
        }, 5000); // 1000 milliseconds = 1 second

        // Cleanup function to clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this runs once on mount and cleanup on unmount
    // // DELETING A MESSAGE-------------
    const HandleDeleteMsg = async (MsgId: string) => {
        console.log("MsgID: ", MsgId)
        // const ID = parseInt(MsgId, 10)
        const ChAtID = parseInt(localStorage.getItem("ChatId") || '0', 10)
        console.log("ChatId: ", ChAtID)
        if (ChAtID && MsgId) {
            try {
                const response = await axios.delete(`${BACKEND_URL}/api/v1/msg/chats/${ChAtID}/messages`, {
                    data: {
                        id: MsgId
                    }
                })
                // console.log("Response: ", response.data)
                toast.success(`${response.data.message}`)
                const FilterDel = PrevMsg.filter(msg => msg.id !== MsgId)
                setPrevMsg(FilterDel);

            } catch (err) {
                console.log("ErRor: ", err)
            }
        } else {
            toast.error("ChatId or MsgId not present")
        }
    }

    const HandleRefresh = async () => {
        try {
            const CHAT_ID2 = parseInt(localStorage.getItem('ChatId') || '0', 10)
            if (CHAT_ID2) {
                const response = await axios.get(`${BACKEND_URL}/api/v1/msg/chats/${CHAT_ID2}/messages`)
                const length = response.data.length
                console.log("Re-Render Msg_Length: ", length)
                if (length === PrevMsgLength) {
                    console.log("No Changes in Msgs Array")
                    toast.success("No Updates!")
                } else {
                    setPrevMsg(response.data)

                    setPrevMsgLength(length)
                    const PrevLen = parseInt(PrevMsgLength, 10)
                    const diff = (length - PrevLen)
                    console.log("Prev_l: ", PrevLen)
                    toast.success(`${diff} new message Updated!`)
                }
                setCount(Count + 1)
                console.log("COunt: ", Count)
            } else {
                console.log("ChatId not present")
                toast.error("Select a User to make Chat!")
            }
        } catch (err) {
            console.log("erRor in Re_render Length: ", err)
        }
    }

    return (
        






        <div className={`flex flex-col h-screen ${isNightMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white'}`}>
            {/* Back Button */}
            <div className="flex justify-start items-center p-2">
                <button
                    onClick={() => navigate('/blogs')}
                    className={`p-2 ${isNightMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-md hover:${isNightMode ? 'bg-gray-600 ' : 'bg-gray-400'} transition-all duration-300`}
                >
                    <FaArrowLeft className="text-lg" />
                </button>

                {/* Toggle Night Mode Button */}
                <button
                    onClick={() => setIsNightMode(!isNightMode)}
                    className={`h-10 p-2 rounded-full ml-auto ${isNightMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800 font-bold'} transition-all duration-300`}>
                    {isNightMode ? 'Day Mode' : 'Night Mode'}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row w-full max-w-6xl mx-auto flex-grow gap-2 h-full">
                {/* Users List */}
                <div className={`sm:w-1/4 p-2 sm:p-4 rounded-xl shadow-2xl ${isNightMode ? 'bg-gray-800' : 'bg-gray-700'} sm:h-full`}>
                    {/* Profile */}
                    <div className="border-b border-gray-600 flex items-center p-2 mb-3">
                        <div className="flex flex-col items-center sm:flex-row space-y-2 sm:space-y-0">
                            <img
                                src={url3}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-4 text-center sm:text-left">
                                {fetchUser ? (
                                    <h2 className="text-sm font-semibold">Loading...</h2>
                                ) : (
                                    <>
                                        <h2 className="text-sm font-semibold">{UserName?.split('@')[0]}</h2>
                                        <p className="text-xs">{UserName}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat List */}
                    <div>
                        <input
                            type="text"
                            placeholder="Search..."
                            className={`w-full text-sm sm:text-lg mb-4 py-2 px-3 border border-gray-600 ${isNightMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'} rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ul className="overflow-y-auto max-h-[70vh] sm:max-h-[50vh]">
                            {fetched ? (
                                <li className="text-center text-gray-500">Loading...</li>
                            ) : (
                                filteredUsers.map((user, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => HandelSelectUserToChat({ username: user.username, ReceiverId: user.id })}
                                        className={`border-b border-slate-200 dark:border-slate-700 flex items-center px-2 py-2 hover:${isNightMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-lg cursor-pointer mb-2`}
                                    >
                                        <FaUser className="w-6 h-6 sm:w-8 sm:h-8 border-2 rounded-full bg-white text-black" />
                                        <span className="ml-2 sm:ml-3 text-sm sm:text-base">{user.username.split('@')[0]}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                {/* Messaging Section */}
                <div className={`w-full sm:w-3/4 p-2 sm:p-4 rounded-xl flex flex-col ${isNightMode ? 'bg-gray-800' : 'bg-white'} h-full`}>
                    {/* Chat Header */}
                    <div className={`flex items-center justify-between border-b pb-2 mb-2 ${isNightMode ? 'border-gray-700' : 'border-gray-300'}`}>
                        <div className="flex items-center">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQlVYQsJxbEDr57v18Wmwi2rXLOGQui08vHw&s"
                                alt="User" className="border-2 border-black w-8 h-8 rounded-full sm:w-10 sm:h-10" />
                            <div className="ml-4">
                                <h2 className="text-xs sm:text-sm font-semibold text-gray-300">{selectedUser?.split('@')[0] || "Select_User"}</h2>
                                <p className="text-xs text-gray-500">{selectedUser || "Select_User"}</p>
                            </div>
                        </div>
                        <button
                            className="bg-gray-700 text-white rounded-full p-2 transition-all duration-300 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                            aria-label="Refresh"
                            onClick={HandleRefresh}
                        >
                            <FaSyncAlt className="text-white h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                        </button>
                    </div>

                    {/* Messages Section with Scroll */}
                    <div className="flex-grow overflow-y-auto">
                        {PrevMsg.map((msg) => {
                            const isOwnMessage = msg.senderId === parseInt(localStorage.getItem('UserId') || '0', 10);

                            return (
                                <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : ''} mb-4`}>
                                    {!isOwnMessage && (
                                        <img
                                            src="https://via.placeholder.com/40"
                                            alt="User"
                                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-md mr-2"
                                        />
                                    )}
                                    <div className={`max-w-[75%] md:max-w-sm rounded-t-xl p-2 sm:p-3 text-white shadow-lg ${isOwnMessage ? 'rounded-l-xl bg-gradient-to-r from-blue-600 to-blue-700' : 'rounded-r-xl bg-gradient-to-r from-gray-500 to-gray-600'}`}>
                                        <p className="break-words text-xs sm:text-sm">{msg.content}</p>
                                        <div className="flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-300">
                                            <span>
                                                {typeof msg.timestamp === 'string'
                                                    ? new Date(msg.timestamp).toISOString().slice(11, 16)
                                                    : msg.timestamp.toISOString().slice(11, 16)}
                                            </span>
                                            {isOwnMessage && <FaTrash onClick={() => HandleDeleteMsg(msg.id)} className="text-red-500 cursor-pointer hover:text-red-700" />}
                                        </div>
                                    </div>
                                    {isOwnMessage && (
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQlVYQsJxbEDr57v18Wmwi2rXLOGQui08vHw&s"
                                            alt="User"
                                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-md ml-2"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Input Box and Send Message */}
                    <div className="mt-2 sm:mt-4 border-t pt-2 relative">
                        <input
                            value={newMsgPost}
                            onChange={(e) => setNewMsgPost(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                            type="text"
                            placeholder="Type something..."
                            className={`w-full p-2 pr-10 border border-gray-300 rounded-md ${isNightMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all duration-300"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>




    );
};
