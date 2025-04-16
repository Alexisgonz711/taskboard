import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home/Home";
import SignIn from "./components/Sign/SignIn";
import SignUp from "./components/Sign/SignUp";
import Error from "./views/Error/Error";
import Projet from "./views/Projet/Projet";
import Profile from "./views/Profile/Profile";
import MyProject from "./components/Projet/MyProject";
import Layout from "./layout";
import { UserProvider } from "./components/Sign/UserContext";

function Routing() {
  return (
    <Routes>
      <Route path="/sign" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/*" element={<Error />} />
      <Route element={
        <UserProvider>
          <Layout />
        </UserProvider>
      }>
        <Route path="/" element={<Home />} />
        <Route path="/projet" element={<Projet />} />
        <Route path="/projet/:id" element={<MyProject />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default Routing;
