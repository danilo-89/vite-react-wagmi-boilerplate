import { useAccount, useConnect, useDisconnect } from 'wagmi';

const Connect = () => {
	const { connector: activeConnector, isConnected } = useAccount();
	const { connect, connectors, error, isLoading, pendingConnector } =
		useConnect();
	const { disconnect } = useDisconnect();

	const metamaskAvaiable = typeof window.ethereum !== 'undefined';
	const filteredConnectors =
		connectors?.filter((x) => x.ready && x.id !== activeConnector?.id) || [];

	return (
		<div>
			{isConnected && <div>Connected to {activeConnector?.name}</div>}

			{filteredConnectors.length
				? filteredConnectors.map((connector) => (
						<button
							type='button'
							disabled={!connector.ready}
							key={connector.id}
							onClick={() => connect({ connector })}
						>
							{connector.name}
							{isLoading &&
								pendingConnector?.id === connector.id &&
								' (connecting)'}
						</button>
				  ))
				: null}

			<button type='button' onClick={() => disconnect()}>
				Disconnect
			</button>

			{error && <div>{error.message}</div>}
		</div>
	);
};

export default Connect;
