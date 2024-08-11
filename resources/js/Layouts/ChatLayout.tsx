import React, { useEffect } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const ChatLayout = ({ children }) => {
    const echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT,
        wssPort: import.meta.env.VITE_REVERB_PORT,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });

    useEffect(() => {
        echo.join('online')
            .here((users) => console.log('here', users))
            .joining((user) => console.log('joining', user))
            .leaving((user) => console.log('leaving', user));
    }, []);

    return (
        <main>
            <h1>Chat Layout</h1>
            <div>{children}</div>
        </main>
    );
};

export default ChatLayout;
