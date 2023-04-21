// import { BigNumber } from 'ethers';
import { IWeb3StoreActions, IWeb3StoreState } from 'types/web3StoreTypes';
import { createStore } from 'zustand';
import { produce } from 'immer';

// import { combine } from 'zustand/middleware';

import {
	getAccount,
	disconnect,
	watchAccount,
	watchNetwork,
	fetchBalance,
	getNetwork,
} from 'wagmi/actions';

// export const useApplicationState = create<ApplicationState>((set, get) => {

const initialState: IWeb3StoreState = {
	userAddress: undefined,
	balance: {
		amount: null,
		symbol: undefined,
		isLoading: false,
		isError: false,
	},
};

interface IWeb3Store extends IWeb3StoreState, IWeb3StoreActions {}

export const web3Store = createStore<IWeb3Store>((set, get) => ({
	...initialState,
	initiateWatchNetwork: () => {
		console.log('INITIATE WATCH NETWORK');
		const { chain, chains } = getNetwork();
		console.log({ chain, chains });

		// event listener for network change
		const unwatch = watchNetwork((network) => {
			console.log('INSIDE WATCH NETWORK', network);
		});
		return unwatch;
	},

	initiateWatchAccount: () => {
		console.log('INITIATE WATCH ACCOUNT');

		// failsafe check - if wallet is connected,
		// but for some reason this.userAddress !== address
		const { isConnected, isConnecting, address } = getAccount();
		if (isConnected && !isConnecting && get().userAddress !== address) {
			disconnect();
		}

		// event listener for account connect/disconnect
		const unwatch = watchAccount((account) => {
			console.log('INSIDE WATCH ACCOUNT', account);

			if (account.isConnected) {
				set({ userAddress: account.address });
				get().fetchWalletBalance();
			} else if (account.isDisconnected) {
				get().resetStore();
			}
		});
		return unwatch;
	},

	fetchWalletBalance: async () => {
		console.log('fetch balance function');

		// prevent multiple calls
		if (get().balance.isLoading) {
			console.log('fetching balance already in progress');
			return;
		}

		console.log('fetching');

		const address = get().userAddress;

		// fetch if user is logged in
		if (address) {
			get().setBalanceState({
				isLoading: true,
				isError: false,
			});
			try {
				const balance = await fetchBalance({
					address,
				});

				console.log({ balance });
				// set({
				// 	balance: {
				// 		...get().balance,
				// 		amount: balance?.formatted,
				// 		symbol: balance?.symbol,
				// 	},
				// });
				get().setBalanceState({
					amount: balance?.formatted,
					symbol: balance?.symbol,
				});
			} catch (error) {
				console.log(error);
				get().setBalanceState({
					isError: true,
				});
			} finally {
				get().setBalanceState({
					isLoading: false,
				});
			}
		}
	},

	setUserAddress: (address: `0x${string}` | undefined) => {
		set({ userAddress: address });
	},

	resetStore: () => {
		set(initialState);
	},

	setBalanceState: ({
		amount,
		symbol = 'default value',
		isError,
		isLoading,
	}: Partial<IWeb3StoreState['balance']>) => {
		set(
			produce((state) => ({
				balance: {
					// ...state.balance,
					amount: amount !== undefined ? amount : state.balance.amount,
					symbol: symbol !== 'default value' ? symbol : state.balance.symbol,
					isError: isError !== undefined ? isError : state.balance.isError,
					isLoading:
						isLoading !== undefined ? isLoading : state.balance.isLoading,
				},
			}))
		);
	},
}));
