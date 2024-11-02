import { useState } from "react";
import io from "socket.io-client";
import axios from "axios";


const WSConnection = () => {
  const [socket, setSocket] = useState(null);
  const [linkToken, setLinkToken] = useState(null);

  const createWS = (p) => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    const joinRoom = () => {
      const room = p.abhaAddress;
      const username = p.abhaNumber;

      if (room && username) {
        // Emit the 'join' event to join the room
        newSocket.emit("join", { username, room });

        // Listen for the 'link-token' event
        newSocket.on("link-token", (data) => {
          setLinkToken(data);
          leaveRoom();
        });
      }
    };

    const leaveRoom = () => {
      const room = p.abhaAddress;
      const username = p.abhaNumber;

      if (room && username) {
        // Emit the 'leave' event and disconnect the socket
        newSocket.emit("leave", { username, room });
        newSocket.disconnect();
      }
    };

    // Join the room when the component mounts
    joinRoom();

    // Cleanup when the component unmounts
    return () => {
      leaveRoom();
    };
  };

  const handleClick = () => {
    console.log("clicked");
    axios.post("http://localhost:5000/", {
      abhaNumber: 91501320832162,
      abhaAddress: "gaurav.tripathi_55@abdm",
    });
    const p = {
      abhaNumber: 91501320832162,
      abhaAddress: "gaurav.tripathi_55@abdm",
    };
    createWS(p);
  };

  return (
    <div>
      <h2>WebSocket Connection</h2>
      <button onClick={handleClick}> click</button>
      {linkToken ? (
        <p>Link Token: {linkToken}</p>
      ) : (
        <p>Waiting for the link token...</p>
      )}
    </div>
  );
};

export default WSConnection;
