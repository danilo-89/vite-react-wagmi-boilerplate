/* eslint-disable mobx/missing-observer */
import React, { Component, ErrorInfo, ReactNode } from 'react';

// Styles
import styles from './errorStyles.module.css';

interface Props {
	children?: ReactNode;
}

interface State {
	hasError: boolean;
	error: string;
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			hasError: false,
			error: '',
		};
	}

	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error: _?.message };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className={styles.errorContainer}>
					<h1>Oops... there was an error</h1>
					<p>
						<span>Error description: </span>
						{this.state.error}
					</p>
					<br />
					<p>
						Kindly, take a screenshot of this page or copy the error description
						and report it to us.
						<br />
						<br />
						Appreciate your help. Thanks.
					</p>
					<br />
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
