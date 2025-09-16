import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

interface DonationTierProps {
  icon: LucideIcon;
  title: string;
  amount: string;
  description: string;
  onClick: () => void;
  isSelected?: boolean;
}

export function DonationTier({ icon: Icon, title, amount, description, onClick, isSelected = false }: DonationTierProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-left w-full border-2 ${
        isSelected 
          ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50' 
          : 'border-transparent hover:border-purple-200'
      }`}
    >
      {/* Decoração de fundo */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
        <Sparkles className="w-6 h-6 text-purple-400" />
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Ícone com background gradiente */}
        <div className="relative mb-6">
          <div className={`w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
            isSelected ? 'from-pink-200 to-purple-200' : ''
          }`}>
            <Icon className="w-10 h-10 text-purple-600" />
          </div>
          {/* Indicador de seleção */}
          {isSelected && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        {/* Conteúdo */}
        <div>
          <h3 className="text-xl font-bold text-purple-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-3xl font-bold text-pink-500 mb-3 group-hover:text-pink-600 transition-colors duration-300">
            {amount}
          </p>
          <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}