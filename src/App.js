import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatPage from './ChatPage';
import DevilChatPage from './DevilChatPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/devil" element={<DevilChatPage />} />
            </Routes>
        </Router>
    );
}

export default App;
