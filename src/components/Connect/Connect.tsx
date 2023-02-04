import { useAccount, useConnect, useDisconnect } from 'wagmi';

const Connect = () => {
	const { connector: activeConnector, isConnected } = useAccount();
	const { connect, connectors, error, isLoading, pendingConnector } =
		useConnect();
	const { disconnect } = useDisconnect();

	return (
		<>
			{isConnected && <div>Connected to {activeConnector?.name}</div>}

			{connectors.map((connector) => (
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
			))}

			<button type='button' onClick={() => disconnect()}>
				Disconnect
			</button>

			{error && <div>{error.message}</div>}
		</>
	);
};

export default Connect;
