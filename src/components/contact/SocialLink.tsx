import { LucideIcon, ExternalLink } from 'lucide-react';

interface SocialLinkProps {
  platform: string;
  username: string;
  url: string;
  Icon: LucideIcon;
}

export function SocialLink({ platform, username, url, Icon }: SocialLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 p-6 bg-gradient-to-r from-white to-purple-50 rounded-2xl shadow-lg hover:shadow-xl border border-purple-100 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-purple-600" />
      </div>
      
      <div className="flex-1">
        <div className="font-bold text-purple-800 text-lg group-hover:text-purple-600 transition-colors duration-300">
          {platform}
        </div>
        <div className="text-gray-600 text-sm">@{username}</div>
      </div>
      
      <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ExternalLink className="w-4 h-4 text-purple-600" />
      </div>
    </a>
  );
}