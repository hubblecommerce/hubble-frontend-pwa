//
// init vuex store
//

export default ({ isHMR, app, store }) => {
	// modApiRequests
	store.commit('modApiRequests/setOptionsLimit', process.env.limiter);
	store.commit('modApiRequests/setOptionsSorter', process.env.sorter);
}
