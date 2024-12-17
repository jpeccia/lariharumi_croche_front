import React from 'react';
import { Heart } from 'lucide-react';

interface SupportMessageProps {
  message: string;
  author: string;
}

export function SupportMessage({ message, author }: SupportMessageProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-gray-600 text-sm mb-3">{message}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-purple-800">{author}</span>
        <Heart className="w-4 h-4 text-pink-400 fill-current" />
      </div>
    </div>
  );
}