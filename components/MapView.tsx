// components/MapView.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapReport {
  id: string;
  title: string;
  category: string;
  county: string;
  locality: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  reports: MapReport[];
  selectedReportId?: string | null;
}

export default function MapView({ reports, selectedReportId }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Fix Iconițe Leaflet
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      L.Marker.prototype.options.icon = defaultIcon;

      const map = L.map(mapContainerRef.current).setView([45.9432, 24.9668], 6); // Centrat pe România

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Curățăm markerii vechi
    Object.values(markersRef.current).forEach((marker) => map.removeLayer(marker));
    markersRef.current = {};

    // Adăugăm markerii noi
    reports.forEach((report) => {
      if (report.lat && report.lng) {
        const marker = L.marker([report.lat, report.lng]).addTo(map);

        // HTML-ul pentru Popup la click pe pin
        const popupContent = `
          <div style="color: #09090b; font-family: sans-serif; min-width: 140px; padding: 2px;">
            <b style="font-size: 12px; display: block; margin-bottom: 2px;">${report.title}</b>
            <span style="font-size: 10px; color: #2563eb; font-weight: 600;">📍 ${report.locality}, Jud. ${report.county}</span>
            <div style="font-size: 10px; color: #71717a; margin-top: 2px;">${report.category}</div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current[report.id] = marker;
      }
    });
  }, [reports]);

  // Mută harta la cardul selectat din listă
  useEffect(() => {
    if (selectedReportId && mapInstanceRef.current && markersRef.current[selectedReportId]) {
      const selectedReport = reports.find((r) => r.id === selectedReportId);
      if (selectedReport) {
        mapInstanceRef.current.flyTo([selectedReport.lat, selectedReport.lng], 13, { duration: 1.5 });
        markersRef.current[selectedReportId].openPopup();
      }
    }
  }, [selectedReportId, reports]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-64 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg z-0"
    />
  );
}