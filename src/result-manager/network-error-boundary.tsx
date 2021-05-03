import { Component } from 'react';

interface NetworkErrorBoundaryState {
  hasError: boolean;
}

export default class NetworkErrorBoundary extends Component<
  unknown,
  NetworkErrorBoundaryState
> {
  readonly state: NetworkErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): Partial<NetworkErrorBoundaryState> {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="message">网络已断开</div>;
    }

    return this.props.children;
  }
}
