'use client';

import { useState } from 'react';

type Props = {
    keywords: string[];
    setKeywords: (keywords: string[]) => void;
};

export default function KeywordInput({ keywords, setKeywords }: Props) {
    const [text, setText] = useState("");
    const [isComposing, setIsComposing] = useState(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleAddKeyword = () => {
        const trimmed = text.trim();
        if (trimmed && !keywords.includes(trimmed)) {
            setKeywords([...keywords, trimmed]);
        }
        setText("");
    };

    const handleRemoveKeyword = (index: number) => {
        const updated = [...keywords];
        updated.splice(index, 1);
        setKeywords(updated);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            handleAddKeyword();
        }
    };

    return (
        <div>
            <div className="flex gap-2">
                <input
                    type="text"
                    className="p-2 border border-gray-300 rounded w-full"
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    placeholder="キーワードを入力してEnter"
                />
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((word, i) => (
                    <span
                        key={i}
                        className="bg-sky-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                    >
                        {word}
                        <button
                            onClick={() => handleRemoveKeyword(i)}
                            className="ml-2 text-white"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}