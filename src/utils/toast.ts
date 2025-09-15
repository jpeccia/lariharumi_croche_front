import { toast } from 'react-toastify';

// Tipos de notificação
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Configurações padrão para cada tipo
const toastConfigs = {
  success: {
    position: 'top-right' as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light' as const,
  },
  error: {
    position: 'top-right' as const,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light' as const,
  },
  warning: {
    position: 'top-right' as const,
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light' as const,
  },
  info: {
    position: 'top-right' as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light' as const,
  },
};

// Função principal para mostrar notificações
export const showToast = (type: ToastType, message: string, options?: Record<string, unknown>) => {
  const config = { ...toastConfigs[type], ...options };
  
  switch (type) {
    case 'success':
      return toast.success(message, config);
    case 'error':
      return toast.error(message, config);
    case 'warning':
      return toast.warning(message, config);
    case 'info':
      return toast.info(message, config);
    default:
      return toast(message, config);
  }
};

// Funções específicas para cada tipo
export const showSuccess = (message: string, options?: Record<string, unknown>) => 
  showToast('success', message, options);

export const showError = (message: string, options?: Record<string, unknown>) => 
  showToast('error', message, options);

export const showWarning = (message: string, options?: Record<string, unknown>) => 
  showToast('warning', message, options);

export const showInfo = (message: string, options?: Record<string, unknown>) => 
  showToast('info', message, options);

// Funções específicas para contextos da aplicação
export const showProductSuccess = (action: string) => 
  showSuccess(`Produto ${action} com sucesso! ✨`);

export const showCategorySuccess = (action: string) => 
  showSuccess(`Categoria ${action} com sucesso! 🎉`);

export const showImageSuccess = (action: string) => 
  showSuccess(`Imagem ${action} com sucesso! 📸`);

export const showNetworkError = () => 
  showError('Erro de conexão. Verifique sua internet e tente novamente. 🌐');

export const showServerError = () => 
  showError('Erro interno do servidor. Tente novamente mais tarde. ⚠️');

export const showAuthError = () => 
  showError('Sessão expirada. Faça login novamente. 🔐');

// Funções específicas para o catálogo de crochê
export const showCatalogError = () => 
  showError('Erro ao carregar catálogo. Tente recarregar a página. 🧶');

export const showImageLoadError = () => 
  showWarning('Algumas imagens podem não carregar corretamente. 📷');

export const showCategoryLoadError = () => 
  showError('Erro ao carregar categorias. Verifique sua conexão. 📂');

export const showProductLoadError = () => 
  showError('Erro ao carregar produtos. Tente novamente. 🎁');

export const showLoading = (message: string = 'Carregando...') => 
  showInfo(message, { autoClose: false });

export const dismissToast = (toastId?: string | number) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

// Função para mostrar notificação de carregamento e retornar ID para dismiss
export const showLoadingToast = (message: string = 'Carregando...') => {
  return toast.loading(message, {
    position: 'top-right',
    theme: 'light',
  });
};

// Função para atualizar toast de loading para success/error
export const updateToast = (toastId: string | number, type: ToastType, message: string) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: type === 'error' ? 5000 : 3000,
  });
};
