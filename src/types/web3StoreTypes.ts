export interface IWeb3StoreState {
	userAddress: undefined | `0x${string}`;
	balance: {
		amount: null | number;
		isLoading: boolean;
		isError: boolean;
	};
}
