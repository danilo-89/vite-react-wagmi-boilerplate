import { createContext, useContext, useEffect, useRef } from 'react';
import { createWeb3Store } from '@stores/web3Store';
import { useStore } from 'zustand';

// const web3Store = new Web3Store();
// https://medium.com/@nfailla93/zustand-in-react-dos-and-donts-5a608c26c68

interface IProviderProps {
	children: JSX.Element | JSX.Element[] | React.ReactNode;
}

// 1. creating context
const Web3Context = createContext<ReturnType<typeof createWeb3Store> | null>(
	null
);

// 2. defining Provider component for wrapping components that need to use context
const Web3Provider = ({ children }: IProviderProps) => {
	// const unsub = store.fetchFieldsData();

	// initiate store once
	const store = useRef(createWeb3Store()).current;

	console.log('context refreshed');
	const initiateWatchNetwork = useStore(
		store,
		(state) => state.initiateWatchNetwork
	);
	const initiateWatchAccount = useStore(
		store,
		(state) => state.initiateWatchAccount
	);

	const resetStore = useStore(store, (state) => state.resetStore);

	// subscribe/unsubscribe listeners
	useEffect(() => {
		console.log('subbed');
		const unwatchNetwork = initiateWatchNetwork();
		const unwatchAccount = initiateWatchAccount();

		return () => {
			console.log('unsubbed');
			resetStore();
			unwatchNetwork();
			unwatchAccount();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// 0x326C977E6efc84E512bB9C30f76E30c160eD06FB

	return <Web3Context.Provider value={store}>{children}</Web3Context.Provider>;
};

// 3. custom hook for using context
export const useWeb3 = () => {
	const context = useContext(Web3Context);
	console.log('inside useWeb3');

	// error handling (if component is not inside context provider)
	if (context === undefined) {
		throw new Error('useWeb3 must be used inside a Web3Provider');
	}

	return context;
};

export default Web3Provider;
