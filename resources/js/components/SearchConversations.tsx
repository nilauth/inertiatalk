import React from 'react';

interface SearchProps {
    query: string;
    onChange: (value: string) => void;
}

const SearchConversations: React.FC<SearchProps> = ({ query, onChange }) => {
    return (
        <input
            className="mx-auto mt-6 w-[90%] rounded border p-2"
            type="text"
            placeholder="Filter users and groups"
            value={query}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default SearchConversations;
