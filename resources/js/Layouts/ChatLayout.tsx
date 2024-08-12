import React, { useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import { User } from '@/types';

// Define the Echo instance outside the component to avoid recreating it on every render
const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
});

const ChatLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: User }>({});

    useEffect(() => {
        const channelName = 'online';
        const channel = echo.join(channelName);

        channel
            .here((users: User[]) => {
                // Initialize state with users already present
                const usersMap = users.reduce(
                    (acc, user) => {
                        acc[user.id] = user;
                        return acc;
                    },
                    {} as { [key: string]: User }
                );
                setOnlineUsers(usersMap);
                console.log('Initial online users:', usersMap);
            })
            .joining((user: User) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers, [user.id]: user };
                    console.log('User joining:', user);
                    console.log('Updated onlineUsers:', updatedUsers);
                    return updatedUsers;
                });
            })
            .leaving((user: User) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const { [user.id]: _, ...rest } = prevOnlineUsers;
                    console.log('User leaving:', user);
                    console.log('Updated onlineUsers:', rest);
                    return rest;
                });
            })
            .error((error: Error) => console.error('Echo error:', error));

        return () => {
            echo.leave(channelName);
        };
    }, []);

    return (
        <main>
            <h1>Chat Layout</h1>
            <div>{children}</div>
        </main>
    );
};

export default ChatLayout;
