//
// init vuex store
//

export default ({ isHMR, app, store }) => {

	// modApiResources
	store.commit('modApiResources/setApiBaseUrl', process.env.API_BASE_URL);

	// modApiRequests
	store.commit('modApiRequests/setOptionsLimit', process.env.limiter);
	store.commit('modApiRequests/setOptionsSorter', process.env.sorter);
}
