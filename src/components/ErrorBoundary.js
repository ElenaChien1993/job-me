import { Component } from 'react';

const ErrorView = ({ error, errorInfo }) => (
  <div>
    <h2>Something went wrong.</h2>
    <details>
      {error && error.toString()}
      <br />
      {errorInfo.componentStack}
    </details>
  </div>
);

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidMount() {
    console.log('error');
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    console.log('catch');
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    const { error, errorInfo } = this.state;
    if (errorInfo) {
      // Error path
      return <ErrorView {...{ error, errorInfo }} />;
    }
    // Normally, just render children
    return this.props.children;
  }
}
