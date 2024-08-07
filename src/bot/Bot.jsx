import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoMdClose } from 'react-icons/io';
import './Bot.css';
import { IoSend } from "react-icons/io5";
import Typewriter from 'typewriter-effect'; // Import Typewriter

const Bot = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const inputRef = useRef(null);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async (msg = message) => {
        if (msg.trim() === '') {
            setAlertMessage('Message cannot be empty!');
            setTimeout(() => {
                setAlertMessage('');
            }, 3000);
            return;
        }

        setLoading(true);
        console.log('Sending message:', msg);
        try {
            const res = await axios.post('https://bot-aryan-assistant.vercel.app/dialogflow', {
                query: msg,
            });
            console.log('Received response:', res.data);

            const newMessage = { text: msg, from: 'user' };
            const botResponse = { text: res.data.fulfillmentText, from: 'bot' };

            setChat([...chat, newMessage, botResponse]);
            setMessage('');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const handlePresetClick = (text) => {
        setMessage(text);
        sendMessage(text);
    };

    useEffect(() => {
        if (isOpen) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    return (
        <div className="chat-wrapper">
            {isOpen ? (
                <div className="Bot open">
                    <div className="bot">
                        <div className="header">
                            <Typewriter
                                options={{
                                    strings: ['I am Aryan Assistant', 'How can I help you?', 'Ask me any questions', 'About Aryan'],
                                    autoStart: true,
                                    loop: true,
                                }}
                            />
                            <button className="toggle-btn" onClick={toggleChat}>
                                <IoMdClose />
                            </button>
                        </div>
                        <div className="chat-container">
                            {chat.map((msg, index) => (
                                <div key={index} className={`message ${msg.from}`}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                        {chat.length === 0 && (
                            <div id="chat_Start">
                                <p onClick={() => handlePresetClick('Hi👋')}>Hi 👋</p>
                                <p onClick={() => handlePresetClick('Tell me about Aryan')}>Tell me about Aryan</p>
                                <p onClick={() => handlePresetClick('Your Contact Detail')}>Your Contact Detail</p>
                                <p onClick={() => handlePresetClick('Your Projects')}>Your Projects</p>
                            </div>
                        )}
                        {alertMessage && (
                            <div id="alert-message">
                                {alertMessage}
                            </div>
                        )}
                        <div className="input-container">
                            <input
                                type="text"
                                value={message}
                                onChange={handleMessageChange}
                                onKeyDown={handleKeyDown}
                                ref={inputRef}
                            />
                            <button onClick={() => sendMessage()} disabled={loading}>
                                {loading ?
                                    <img src="https://github.com/aryan7122/webwos/blob/master/src/images/lod.gif?raw=true" alt="loading" id="img_loding" />
                                    : <IoSend />}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="chat-icon">
                    <img id='img' src="https://github.com/aryan7122/webwos/blob/master/src/images/bot.gif?raw=true" alt="bot" className="toggle-btn" onClick={toggleChat} />
                </div>
            )}
        </div>
    );
};

export default Bot;
