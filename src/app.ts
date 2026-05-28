// ZaUI stylesheet
import "zmp-ui/zaui.css";
// Tailwind stylesheet
import "@/css/tailwind.scss";
// Your stylesheet
import "@/css/app.scss";

// React core
import React from "react";
import { createRoot } from "react-dom/client";

// Mount the app
import Layout from "@/components/layout";
import { migrateStoredData } from "@/utils/data-normalization";

// Expose app configuration
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig as any;
}

// One-time data normalization migration
try {
  migrateStoredData();
} catch (e) {
  console.warn('Data migration failed', e);
}

// Error boundary to show visible error instead of blank white screen
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return React.createElement(
        'div',
        { style: { padding: '24px', fontFamily: 'sans-serif' } },
        React.createElement('h2', { style: { color: '#c00' } }, 'Ứng dụng gặp lỗi'),
        React.createElement('p', { style: { color: '#333', marginTop: '8px' } },
          this.state.error.message
        ),
        React.createElement(
          'button',
          {
            style: { marginTop: '16px', padding: '8px 16px', background: '#007aff', color: '#fff', border: 'none', borderRadius: '8px' },
            onClick: () => this.setState({ error: null })
          },
          'Thử lại'
        )
      );
    }
    return this.props.children;
  }
}

const root = createRoot(document.getElementById("app")!);
root.render(
  React.createElement(ErrorBoundary, null, React.createElement(Layout))
);
