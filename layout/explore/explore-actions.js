import 'isomorphic-fetch';
import queryString from 'query-string';
import { createAction, createThunkAction } from 'redux-tools';
import WRISerializer from 'wri-json-api-serializer';

// RESET
export const resetExplore = createAction('EXPLORE/resetExplore');

// DATASETS
export const setDatasets = createAction('EXPLORE/setDatasetsList');
export const setDatasetsLoading = createAction('EXPLORE/setDatasetsLoading');
export const setDatasetsError = createAction('EXPLORE/setDatasetsError');
export const setDatasetsPage = createAction('EXPLORE/setDatasetsPage');
export const setDatasetsTotal = createAction('EXPLORE/setDatasetsTotal');
export const setDatasetsLimit = createAction('EXPLORE/setDatasetsLimit');
export const setDatasetsMode = createAction('EXPLORE/setDatasetsMode');

export const fetchDatasets = createThunkAction('EXPLORE/fetchDatasets', () => (dispatch, getState) => {
  const { explore, common } = getState();

  const qParams = queryString.stringify({
    application: process.env.APPLICATIONS,
    language: common.locale,
    includes: 'layer,metadata,vocabulary,widget',
    search: explore.filters.search,
    sort: `${explore.sort.direction < 0 ? '-' : ''}${explore.sort.selected}`,
    status: 'saved',
    published: true,
    // WOOOOOOW transform an array into an object, only if it is present
    ...Object.keys(explore.filters.selected).reduce((o, s, i) => ({
      ...o,
      ...explore.filters.selected[s].length && { [`concepts[${i}][0]`]: explore.filters.selected[s].join(',') }
    }), {}),
    'page[number]': explore.datasets.page,
    'page[size]': explore.datasets.limit
  });

  dispatch(setDatasetsLoading(true));
  dispatch(setDatasetsError(null));

  return fetch(`${process.env.WRI_API_URL}/dataset?${qParams}`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then((response) => {
      const { meta } = response;
      dispatch(setDatasetsTotal(meta['total-items']));
      return WRISerializer(response, { locale: common.locale });
    })
    .then((data) => {
      dispatch(setDatasetsLoading(false));
      dispatch(setDatasetsError(null));
      dispatch(setDatasets(data));
    })
    .catch((err) => {
      dispatch(setDatasetsLoading(false));
      dispatch(setDatasetsError(err));
    });
});


// MAP
export const setMapZoom = createAction('EXPLORE/setMapZoom');
export const setMapLatLng = createAction('EXPLORE/setMapLatLng');
export const setMapBasemap = createAction('EXPLORE/setMapBasemap');
export const setMapLabels = createAction('EXPLORE/setMapLabels');
export const setMapBoundaries = createAction('EXPLORE/setMapBoundaries');


// LAYERS
export const toggleMapLayerGroup = createAction('EXPLORE/toggleMapLayerGroup');
export const setMapLayerGroupVisibility = createAction('EXPLORE/setMapLayerGroupVisibility');
export const setMapLayerGroupOpacity = createAction('EXPLORE/setMapLayerGroupOpacity');
export const setMapLayerGroupActive = createAction('EXPLORE/setMapLayerGroupActive');
export const setMapLayerGroupsOrder = createAction('EXPLORE/setMapLayerGroupsOrder');

// INTERACTION
export const setMapLayerGroupsInteraction = createAction('EXPLORE/setMapLayerGroupsInteraction');
export const setMapLayerGroupsInteractionSelected = createAction('EXPLORE/setMapLayerGroupsInteractionSelected');
export const setMapLayerGroupsInteractionLatLng = createAction('EXPLORE/setMapLayerGroupsInteractionLatLng');
export const resetMapLayerGroupsInteraction = createAction('EXPLORE/resetMapLayerGroupsInteraction');


export const setMapLayerGroups = createAction('EXPLORE/setMapLayerGroups');
export const fetchMapLayerGroups = createThunkAction('EXPLORE/fetchMapLayers', payload => (dispatch, getState) => {
  const { common } = getState();

  const qParams = queryString.stringify({
    application: process.env.APPLICATIONS,
    language: common.locale,
    includes: 'layer',
    ids: payload.map(lg => lg.dataset).join(','),
    'page[size]': 999
  });

  return fetch(`${process.env.WRI_API_URL}/dataset?${qParams}`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then(response => WRISerializer(response, { locale: common.locale }))
    .then((data) => {
      dispatch(setMapLayerGroups({
        datasets: data,
        params: payload
      }));
    })
    .catch((err) => {
      console.error(err);
    });
});


// FILTERS
export const setFiltersOpen = createAction('EXPLORE/setFiltersOpen');
export const setFiltersTab = createAction('EXPLORE/setFiltersTab');
export const setFiltersSearch = createAction('EXPLORE/setFiltersSearch');
export const setFiltersSelected = createAction('EXPLORE/setFiltersSelected');
export const toggleFiltersSelected = createAction('EXPLORE/toggleFiltersSelected');
export const resetFiltersSelected = createAction('EXPLORE/resetFiltersSelected');

// SORT
export const setSortSelected = createAction('EXPLORE/setSortSelected');
export const setSortDirection = createAction('EXPLORE/setSortDirection');

// SIDEBAR
export const setSidebarOpen = createAction('EXPLORE/setSidebarOpen');
