import { Socket, io } from "socket.io-client";

const deployedBaseURL = "https://ninejataxes.onrender.com/api"
const localBaseURL = "http://localhost:5000/api"
console.log(localBaseURL)
const baseURL = deployedBaseURL

let socket: Socket | null = null;

export const initSocket = ():Socket  => {
    if (!socket) {
        socket = io(baseURL, {
            withCredentials: true,
            autoConnect: false
        })
    }

    return socket
}

export const connectSocket = (): Socket => {

    const s = initSocket();

    if (!s.connected) {
        s.connect();
    }


    return s
}

export const disconnectSocket = () => {
    socket?.disconnect()
}
