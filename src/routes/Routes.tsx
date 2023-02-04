import { Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import {
	BrowserRouter as Router,
	Routes as BRoutes,
	Route,
} from 'react-router-dom';
import { useWeb3 } from '@contexts/web3Context';
import Layout from '@components/Layout/Layout';
import Home from '@pages/Home';

const Routes = observer(function Routes() {
	const web3store = useWeb3();

	return (
		<Suspense fallback={<div>loading...</div>}>
			<Router>
				<div>navigation</div>
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
});
export default Routes;
