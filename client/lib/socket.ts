import { io } from "socket.io-client";

const SERVER =
  process.env.NODE_ENV === "production"
    ? "https://pictionary-zbjk.onrender.com"
    : "http://localhost:4000";

export const socket = io(SERVER, { transports: ["websocket"] });

socket.on("connect_error", (err: any) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message);

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description);

  // some additional context, for example the XMLHttpRequest object
  console.log(err.context);
});
