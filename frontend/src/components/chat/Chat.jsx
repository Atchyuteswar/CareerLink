import React, { useEffect, useState, useContext, useRef } from 'react'
import Navbar from '../shared/Navbar'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Send, MessageSquare, Search, ArrowLeft } from 'lucide-react'
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
    const [searchQuery, setSearchQuery] = useState("");

    const scroll = useRef(); 

    // 1. Fetch Users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("https://careerlink-1ank.onrender.com/api/v1/user/getall", { 
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
            const newSocket = io('https://careerlink-1ank.onrender.com', {
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
                const res = await axios.get(`https://careerlink-1ank.onrender.com/api/v1/message/all/${selectedUser._id}`, {
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
            const res = await axios.post(`https://careerlink-1ank.onrender.com/api/v1/message/send/${selectedUser._id}`, { message: text }, {
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

    const filteredUsers = otherUsers.filter(u => 
        u.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className='bg-background h-screen flex flex-col overflow-hidden'>
            <Navbar />
            
            <div className='flex-1 flex max-w-7xl mx-auto w-full p-4 overflow-hidden'>
                <div className='flex w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-black/20'>
                    
                    {/* SIDEBAR */}
                    <div className={`w-full md:w-80 border-r border-gray-200/80 dark:border-gray-800 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                        {/* Sidebar Header */}
                        <div className='p-4 border-b border-gray-100 dark:border-gray-800'>
                            <div className='flex items-center gap-2 mb-3'>
                                <MessageSquare className='w-5 h-5 text-violet-500' />
                                <h2 className='font-bold text-lg text-foreground'>Messages</h2>
                            </div>
                            <div className='relative'>
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <input 
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all'
                                />
                            </div>
                        </div>

                        {/* User List */}
                        <div className='flex-1 overflow-y-auto'>
                            {filteredUsers.length > 0 ? filteredUsers.map((u) => {
                                const isOnline = onlineUsers.includes(u._id);
                                return (
                                    <div 
                                        key={u._id} 
                                        onClick={() => setSelectedUser(u)} 
                                        className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 border-b border-gray-50 dark:border-gray-800/50
                                            ${selectedUser?._id === u._id 
                                                ? 'bg-violet-50 dark:bg-violet-500/10 border-l-2 border-l-violet-500' 
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                                            }`}
                                    >
                                        <div className='relative'>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={u.profile?.profilePhoto} />
                                                <AvatarFallback className="bg-gradient-to-br from-violet-400 to-indigo-400 text-white text-sm font-semibold">
                                                    {u.fullname?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {isOnline && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                                            )}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-semibold text-sm text-foreground truncate'>{u.fullname}</p>
                                            <p className={`text-xs font-medium ${isOnline ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                                {isOnline ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                        <span className='text-xs text-muted-foreground capitalize px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800'>
                                            {u.role}
                                        </span>
                                    </div>
                                );
                            }) : (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-muted-foreground">No users found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MAIN CHAT AREA */}
                    <div className={`flex-1 flex flex-col ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                        {selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <div className='px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-white/50 dark:bg-gray-900/50'>
                                    <button onClick={() => setSelectedUser(null)} className='md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'>
                                        <ArrowLeft className='w-5 h-5 text-foreground' />
                                    </button>
                                    <div className='relative'>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={selectedUser.profile?.profilePhoto} />
                                            <AvatarFallback className="bg-gradient-to-br from-violet-400 to-indigo-400 text-white text-sm font-semibold">
                                                {selectedUser.fullname?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {onlineUsers.includes(selectedUser._id) && (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                                        )}
                                    </div>
                                    <div>
                                        <p className='font-semibold text-sm text-foreground'>{selectedUser.fullname}</p>
                                        <p className={`text-xs ${onlineUsers.includes(selectedUser._id) ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                                            {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50'>
                                    {messages.length === 0 ? (
                                        <div className='flex flex-col items-center justify-center h-full text-muted-foreground'>
                                            <span className='text-3xl mb-2'>💬</span>
                                            <span className='text-sm'>Start a conversation</span>
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isSender = msg.senderId === user._id;
                                            return (
                                                <div 
                                                    ref={scroll} 
                                                    key={msg._id} 
                                                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[70%] ${isSender ? 'order-2' : ''}`}>
                                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                                                            ${isSender 
                                                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-md' 
                                                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-foreground rounded-bl-md'
                                                            }`}
                                                        >
                                                            {msg.message}
                                                        </div>
                                                        <p className={`text-[10px] text-muted-foreground mt-1 ${isSender ? 'text-right' : 'text-left'}`}>
                                                            {formatTime(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className='p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/80 flex gap-3'>
                                    <input 
                                        value={text} 
                                        onChange={(e) => setText(e.target.value)} 
                                        placeholder="Type a message..." 
                                        className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessageHandler()}
                                    />
                                    <Button 
                                        onClick={sendMessageHandler} 
                                        size="icon" 
                                        className="btn-primary rounded-xl h-12 w-12 flex-shrink-0"
                                    >
                                        <Send className='h-4 w-4 text-white' />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className='flex-1 flex flex-col items-center justify-center text-center p-8'>
                                <div className='w-20 h-20 rounded-full bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mb-4'>
                                    <MessageSquare className='w-9 h-9 text-violet-500' />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Welcome to Messages</h2>
                                <p className='text-sm text-muted-foreground mt-2 max-w-xs'>
                                    Select a conversation from the sidebar to start chatting with recruiters or candidates.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat