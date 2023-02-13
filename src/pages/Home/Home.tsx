import { observer } from 'mobx-react-lite';

// stores
import { useWeb3 } from '@contexts/web3Context';

const Home = observer(function Home() {
	const { userAddress, fetchWalletBalance, balance, setBalanceState } =
		useWeb3()!;

	return (
		<div>
			<div>user address: {userAddress}</div>
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
			<button type='button' onClick={fetchWalletBalance}>
				Fetch Balance
			</button>
		</div>
	);
});

export default Home;
