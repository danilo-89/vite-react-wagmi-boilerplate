import Connect from '@components/Connect';

const Header = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				padding: '15px',
				backgroundColor: '#293039',
			}}
		>
			<div>Header</div>
			<Connect />
		</div>
	);
};

export default Header;
