import React, { useEffect, useState, useMemo } from 'react';
import Echo from 'laravel-echo';
import { User } from '@/types';
import { usePage } from '@inertiajs/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Message from '@/components/Message';
import SearchConversations from '@/components/SearchConversations';

// Define the Echo instance outside the component
const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
});

type ChatLayoutProps = {
    children: React.ReactNode;
};

// type for User conversation array
type UserConversation = {
    id: number;
    name: string;
    is_group: boolean;
    is_user: boolean;
    is_admin?: boolean;
    created_at: string;
    updated_at: string;
    blocked_at?: string;
    last_message?: string;
    last_message_date?: string;
};

// type for Group conversation array
type GroupConversation = {
    id: number;
    name: string;
    description: string;
    is_group: boolean;
    is_user: boolean;
    owner_id: number;
    users: User[];
    user_ids: number[];
    created_at: string;
    updated_at: string;
    last_message?: string;
    last_message_date?: string;
};

type Conversation = UserConversation | GroupConversation;

// Type guard for UserConversation
function isUserConversation(conversation: Conversation): conversation is UserConversation {
    return (conversation as UserConversation).blocked_at !== undefined;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
    const page = usePage();

    const conversations: Conversation[] = page.props.conversations as Conversation[];
    const selectedConversation: Conversation = page.props.selectedConversation as Conversation;

    const [localConversations, setLocalConversations] = useState<Conversation[]>(conversations);
    const [onlineUsers, setOnlineUsers] = useState<{ [key: number]: User }>({});
    const [searchQuery, setSearchQuery] = useState<string>(''); // Add state for search query

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    const sortedConversations = useMemo(() => {
        return [...localConversations].sort((a, b) => {
            if (isUserConversation(a) && isUserConversation(b)) {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }
            }

            if (a.last_message_date && b.last_message_date) {
                return b.last_message_date.localeCompare(a.last_message_date);
            } else if (a.last_message_date) {
                return -1;
            } else if (b.last_message_date) {
                return 1;
            } else {
                return 0;
            }
        });
    }, [localConversations]);

    const filteredConversations = useMemo(() => {
        return sortedConversations.filter((conversation) =>
            conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [sortedConversations, searchQuery]);

    useEffect(() => {
        const channelName = 'online';
        const channel = echo.join(channelName);

        channel
            .here((users: User[]) => {
                const usersMap = users.reduce(
                    (acc, user) => {
                        acc[user.id] = user;
                        return acc;
                    },
                    {} as { [key: number]: User }
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

    console.log(localConversations);

    return (
        <div className="flex flex-col">
            <div className="grid flex-1 grid-cols-12">
                <div className="col-span-3 flex flex-col gap-y-8 bg-white">
                    <SearchConversations query={searchQuery} onChange={(value) => setSearchQuery(value)} />
                    <ScrollArea className="h-[calc(100vh-162px)]">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map((conversation) => (
                                <Message
                                    key={conversation.is_group ? 'group_' + conversation.id : 'user_' + conversation.id}
                                    name={conversation.name}
                                    message={conversation.last_message}
                                    date={conversation.last_message_date}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No conversations found.</p>
                        )}
                    </ScrollArea>
                </div>
                <div className="col-span-9 flex h-full flex-col">
                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
};

export default ChatLayout;
