// stores
import { useWeb3 } from '@contexts/web3Context';
import { useStore } from 'zustand';

const Balance = () => {
	const setBalanceState = useStore(
		useWeb3()!,
		(state) => state.setBalanceState
	);
	const resetStore = useStore(useWeb3()!, (state) => state.resetStore);
	const balance = useStore(useWeb3()!, (state) => state.balance);

	return (
		<div>
			<div>
				user balance: {balance.amount} {balance.symbol}
			</div>
			<div>
				user balance is fetching: {balance.isLoading ? 'true' : 'false'}
			</div>
			<button
				type='button'
				onClick={() =>
					setBalanceState({ isLoading: false, isError: true, amount: null })
				}
			>
				test Balance
			</button>
			<button type='button' onClick={() => resetStore()}>
				reset State
			</button>
		</div>
	);
};

const Truncated = () => {
	const getTruncatedAddress = useStore(useWeb3()!, (state) =>
		state.getTruncatedAddress()
	);

	return <div>truncated address: {getTruncatedAddress}</div>;
};

const Home = () => {
	const userAddress = useStore(useWeb3()!, (state) => state.userAddress);
	const fetchWalletBalance = useStore(
		useWeb3()!,
		(state) => state.fetchWalletBalance
	);

	return (
		<div>
			<div>user address: {userAddress}</div>
			<Truncated />
			<Balance />
			<button type='button' onClick={fetchWalletBalance}>
				Fetch Balance
			</button>
		</div>
	);
};

export default Home;
