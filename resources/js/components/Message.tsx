import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';

// Define types for the component props
interface MessageProps {
    name: string;
    message: string | null | undefined;
    date: string | undefined;
}

const Message: React.FC<MessageProps> = ({ name, message, date }) => {
    // Function to truncate text and handle null or undefined values
    function truncateText(text: string | null | undefined): string {
        const maxLength = 40;
        if (!text) {
            return 'No messages yet.';
        }
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    return (
        <div className="mr-8 flex w-full bg-white py-4 pl-4 pr-8">
            <div className="col-span-1 flex w-16 items-center justify-center">
                <Avatar className="h-12 w-12">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1 px-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{name}</h2>
                    <p className="text-sm text-gray-500">{date}</p>
                </div>
                <p className="text-gray-700">{truncateText(message)}</p>
            </div>
            <div className="flex w-4 items-center justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <EllipsisVertical className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Block</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default Message;
