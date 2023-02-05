import { BigNumber } from 'ethers';
import { configure, makeAutoObservable, runInAction } from 'mobx';
import { IWeb3StoreState } from 'types/web3StoreTypes';

// eslint-disable-next-line import/no-extraneous-dependencies
import { watchAccount, fetchBalance } from '@wagmi/core';

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

	initiateWatchAccount() {
		console.log('INITIATE WATCH ACCOUNT');
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
				});
			} catch (error) {
				console.log(error);
				this.setBalanceState({ isError: true });
			} finally {
				this.setBalanceState({ isLoading: false });
			}
		}
	}

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
