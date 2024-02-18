import React, { useEffect, useRef } from "react";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";

import "ol/ol.css";
import "./Map.scss";
import { useGeographic } from "ol/proj";

const MapView = (props) => {
  const mapRef = useRef();
  useGeographic();
  const map = new Map({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [props.center.lon, props.center.lat],
      zoom: props.zoom,
    }),
  });
  useEffect(() => {
    map.setTarget(mapRef.current);
  });
  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};
export default MapView;
