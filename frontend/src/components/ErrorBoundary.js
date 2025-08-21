import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { logError } from '../utils/errorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, { 
      errorInfo,
      component: 'ErrorBoundary',
      props: this.props 
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <div className="text-center">
            <Alert variant="danger">
              <Alert.Heading>Oops, something went wrong!</Alert.Heading>
              <p>
                The application encountered an unexpected error. We've logged this issue
                and our technical team will fix it as soon as possible.
              </p>
              <hr />
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="outline-primary" onClick={this.handleReload}>
                  Reload Page
                </Button>
                <Button variant="primary" onClick={this.handleGoHome}>
                  Go Home
                </Button>
              </div>
            </Alert>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;