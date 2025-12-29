import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import SocialPage from "./pages/SocialPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <div className="App min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<SocialPage />} />
      </Routes>
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
