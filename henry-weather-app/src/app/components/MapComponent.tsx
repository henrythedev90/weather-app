"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapComponentProps {
  latitude: number;
  longitude: number;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;

    // Initialize map only once
    if (map.current) return;

    if (mapContainer.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [longitude, latitude],
        zoom: 11,
        scrollZoom: false, // Disable scroll zoom
        dragRotate: false, // Disable rotation
        touchZoomRotate: false, // Disable touch zoom and rotate
        doubleClickZoom: false, // Disable double click zoom
        boxZoom: false, // Disable box zoom
        keyboard: false, // Disable keyboard navigation
      });

      // Remove Navigation Controls section since we've disabled all interactions
    }
  }, [latitude, longitude, MAPBOX_TOKEN]);

  // Update map when coordinates change
  useEffect(() => {
    if (map.current && latitude && longitude) {
      map.current.flyTo({
        center: [longitude, latitude],
        essential: true,
      });

      // Clear existing markers
      const markers = document.getElementsByClassName("mapboxgl-marker");
      while (markers[0]) {
        markers[0].remove();
      }

      // Add marker
      new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map.current);
    }
  }, [latitude, longitude]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-4">
        <p className="text-red-500">
          Mapbox token is missing. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in
          your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-lg"
      style={{ touchAction: "none" }}
    />
  );
};

export default MapComponent;
