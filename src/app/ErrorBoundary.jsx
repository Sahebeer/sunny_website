import React from 'react';
import { Fallback } from './Fallback';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('Section boundary caught error:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <Fallback sectionName={this.props.sectionName} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
