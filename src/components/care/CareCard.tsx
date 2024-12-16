import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CareCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export function CareCard({ title, description, Icon }: CareCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Icon className="w-8 h-8 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-purple-800 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}