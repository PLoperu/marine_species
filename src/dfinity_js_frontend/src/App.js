import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import "./App.css";
import { login, logout as destroy } from "./utils/auth";
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";
import Home from "./pages/Home";


const App = function AppWrapper() {
  const isAuthenticated = window.auth.isAuthenticated;
  
  return (
    <>
    <Notification />
      {isAuthenticated ? (
        <Container fluid="md">
       
          <main>
            <Home />
          </main>
        </Container>
      ) : (
        <Cover name="Street Food" login={login}  />
      )}
    </>
  );
};

export default App;
