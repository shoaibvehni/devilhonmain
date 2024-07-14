import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserChatPage() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

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
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        if (userInput.trim() !== '') {
            const id = new Date().getTime().toString(); // Simple unique ID
            await axios.post('http://localhost:5000/ask', { id, question: userInput });
            setMessages([...messages, { id, question: userInput, answer: '' }]);
            setUserInput('');
        }
    };

    return (
        <div>
            <h1>User Chat</h1>
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <p><strong>You:</strong> {msg.question}</p>
                        <p><strong>Devil:</strong> {msg.answer}</p>
                        <hr />
                    </div>
                ))}
            </div>
            <form onSubmit={handleUserSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your question here"
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default UserChatPage;
