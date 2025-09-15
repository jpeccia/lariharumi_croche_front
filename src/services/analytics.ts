// Serviço de analytics para monitoramento da aplicação
interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
}

interface PageViewEvent {
  page: string;
  title?: string;
  url?: string;
  properties?: Record<string, unknown>;
}

class AnalyticsService {
  private isEnabled: boolean;
  private events: AnalyticsEvent[] = [];
  private pageViews: PageViewEvent[] = [];

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  // Rastrear eventos
  track(event: string, category: string, action: string, label?: string, value?: number, properties?: Record<string, unknown>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      properties
    };

    this.events.push(analyticsEvent);

    if (this.isEnabled) {
      // Em produção, enviar para serviço de analytics real
      this.sendToAnalytics(analyticsEvent);
    } else {
      // Em desenvolvimento, apenas log
      console.log('Analytics Event:', analyticsEvent);
    }
  }

  // Rastrear visualizações de página
  trackPageView(page: string, title?: string, url?: string, properties?: Record<string, unknown>) {
    const pageView: PageViewEvent = {
      page,
      title,
      url: url || window.location.href,
      properties
    };

    this.pageViews.push(pageView);

    if (this.isEnabled) {
      this.sendPageViewToAnalytics(pageView);
    } else {
      console.log('Page View:', pageView);
    }
  }

  // Rastrear cliques
  trackClick(element: string, page: string, properties?: Record<string, unknown>) {
    this.track('click', 'engagement', 'click', element, undefined, {
      page,
      ...properties
    });
  }

  // Rastrear erros
  trackError(error: Error, errorInfo?: React.ErrorInfo) {
    this.track('error', 'error', 'javascript_error', error.message, undefined, {
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  // Rastrear performance
  trackPerformance(metric: string, value: number, properties?: Record<string, unknown>) {
    this.track('performance', 'performance', metric, undefined, value, properties);
  }

  // Rastrear conversões (ex: envio de formulário)
  trackConversion(conversion: string, value?: number, properties?: Record<string, unknown>) {
    this.track('conversion', 'conversion', conversion, undefined, value, properties);
  }

  // Métodos privados para envio real (implementar conforme necessário)
  private sendToAnalytics(event: AnalyticsEvent) {
    // Implementar integração com Google Analytics, Mixpanel, etc.
    // Exemplo:
    // gtag('event', event.action, {
    //   event_category: event.category,
    //   event_label: event.label,
    //   value: event.value,
    //   ...event.properties
    // });
  }

  private sendPageViewToAnalytics(pageView: PageViewEvent) {
    // Implementar envio de page view
    // Exemplo:
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //   page_title: pageView.title,
    //   page_location: pageView.url,
    //   ...pageView.properties
    // });
  }

  // Obter dados para debug
  getEvents() {
    return this.events;
  }

  getPageViews() {
    return this.pageViews;
  }

  // Limpar dados
  clear() {
    this.events = [];
    this.pageViews = [];
  }
}

// Instância singleton
export const analytics = new AnalyticsService();

// Hook para usar analytics em componentes React
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
  };
}
