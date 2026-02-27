import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-900 text-white rounded border border-red-500 m-4">
                    <h2 className="font-bold mb-2">Something went wrong.</h2>
                    <pre className="text-xs overflow-auto bg-black/50 p-2 rounded">
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}
