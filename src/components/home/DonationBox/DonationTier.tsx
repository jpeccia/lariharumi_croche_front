import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DonationTierProps {
  icon: LucideIcon;
  title: string;
  amount: string;
  description: string;
  onClick: () => void;
}

export function DonationTier({ icon: Icon, title, amount, description, onClick }: DonationTierProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02] text-left w-full"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl group-hover:from-pink-200 group-hover:to-purple-200 transition-colors">
          <Icon className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h3 className="font-medium text-purple-800 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-pink-500 mb-2">{amount}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
}