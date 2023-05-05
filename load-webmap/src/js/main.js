require([
	"esri/views/MapView",
	"esri/WebMap",
	"esri/widgets/Legend",
	"esri/widgets/Expand",
], (MapView, WebMap, Legend, Expand) => {
	(async () => {
		let portalItemUrl = "";
		// Function to get the URL parameters and parse them.
		function getUrlParams() {
			const queryParams = document.location.search.substr(1);
			console.log(queryParams);
			let result = {};

			queryParams.split("&").forEach(function (part) {
				var item = part.split("=");
				result[item[0]] = decodeURIComponent(item[1]);
				console.log(item);
			});
			return result;
		}

		// Function to set an id as a url param.
		function setUrlParams(id, portal) {
			window.history.pushState(
				"",
				"",
				`${window.location.pathname}?id=${id}&portal=${portal}`
			);
		}

		// Function to create the webmap with the portal and id from the URL params.
		async function createWebmap() {
			let { id, portal, url } = getUrlParams();

			if (!url) {
				if (!id) {
					id = "b1a5388025c34e83b7fe8095eedb86cb";
				}

				if (!portal) {
					portal = "https://www.arcgis.com/";
				}

				setUrlParams(id, portal);
			} else {
				portal = null;
				id = null;
			}
			return new WebMap({
				portalItem: {
					id: id,
					portal: portal,
				},
			});
		}

		const webmap = await createWebmap();

		// Set up the View with the WebMap and dock the popup.
		const view = new MapView({
			map: webmap,
			container: "viewDiv",
			popup: {
				dockEnabled: true,
				dockOptions: {
					position: "top-right",
					breakpoint: false,
				},
			},
		});
		view.when(() => {
			// Add a Legend
			view.ui.add(
				new Expand({ view, content: new Legend({ view }) }),
				"bottom-left"
			);
			// Add instructions.
			const instructionsExpand = new Expand({
				expandIcon: "question",
				expandTooltip: "How to use this sample",
				view: view,
				expanded: true,
				content: `
<div style='width:200px; padding:10px; background-color:white'>Use the url parameters to load a webamp from ArcGIS Online (production, devext, or qaext) or ArcGIS Enterprise. Be sure to fill out the portal URL with "https://" in front.</div>
`,
			});
			view.ui.add(instructionsExpand, "top-left");
		});
	})();
});
