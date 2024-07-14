import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './ChatPage.css'; // Make sure to import the CSS file

const socket = io('http://localhost:5000');

function DevilChatPage() {
    const [messages, setMessages] = useState([]);
    const [devilInput, setDevilInput] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/messages');
                setMessages(response.data.length > 0 ? [response.data[response.data.length - 1]] : []);
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

        return () => {
            socket.off('newMessage');
            socket.off('updateMessage');
        };
    }, []);

    const handleDevilSubmit = async (e) => {
        e.preventDefault();
        const latestQuestion = messages[messages.length - 1];
        if (latestQuestion && devilInput.trim() !== '') {
            const id = latestQuestion.id;
            try {
                await axios.post('http://localhost:5000/answer', { id, answer: devilInput });
                setDevilInput('');
            } catch (error) {
                console.error('Error posting answer:', error);
            }
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-container">
            <h1>Devil Chat</h1>
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
            </div>
            <form onSubmit={handleDevilSubmit} className="input-form">
                <input
                    type="text"
                    value={devilInput}
                    onChange={(e) => setDevilInput(e.target.value)}
                    placeholder="Devil's answer"
                    required
                />
                <button type="submit">Answer</button>
            </form>
        </div>
    );
}

export default DevilChatPage;
