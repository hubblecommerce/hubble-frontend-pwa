export default async function ({ store, route, error }) {
    // Reset filter of api request body,
    // in case user come from category which uses filter for getting products of category
    store.commit('modApiCategory/resetFilter');

    // Set limit to request if isset in url
    if (route.query.limit != null) {
        store.commit('modApiCategory/setLimit', route.query.limit);
        store.commit('modApiRequests/setPaginationPerPage', route.query.limit);
    }

    // Set page to request if isset in url
    if (route.query.page != null) {
        store.commit('modApiCategory/setPage', route.query.page);
    } else {
        store.commit('modApiCategory/setPage', 1);
    }

    // Set sort order to request if isset in url
    if (route.query.sort != null) {
        store.commit('modApiCategory/setSorting', route.query.sort);
    } else {
        store.commit('modApiCategory/setSorting', 0);
    }

    // Set search term to request if isset in url
    if (route.query.term != null) {
        store.commit('modApiCategory/setTerm', route.query.term);
    }

    // Set filter / facets to request
    store.commit('modApiCategory/setFilters', route.query);

    try {
        // Call API
        const searchResponse = await store.dispatch('modSearch/apiCatalogsearch');

        // Map resulting products
        const mappedProducts = await store.dispatch('modApiCategory/mappingCategoryProducts', searchResponse.data);

        // Save mapped Products to store
        store.commit('modApiCategory/setDataCategoryProducts', {
            data: {
                result: mappedProducts,
            },
        });

        // Map resulting aggregations (filter, facets)
        const mappedFacets = await store.dispatch(
            'modApiRequests/mapAggregationsToFacets',
            searchResponse.data.aggregations
        );

        // Save mapped aggregations to store
        store.commit('modApiRequests/setRequestFacets', mappedFacets);

        // Set page type (Search = Category List)
        store.commit('modApiResources/setPageType', 'category');
    } catch (e) {
        error({ statusCode: 404, message: e });
    }
}
