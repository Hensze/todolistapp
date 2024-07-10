import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/Loginpage";
import ListPage from "./Pages/ListPage";
import ChatPage from "./Pages/ChatPage";
import ProfilePage from "./Pages/ProfilePage";
import Layout from "./Pages/Layout";
import { useAppDispatch } from "./Redux/hooks";
import { setUser } from "./Redux/userSlice";
import { getcurentUser } from "./Utils/getCurrentUser";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentLogUser = getcurentUser();
    if (currentLogUser) {
      dispatch(setUser(currentLogUser));
    }
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<ListPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
