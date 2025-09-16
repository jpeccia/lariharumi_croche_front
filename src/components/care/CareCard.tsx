import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CareCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export function CareCard({ title, description, Icon }: CareCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 hover:-translate-y-2 border border-purple-100">
      <div className="flex flex-col items-center text-center">
        {/* Ícone com background gradiente */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-10 h-10 text-purple-600" />
          </div>
          {/* Decoração sutil */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        </div>
        
        {/* Conteúdo */}
        <div>
          <h3 className="text-2xl font-bold text-purple-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}