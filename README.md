# ArcGIS Maps SDK for JavaScript Test Apps

This repository contains simple applications created to easily test ArcGIS Maps SDK for JavaScript functionality.

### Load Webmap

The [load-webmap application](https://lboyd93.github.io/arcgis-js-sdk-apps/load-webmap.html) allows you to load a web map from a specified portal based on the URL parameters. 
For example,the following URL will load the webmap with ID `b1a5388025c34e83b7fe8095eedb86cb` from `https://www.arcgis.com`:
https://lboyd93.github.io/arcgis-js-sdk-apps/load-webmap.html?id=b1a5388025c34e83b7fe8095eedb86cb&portal=https://www.arcgis.com/

### Custom chart colors

The [custom-chart-colors](https://lboyd93.github.io/arcgis-js-sdk-apps/custom-chart-colors.html) application loads a web map via item ID from a portal based on the URL parameters. The web map needs to have pre-configured charts in the popup so that you can customize the colors for the configured fields.

Example of how to specify a webmap and a portal:
https://lboyd93.github.io/arcgis-js-sdk-apps/custom-chart-colors.html?id=b1a5388025c34e83b7fe8095eedb86cb&portal=https://www.arcgis.com/

### Popup features order

The [popup-feature-order](https://lboyd93.github.io/arcgis-js-sdk-apps/popup-feature-order.html) application loads a web map from a specified portal based on the URL parameters. By default, it loads a [web map](https://jsapi.maps.arcgis.com/home/item.html?id=ec5edbd9ddb54fecab0086030600b319) with multiple layers configured for testing the order the features display in the popup.

Example of how to specify a webmap and a portal:
https://lboyd93.github.io/arcgis-js-sdk-apps/popup-feature-order.html?id=ec5edbd9ddb54fecab0086030600b319&portal=https://www.arcgis.com/

### Compare Popup same location

The [compare-popup-same-location](https://lboyd93.github.io/arcgis-js-sdk-apps/compare-popup-same-location/index.html) application loads a web map from a specified portal based on the URL parameters for two different versions of the API. By default, it loads a [web map](https://jsapi.maps.arcgis.com/home/item.html?id=ec5edbd9ddb54fecab0086030600b319) with multiple layers configured for testing the order the features display in the popup.

Example of how to specify a webmap and portal:
https://lboyd93.github.io/arcgis-js-sdk-apps/compare-popup-same-location/index.html?id=ec5edbd9ddb54fecab0086030600b319&portal=https://www.arcgis.com/