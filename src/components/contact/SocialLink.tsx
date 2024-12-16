import { LucideIcon } from 'lucide-react';

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
      className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <Icon className="w-6 h-6 text-purple-500" />
      <div>
        <div className="font-medium text-purple-800">{platform}</div>
        <div className="text-sm text-gray-600">@{username}</div>
      </div>
    </a>
  );
}