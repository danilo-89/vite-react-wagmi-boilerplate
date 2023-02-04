import { createContext, useContext, useEffect } from 'react';
import { Web3Store } from '@stores/web3Store';
import { observer } from 'mobx-react-lite';

const web3Store = new Web3Store();

interface IProviderProps {
	children: JSX.Element | JSX.Element[] | React.ReactNode;
}

// 1. creating context
const Web3Context = createContext<Web3Store | null>(null);

// 2. defining Provider component for wrapping components that need to use context
// eslint-disable-next-line prefer-arrow-callback
const Web3Provider = observer(function Web3Provider({
	children,
}: IProviderProps) {
	// const unsub = store.fetchFieldsData();

	console.log('context refreshed');
	console.log({ Web3Context });

	useEffect(() => {
		const unwatch = web3Store.initiateWatchAccount();

		return () => unwatch();
	}, []);

	// 0x326C977E6efc84E512bB9C30f76E30c160eD06FB

	return (
		<Web3Context.Provider value={web3Store}>{children}</Web3Context.Provider>
	);
});

// 3. custom hook for using context
export const useWeb3 = () => {
	const context = useContext(Web3Context);

	// error handling (if component is not inside context provider)
	if (context === undefined) {
		throw new Error('useWeb3 must be used inside a Web3Provider');
	}

	return context;
};

export default Web3Provider;
