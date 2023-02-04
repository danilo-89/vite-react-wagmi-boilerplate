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

			if (account.address && account.isConnected) {
				this.setUserAddress(account.address);
			} else if (account.isDisconnected) {
				this.resetStore();
			}
		});
		return unwatch;
	}

	*fetchWalletBalance(): any {
		if (this.userAddress) {
			this.setBalanceState({ isLoading: true, isError: false });
			try {
				const balance = yield fetchBalance({
					address: this.userAddress,
				});

				console.log({ balance });
				this.setBalanceState({ amount: balance?.formatted });
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
			isLoading: false,
			isError: false,
		};
	}

	setUserAddress(address_: `0x${string}` | undefined) {
		this.state.userAddress = address_;
	}

	setBalanceState({
		amount,
		isError,
		isLoading,
	}: Partial<IWeb3StoreState['balance']>) {
		if (amount !== undefined) this.state.balance.amount = amount;
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

// With the function below you can limit the value to be the one for that particular key.

// function setAttribute<T extends Object, U extends keyof T>(obj: T, key: U, value: T[U]) {
//     obj[key] = value;
// }
// Example

// interface Pet {
//      name: string;
//      age: number;
// }

// const dog: Pet = { name: 'firulais', age: 8 };

// setAttribute(dog, 'name', 'peluche')     <-- Works
// setAttribute(dog, 'name', 100)           <-- Error (number is not string)
// setAttribute(dog, 'age', 2)              <-- Works
// setAttribute(dog, 'lastname', '')        <-- Error (lastname is not a property)
