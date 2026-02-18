import React, { useEffect, useState, useContext, useRef } from 'react'
import Navbar from '../shared/Navbar'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Send, MessageSquare } from 'lucide-react'
import { io } from "socket.io-client"
import { AuthContext } from '../../context/AuthContext'

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [text, setText] = useState("");
    const { user } = useContext(AuthContext);
    
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [otherUsers, setOtherUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const scroll = useRef(); 

    // 1. Fetch Users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/user/getall", { 
                    withCredentials: true
                });
                if(res.data.success){
                    setOtherUsers(res.data.users);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUsers();
    }, []);

    // 2. Connect Socket
    useEffect(() => {
        if (user) {
            // Replace localhost with your Render URL
const newSocket = io('https://careerlink-backend-99tb.onrender.com', {
    query: { userId: user._id },
    transports: ['websocket']
});
            setSocket(newSocket);
            newSocket.on('getOnlineUsers', (users) => setOnlineUsers(users));
            newSocket.on('newMessage', (newMessage) => setMessages((prev) => [...prev, newMessage]));
            return () => newSocket.close();
        }
    }, [user]);

    // 3. Fetch Messages
    useEffect(() => {
        const fetchMessages = async () => {
            if(!selectedUser) return;
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser._id}`, {
                    withCredentials: true
                });
                if(res.data.success){
                    setMessages(res.data.messages);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchMessages();
    }, [selectedUser]);

    // Auto-scroll
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessageHandler = async () => {
        if(!text.trim()) return;
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${selectedUser._id}`, { message: text }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                setMessages([...messages, res.data.newMessage]);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        // FIXED: h-screen ensures the page never exceeds browser height
        <div className='bg-background h-screen flex flex-col overflow-hidden'>
            <Navbar />
            
            {/* FIXED: Flex-1 takes remaining height. 'p-5' adds gap without causing scroll. */}
            <div className='flex-1 flex max-w-7xl mx-auto w-full p-5 overflow-hidden'>
                
                <div className='flex w-full h-full border border-border rounded-lg overflow-hidden bg-card shadow-lg'>
                    {/* SIDEBAR */}
                    <div className='w-1/3 border-r border-border bg-card flex flex-col'>
                        <div className='p-4 font-bold border-b border-border text-foreground flex items-center gap-2'>
                            <MessageSquare className='w-5 h-5' /> Messages
                        </div>
                        <div className='flex-1 overflow-y-auto'>
                            {otherUsers.length > 0 ? otherUsers.map((u) => (
                                <div 
                                    key={u._id} 
                                    onClick={() => setSelectedUser(u)} 
                                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors ${selectedUser?._id === u._id ? 'bg-accent' : ''}`}
                                >
                                    <Avatar>
                                        <AvatarImage src={u.profile?.profilePhoto} />
                                        <AvatarFallback>{u.fullname?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className='overflow-hidden'>
                                        <p className='font-medium truncate text-foreground'>{u.fullname}</p>
                                        <p className={`text-xs ${onlineUsers.includes(u._id) ? 'text-green-500 font-bold' : 'text-muted-foreground'}`}>
                                            {onlineUsers.includes(u._id) ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                            )) : <p className="p-4 text-sm text-muted-foreground">No users found.</p>}
                        </div>
                    </div>

                    {/* MAIN CHAT AREA */}
                    <div className='flex-1 flex flex-col bg-background'>
                        {selectedUser ? (
                            <>
                                <div className='p-4 border-b border-border flex items-center gap-3 bg-card/50'>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={selectedUser.profile?.profilePhoto} />
                                        <AvatarFallback>{selectedUser.fullname?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className='font-bold text-foreground'>{selectedUser.fullname}</span>
                                </div>

                                {/* FIXED: This section scrolls independently */}
                                <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20'>
                                    {messages.map((msg) => (
                                        <div 
                                            ref={scroll} 
                                            key={msg._id} 
                                            className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`px-4 py-2 rounded-lg max-w-xs shadow-sm ${msg.senderId === user._id ? 'bg-[#6A38C2] text-white' : 'bg-card border border-border text-foreground'}`}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='p-4 border-t border-border flex gap-2 bg-card'>
                                    <Input 
                                        value={text} 
                                        onChange={(e) => setText(e.target.value)} 
                                        placeholder="Type a message..." 
                                        className="flex-1 bg-background"
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessageHandler()}
                                    />
                                    <Button onClick={sendMessageHandler} size="icon" className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                                        <Send className='h-4 w-4 text-white' />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className='flex-1 flex flex-col items-center justify-center text-muted-foreground'>
                                <span className="text-xl font-semibold">Welcome to Chat</span>
                                <span>Select a user from the sidebar to start messaging.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat