export interface IWeb3StoreState {
	userAddress: undefined | `0x${string}`;
	balance: {
		amount: null | number;
		symbol: undefined | string;
		isLoading: boolean;
		isError: boolean;
	};
}
