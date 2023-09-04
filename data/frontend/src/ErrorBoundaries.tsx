import React, { ErrorInfo, ReactElement } from "react";
interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}
interface ErrorboundaryProps {
  children: ReactElement;
}

export class ErrorBoundaries extends React.Component<
  ErrorboundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorboundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: "",
    };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true });
    this.setState({ errorMessage: error.message });
    //Do something with err and errorInfo
  }
  render(): React.ReactNode {
    if (this.state?.hasError) {
      return (
        <div className="divClass">
          <p>
            <h3>Error</h3>
          </p>
          {this.state.errorMessage}
        </div>
      );
    }
    return this.props.children;
  }
}
