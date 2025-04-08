import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import AdminOrderNotification from "../AdminOrderNotification/AdminOrderNotification";
import { toast } from "react-toastify";



const useWebSocket = () => {
    const [notifications, setNotifications] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    function handleAudioError(error) {
        console.error("Error playing sound:", error);
    }

    function playNotificationSound() {
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch(handleAudioError);
    }

    function addNotification(notification, setNotifications) {
        setNotifications((prev) => [...prev, notification]);
    }

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws"); 
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected to WebSocket");

                client.subscribe("/topic/admin", (message) => {

                    const notification = JSON.parse(message.body);

                    toast.dismiss();
                    toast(<AdminOrderNotification notification={notification}/>, {
                        autoClose:1000,
                        position: "bottom-right",
                        hideProgressBar: true,
                        className: "order-notification-toast",
                    });
                    

                    playNotificationSound();
                    addNotification(notification, setNotifications);
                });
            },
            onDisconnect: () => console.log("Disconnected from WebSocket"),
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    return notifications;
};

export default useWebSocket;
