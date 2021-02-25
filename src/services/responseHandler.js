const handleResponse = async (response) => {
	if (response.status === 'error') {
		// eslint-disable-next-line no-console
		console.error(`ERROR: ${response.data.message}`);
		return Promise.reject(new Error(response.data.message));
	}
	return response.data;
};

const handleError = async (error) =>
	Promise.reject(new Error(error.message || error));

export default {
	success: handleResponse,
	error: handleError
};
