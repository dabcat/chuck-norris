import axios from 'axios';
import responseHandler from 'services/responseHandler';

axios.defaults.baseURL = 'https://api.chucknorris.io/';

const getRandomFact = () =>
	axios
		.get('jokes/random')
		.then(responseHandler.success)
		.catch(responseHandler.error);

const searchFact = (query) =>
	axios
		.get('jokes/search', { params: { query } })
		.then(responseHandler.success)
		.catch(responseHandler.error);

export default {
	getRandomFact,
	searchFact
};
