import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { polygonMumbai } from 'wagmi/chains';

// pages
import ErrorBoundary from '@components/ErrorBoundary';
import Web3Provider from '@contexts/web3Context';
import Routes from '@routes/index';

export const preferredChain = polygonMumbai;

const { chains, provider, webSocketProvider } = configureChains(
	[preferredChain],
	[
		publicProvider({ priority: 2 }),
		// alchemyProvider({ apiKey: alchemyId, priority: 0 }),
		// infuraProvider({ apiKey: infuraId, priority: 1 }),
	],
	{ pollingInterval: 3000 }
);

const client = createClient({
	autoConnect: true,
	connectors: [new MetaMaskConnector({ chains })],
	provider,
	webSocketProvider,
});

function App() {
	return (
		<ErrorBoundary>
			<WagmiConfig client={client}>
				<Web3Provider>
					<Routes />
				</Web3Provider>
			</WagmiConfig>
		</ErrorBoundary>
	);
}

export default App;
