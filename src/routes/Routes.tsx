import { Suspense } from 'react';
import {
	BrowserRouter as Router,
	Routes as BRoutes,
	Route,
} from 'react-router-dom';

// stores
import { useWeb3 } from '@contexts/web3Context';

// components
import Layout from '@components/Layout/Layout';
import Home from '@pages/Home';
import Header from '@components/Header';

const Routes = () => {
	const web3store = useWeb3();
	return (
		<Suspense fallback={<div>loading...</div>}>
			<Router>
				<Header />
				<Suspense fallback={<div>loading...</div>}>
					<BRoutes>
						<Route element={<Layout />}>
							<Route
								path='/'
								element={web3store ? <Home /> : <div>loading...</div>}
							/>
							<Route path='*' element={<div>Not found!</div>} />
						</Route>
					</BRoutes>
				</Suspense>
			</Router>
		</Suspense>
	);
};
export default Routes;
