import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import MainRoutes from './routes';
import ChatBot from './components/chat/ChatBot'; // <-- NEW: Import ChatBot here

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
        {/* ✅ Global Toast Notification System */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            containerStyle: {
              zIndex: 9999, // Ensures toasts appear above modals etc.
            },
          }}
        />

        {/* ✅ App Routing */}
        <MainRoutes />

        {/* ✅ Chatbot - Placed here to ensure global fixed positioning relative to viewport */}
        <ChatBot /> {/* <-- NEW: Render ChatBot here */}
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
