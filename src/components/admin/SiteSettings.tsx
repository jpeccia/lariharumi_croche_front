import React from 'react';
import { Settings } from 'lucide-react';

export function SiteSettings() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-purple-500" />
        <h2 className="text-xl font-semibold text-purple-800">Configurações do Site</h2>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Instagram</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="@username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="+55 (11) 99999-9999"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}