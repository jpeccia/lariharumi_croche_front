// Serviço de Analytics para monitoramento de eventos
interface AnalyticsEvent {
  event: string;
  category: string;
  action?: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

interface PageViewEvent {
  page: string;
  title: string;
  url: string;
  referrer?: string;
  timestamp: number;
  sessionId: string;
}

interface ConversionEvent {
  conversionType: string;
  value?: number;
  properties?: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
}

class AnalyticsService {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private pageViews: PageViewEvent[] = [];
  private conversions: ConversionEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadStoredData();
    this.setupAutoFlush();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadStoredData(): void {
    try {
      const stored = localStorage.getItem('analytics_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.events = data.events || [];
        this.pageViews = data.pageViews || [];
        this.conversions = data.conversions || [];
      }
    } catch (error) {
      console.warn('Erro ao carregar dados de analytics:', error);
    }
  }

  private saveData(): void {
    try {
      const data = {
        events: this.events,
        pageViews: this.pageViews,
        conversions: this.conversions,
        sessionId: this.sessionId,
        userId: this.userId,
      };
      localStorage.setItem('analytics_data', JSON.stringify(data));
    } catch (error) {
      console.warn('Erro ao salvar dados de analytics:', error);
    }
  }

  private setupAutoFlush(): void {
    // Salva dados a cada 30 segundos
    setInterval(() => {
      this.saveData();
    }, 30000);

    // Salva dados antes de sair da página
    window.addEventListener('beforeunload', () => {
      this.saveData();
    });
  }

  // Rastrear eventos customizados
  track(event: string, category: string, action?: string, label?: string, value?: number, properties?: Record<string, unknown>): void {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.events.push(analyticsEvent);
  }

  // Rastrear visualizações de página
  trackPageView(page: string, title?: string): void {
    if (!this.isEnabled) return;

    const pageViewEvent: PageViewEvent = {
      page,
      title: title || document.title,
      url: window.location.href,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.pageViews.push(pageViewEvent);
  }

  // Rastrear conversões (compras, cadastros, etc.)
  trackConversion(conversionType: string, value?: number, properties?: Record<string, unknown>): void {
    if (!this.isEnabled) return;

    const conversionEvent: ConversionEvent = {
      conversionType,
      value,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.conversions.push(conversionEvent);
  }

  // Rastrear cliques
  trackClick(element: string, page: string, properties?: Record<string, unknown>): void {
    this.track('click', 'interaction', 'click', element, undefined, {
      page,
      ...properties,
    });
  }

  // Rastrear erros
  trackError(error: Error, context?: string): void {
    this.track('error', 'system', 'error', error.message, undefined, {
      context,
      stack: error.stack,
      userAgent: navigator.userAgent,
    });
  }

  // Rastrear tempo de carregamento
  trackLoadTime(page: string, loadTime: number): void {
    this.track('load_time', 'performance', 'page_load', page, loadTime);
  }

  // Definir usuário
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Habilitar/desabilitar analytics
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Obter dados para envio
  getData(): {
    events: AnalyticsEvent[];
    pageViews: PageViewEvent[];
    conversions: ConversionEvent[];
    sessionId: string;
    userId?: string;
  } {
    return {
      events: [...this.events],
      pageViews: [...this.pageViews],
      conversions: [...this.conversions],
      sessionId: this.sessionId,
      userId: this.userId,
    };
  }

  // Limpar dados
  clearData(): void {
    this.events = [];
    this.pageViews = [];
    this.conversions = [];
    localStorage.removeItem('analytics_data');
  }

  // Obter estatísticas básicas
  getStats(): {
    totalEvents: number;
    totalPageViews: number;
    totalConversions: number;
    sessionDuration: number;
  } {
    const now = Date.now();
    const sessionStart = this.pageViews[0]?.timestamp || now;
    
    return {
      totalEvents: this.events.length,
      totalPageViews: this.pageViews.length,
      totalConversions: this.conversions.length,
      sessionDuration: now - sessionStart,
    };
  }
}

// Instância singleton
export const analytics = new AnalyticsService();

// Hook para usar analytics em componentes React
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackLoadTime: analytics.trackLoadTime.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    getStats: analytics.getStats.bind(analytics),
  };
};

export default analytics;
