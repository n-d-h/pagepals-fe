export function applyFilter({ inputData, comparator, filters }) {
	const { name, status, role } = filters;

	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (name) {
		inputData = inputData.filter((user) => {
			if (user.customer && user.customer.fullName) {
			  return user.customer.fullName.toLowerCase().indexOf(name.toLowerCase()) !== -1;
			}
			return false;
		  });
	}

	if (status !== 'all') {
		inputData = inputData.filter((user) => user.accountState.name.toLowerCase() === status);
	}

	if (role.length) {
		inputData = inputData.filter((user) => role.includes(user.role));
	}

	return inputData;
}