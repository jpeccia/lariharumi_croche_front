export function buildIgDmUrl(username: string, message?: string): string {
  const base = `https://ig.me/m/${username}`;
  if (message && message.trim().length > 0) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

export async function openIgDm(username: string, message?: string): Promise<void> {
  const url = buildIgDmUrl(username, message);
  try {
    if (message && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(message);
      // Notifica o usuário para colar caso o texto não apareça automaticamente
      try {
        const { showInfo } = await import('./toast');
        showInfo('Mensagem copiada! Se não aparecer, cole no Instagram.');
      } catch {
        // Ignora se não conseguir mostrar toast
      }
    }
  } catch {
    // Se copiar falhar, apenas segue abrindo o link
  }
  window.open(url, '_blank', 'noopener');
}