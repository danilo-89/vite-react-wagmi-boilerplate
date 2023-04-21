export interface IWeb3StoreState {
	userAddress: undefined | `0x${string}`;
	balance: {
		amount: null | string;
		symbol: undefined | string;
		isLoading: boolean;
		isError: boolean;
	};
}

export interface IWeb3StoreActions {
	initiateWatchNetwork: () => () => void;
	initiateWatchAccount: () => () => void;
	fetchWalletBalance: () => Promise<void>;
	setUserAddress: (address: `0x${string}` | undefined) => void;
	resetStore: () => void;
	setBalanceState: ({
		amount,
		symbol,
		isError,
		isLoading,
	}: Partial<IWeb3StoreState['balance']>) => void;
	getTruncatedAddress: () => string;
}
