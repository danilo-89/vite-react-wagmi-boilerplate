import { BigNumber } from 'ethers';
import { configure, makeAutoObservable, runInAction } from 'mobx';
import { IWeb3StoreState } from 'types/web3StoreTypes';

import {
	getAccount,
	disconnect,
	watchAccount,
	watchNetwork,
	fetchBalance,
	getNetwork,
} from 'wagmi/actions';

configure({ observableRequiresReaction: true });

export class Web3Store {
	private state: IWeb3StoreState = {
		userAddress: undefined,
		balance: {
			amount: null,
			symbol: undefined,
			isLoading: false,
			isError: false,
		},
	};

	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true });
		// this.testWatch();
	}

	// TODO: initiateWatchNetwork
	initiateWatchNetwork() {
		console.log('INITIATE WATCH NETWORK');

		const { chain, chains } = getNetwork();
		console.log({ chain, chains });

		// event listener for account connect/disconnect
		const unwatch = watchNetwork((network) => {
			console.log('INSIDE WATCH NETWORK', network);
		});
		return unwatch;
	}

	initiateWatchAccount() {
		console.log('INITIATE WATCH ACCOUNT');

		// failsafe check - if wallet is connected,
		// but for some reason this.userAddress !== address
		const { isConnected, isConnecting, address } = getAccount();
		if (isConnected && !isConnecting && this.userAddress !== address) {
			disconnect();
		}

		// event listener for account connect/disconnect
		const unwatch = watchAccount((account) => {
			console.log('INSIDE WATCH ACCOUNT', account);

			if (account.isConnected) {
				this.setUserAddress(account.address);
				this.fetchWalletBalance();
			} else if (account.isDisconnected) {
				this.resetStore();
			}
		});
		return unwatch;
	}

	*fetchWalletBalance(): any {
		// prevent multiple calls
		if (this.balance.isLoading) {
			console.log('fetching ballance already in progress');
			return;
		}

		// fetch if user is logged in
		if (this.userAddress) {
			this.setBalanceState({ isLoading: true, isError: false });
			try {
				const balance = yield fetchBalance({
					address: this.userAddress,
				});

				console.log({ balance });
				this.setBalanceState({
					amount: balance?.formatted,
					symbol: balance?.symbol,
					isError: false,
				});
			} catch (error) {
				console.log(error);
				this.setBalanceState({ isError: true });
			} finally {
				this.setBalanceState({ isLoading: false });
			}
		}
	}

	// const throttled = _.throttle(() => console.log('test'), 7000, {trailing: false});

	resetStore() {
		this.state.userAddress = undefined;
		this.state.balance = {
			amount: null,
			symbol: undefined,
			isLoading: false,
			isError: false,
		};
	}

	setUserAddress(address_: `0x${string}` | undefined) {
		this.state.userAddress = address_;
	}

	setBalanceState({
		amount,
		symbol = 'default value',
		isError,
		isLoading,
	}: Partial<IWeb3StoreState['balance']>) {
		if (amount !== undefined) this.state.balance.amount = amount;
		if (symbol !== 'default value') this.state.balance.symbol = symbol;
		if (isError !== undefined) this.state.balance.isError = isError;
		if (isLoading !== undefined) this.state.balance.isLoading = isLoading;
	}

	get userAddress() {
		return this.state.userAddress;
	}

	get balance() {
		return this.state.balance;
	}
}
