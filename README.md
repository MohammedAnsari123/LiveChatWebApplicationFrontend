# ModernLiveChat - Frontend

The client-side application for ModernLiveChat, built with React and Vite. It provides a modern, responsive interface for real-time messaging, social interaction, and profile management.

## 🚀 Features

- **Modern UI**: Dark-themed, responsive design using Tailwind CSS.
- **Real-time Chat**:
    - Instant messaging with Socket.io-client.
    - Typing indicators.
    - Real-time notifications for new messages.
- **Social Feed**:
    - Browse posts from the community.
    - Create posts with image previews.
    - Interactive Like and Comment system.
- **Group Chats**: Full group chat management (Create, Update, Manage Members).
- **Profile Management**:
    - Edit profile details.
    - Upload profile pictures with visual preview.
- **Smart Navigation**: Side drawer for easy access to search, feed, and profile.
- **Performance**: Optimized build with Vite.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: Context API (ChatProvider)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Notifications**: React-Toastify
- **Icons**: React-Icons & FontAwesome

## 📂 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Authentication/ # Login & Signup forms
│   │   ├── Chat/           # Chat box, Single chat, Scrollable chat
│   │   ├── miscellaneous/  # SideDrawer, Modals, Loading spinners
│   │   └── Social/         # Social Feed, Create Post, Post Items
│   ├── config/             # Chat logics and utility functions
│   ├── context/            # ChatProvider (Global State)
│   ├── pages/              # HomoPage, ChatPage, ProfilePage, SocialPage
│   ├── App.jsx             # Main Route definitions
│   └── main.jsx            # Entry point
├── .env                    # Environment variables
└── vite.config.js          # Vite configuration
```

## 🔧 Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## 🏁 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🧩 Key Components

- **`ChatPage.jsx`**: The main interface combining `MyChats` (sidebar) and `ChatBox` (active chat).
- **`SingleChat.jsx`**: Handles the individual chat logic, socket connection, and message rendering.
- **`SocialPage.jsx`**: A dedicated page for the social feed feature.
- **`SideDrawer.jsx`**: Global navigation header with user search and notifications.
- **`ProfilePage.jsx`**: User settings and profile image update interface.

## 🤝 Backend Connection

The frontend connects to the backend via `VITE_BACKEND_URL`. Ensure this matches your running server port (default 5000). The proxy in `vite.config.js` is also configured to handle `/api` requests correctly during development.
