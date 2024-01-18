require([
	"esri/core/reactiveUtils",
	"esri/views/MapView",
	"esri/WebMap",
	"esri/widgets/Legend",
	"esri/widgets/Expand",
], (reactiveUtils, MapView, WebMap, Legend, Expand) => {
	const hitTestInfo = document.getElementById("hittest-info");
	const hitTestFeaturesLabel = document.getElementById("features-returned");
	// Function to create a webmap from the URL parameters.
	function createWebmap() {
		let { id, portal, url } = getUrlParams();

		if (!url) {
			if (!id) {
				id = "53a2997d67984fc6bb60b62307012b34";
			}

			if (!portal) {
				portal = "https://www.arcgis.com/";
			}

			setUrlParams(id, portal);
			//esriConfig.portal = portal;
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
	const webmap = createWebmap();

	const view = new MapView({
		container: "viewDiv",
		map: webmap,
		zoom: 8,
		popup: {
			defaultPopupTemplateEnabled: true,
			autoCloseEnabled: true,
			dockEnabled: true,
			dockOptions: {
				position: "bottom-left",
				breakpoint: false,
			},
		},
		popupEnabled: false,
	});

	view.ui.add(hitTestInfo, "top-right");
	view.ui.add(new Expand({ content: new Legend({ view }) }), "bottom-left");
	const instructionsExpand = new Expand({
		expandIcon: "question",
		expandTooltip: "How to use this sample",
		view: view,
		expanded: false,
		content: `
<div style='width:200px; padding:10px; background-color:white'>Use the <b>URL parameters</b> to load a web map from <b>ArcGIS Online (production, devext, or qaext)</b> or <b>ArcGIS Enterprise</b>. 
<br>Include "https://" in the portal URL and if working with ArcGIS Enterprise, the web adaptor needs to be included in the URL.</div>
`,
	});
	view.ui.add(instructionsExpand, "top-left");

	//reactiveUtils.on(view, "click", (event) => {});

	view.when(() => {
		reactiveUtils.when(
			() => !view?.navigating,
			() => {
				let extent = {
					xmin: view.extent.xmin,
					xmax: view.extent.xmax,
					ymin: view.extent.ymin,
					ymax: view.extent.ymax,
					spatialReference: {
						wkid: view.extent.spatialReference.wkid,
					},
				};
				window.parent.postMessage(
					{
						type: "view-navigation",
						extent: extent,
					},
					"*"
				);
			}
		);

		view.on("click", (event) => {
			window.parent.postMessage(
				{
					type: "hit-location",
					screenPoint: { x: event.x, y: event.y },
				},
				"*"
			);
		});
	});
	const messageHandler = async (ev) => {
		switch (ev?.data?.type) {
			case "hit-location":
				const screenPoint = ev?.data?.screenPoint;
				const mapPoint = view.toMap(screenPoint);
				view.hitTest(screenPoint).then((response) => {
					const hits = response.results.filter(
						(hit) => hit.type === "graphic" && hit.layer.type === "feature"
					);
					let graphics = [];
					hits.forEach((hit) => {
						console.log(hit);
						graphics.push(hit.graphic);
					});
					hitTestFeaturesLabel.innerHTML = graphics.length;
				});
				view.openPopup({
					location: mapPoint,
					fetchFeatures: true,
					featureMenuOpen: true,
				});
				ev.stopPropagation();
				break;
			case "view-navigation":
				view.extent = ev?.data?.extent;
				// await view.goTo({
				// 	extent: ev?.data?.extent,
				// });
				ev.stopPropagation();
				break;
		}
	};

	window.parent.addEventListener("message", messageHandler);

	view.addHandles({
		remove: () => window.parent.removeEventListener("message", messageHandler),
	});

	// Get the URL parameters and parse them.
	function getUrlParams() {
		const queryParams = document.location.search.substr(1);
		let result = {};

		queryParams.split("&").forEach(function (part) {
			var item = part.split("=");
			result[item[0]] = decodeURIComponent(item[1]);
		});
		return result;
	}

	// Function to set an id as a URL param.
	function setUrlParams(id, portal) {
		window.history.pushState(
			"",
			"",
			`${window.location.pathname}?id=${id}&portal=${portal}`
		);
	}
});
