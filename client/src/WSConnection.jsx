
import  { useState, useEffect } from "react";
import io from "socket.io-client";

const patient = {
  id: 1,
  name: "John Doe",
  abhaNumber: 91501320832162,
  abhaAddress: "gaurav.tripathi_55@abdm",
  mobile: "9876543210",
  age: 30,
  sex: "Male",
  image: "",
};

const WSConnection = () => {
  const [socket, setSocket] = useState(null);
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    if (!patient || !patient.abhaAddress || !patient.abhaNumber) {
      return;
    }

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    const joinRoom = () => {
      const room = patient.abhaAddress;
      const username = patient.abhaNumber;

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
      const room = patient.abhaAddress;
      const username = patient.abhaNumber;

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
  }, [patient]);

  return (
    <div>
      <h2>WebSocket Connection</h2>
      {linkToken ? (
        <p>Link Token: {linkToken}</p>
      ) : (
        <p>Waiting for the link token...</p>
      )}
    </div>
  );
};

export default WSConnection;
