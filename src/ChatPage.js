import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './ChatPage.css'; // Make sure to import the CSS file

const socket = io('http://localhost:5000');

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [devilTyping, setDevilTyping] = useState('');
    const [showBlastMessage, setShowBlastMessage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/messages');
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();

        socket.on('newMessage', (message) => {
            setMessages([message]);
        });

        socket.on('updateMessage', (updatedMessage) => {
            setMessages([updatedMessage]);
        });

        socket.on('devilTyping', (input) => {
            setDevilTyping(input);
        });

        return () => {
            socket.off('newMessage');
            socket.off('updateMessage');
            socket.off('devilTyping');
        };
    }, []);

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        if (userInput.trim() !== '') {
            const id = new Date().getTime().toString(); // Simple unique ID
            try {
                await axios.post('http://localhost:5000/ask', { id, question: userInput });
                setUserInput('');
                socket.emit('userTyping', '');
                setShowBlastMessage(true);
                setTimeout(() => {
                    setShowBlastMessage(false);
                }, 1000);
            } catch (error) {
                console.error('Error posting question:', error);
            }
        }
    };

    const handleUserInputChange = (e) => {
        setUserInput(e.target.value);
        socket.emit('userTyping', e.target.value);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-container">
            <h1>Chat with the Devil</h1>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.answer ? 'devil' : 'user'}`}>
                        {msg.answer ? (
                            <>
                                <p><strong>Devil:</strong> {msg.answer}</p>
                                <span className="timestamp">{formatDate(msg.timestamp)}</span>
                            </>
                        ) : (
                            <>
                                <p><strong>You:</strong> {msg.question}</p>
                                <span className="timestamp">{formatDate(msg.timestamp)}</span>
                            </>
                        )}
                    </div>
                ))}
                {devilTyping && (
                    <div className="typing-indicator">
                        Devil is typing: {devilTyping}
                    </div>
                )}
                {showBlastMessage && (
                    <div className="message-blast">
                        The devil is reading your words...
                    </div>
                )}
            </div>
            <form onSubmit={handleUserSubmit} className="input-form">
                <input
                    type="text"
                    value={userInput}
                    onChange={handleUserInputChange}
                    placeholder="Type your question here"
                    required
                />
                <button type="submit" onClick={handleBlastEffect}>Send</button>
            </form>
        </div>
    );
}

export default ChatPage;

function handleBlastEffect() {
    const blastMessage = document.createElement('div');
    blastMessage.className = 'message-blast';
    blastMessage.innerText = 'The devil is reading your words...';
    document.body.appendChild(blastMessage);
    setTimeout(() => {
        blastMessage.remove();
    }, 1000);
}
