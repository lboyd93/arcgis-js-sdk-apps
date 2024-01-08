require([
	"esri/core/reactiveUtils",
	"esri/views/MapView",
	"esri/WebMap",
	"esri/widgets/Legend",
	"esri/widgets/Expand",
], (reactiveUtils, MapView, WebMap, Legend, Expand) => {
	// Function to create a webmap from the URL parameters.
	function createWebmap() {
		let { id, portal, url } = getUrlParams();

		if (!url) {
			if (!id) {
				id = "ec5edbd9ddb54fecab0086030600b319";
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
		popup: {
			defaultPopupTemplateEnabled: true,
			autoCloseEnabled: true,
		},
		popupEnabled: false,
	});

	view.ui.add(new Expand({ content: new Legend({ view }) }), "bottom-left");

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

		// reactiveUtils.watch(
		// 	() => view.popup.visible,
		// 	(visible) => {
		// 		window.parent.postMessage(
		// 			{
		// 				type: "popup-close",
		// 				visible: visible,
		// 			},
		// 			"*"
		// 		);
		// 	}
		// );
	});
	const messageHandler = async (ev) => {
		switch (ev?.data?.type) {
			case "hit-location":
				const mapPoint = view.toMap(ev?.data?.screenPoint);
				view.openPopup({
					location: mapPoint,
					fetchFeatures: true,
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

	// //bind the window events
	// function bindEvent(element, eventName, eventHandler) {
	//   if (element.addEventListener) {
	//     element.addEventListener(eventName, eventHandler, false);
	//   } else if (element.attachEvent) {
	//     element.attachEvent('on' + eventName, eventHandler);
	//   }
	// }
});
