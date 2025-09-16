import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50 font-medium transition-all duration-200 hover:bg-purple-700"
    >
      {children}
    </a>
  );
}

export function SkipLinks() {
  return (
    <div className="skip-links">
      <SkipLink href="#main-content">Pular para o conteúdo principal</SkipLink>
      <SkipLink href="#navigation">Pular para a navegação</SkipLink>
      <SkipLink href="#footer">Pular para o rodapé</SkipLink>
    </div>
  );
}

