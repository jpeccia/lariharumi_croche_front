export function buildIgDmUrl(username: string, message?: string): string {
  const base = `https://ig.me/m/${username}`;
  if (message && message.trim().length > 0) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

export async function openIgDm(username: string, message?: string): Promise<void> {
  const url = buildIgDmUrl(username, message);

  // Abre imediatamente para preservar o gesto do usuário (evita bloqueio em mobile)
  const opened = window.open(url, '_blank', 'noopener');

  // Fallback: se o pop-up for bloqueado, navega diretamente
  if (!opened) {
    window.location.href = url;
  }

  // Tentativa de copiar a mensagem em segundo plano (não bloquear a abertura)
  if (message && typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(message)
      .then(async () => {
        try {
          const { showInfo } = await import('./toast');
          showInfo('Mensagem copiada! Se não aparecer, cole no Instagram.');
        } catch {
          // Ignora se não conseguir mostrar toast
        }
      })
      .catch(() => {
        // Ignora falhas de cópia
      });
  }
}