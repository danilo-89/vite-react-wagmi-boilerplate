// truncate wallet address (return E.g.: "0x2c…F30526")
export const truncateAddress = (
	address: string | undefined,
	partOne = 2,
	partTwo = 6
) => {
	if (!address) return '';
	const re = new RegExp(
		`^(0x[a-zA-Z0-9]{${partOne}})[a-zA-Z0-9]+([a-zA-Z0-9]{${partTwo}})$`
	);
	const match = address.match(re);
	if (!match) return address;
	return `${match[1]}…${match[2]}`;
};
