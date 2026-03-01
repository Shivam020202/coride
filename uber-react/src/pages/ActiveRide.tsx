import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonAvatar,
  IonProgressBar,
  useIonToast,
} from "@ionic/react";
import {
  close,
  shieldCheckmark,
  shareSocial,
  callOutline,
  chatbubbleOutline,
  warningOutline,
} from "ionicons/icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "./ActiveRide.css";

// Component to handle map sizing issues and smooth panning
// Component to handle map sizing issues and smooth panning
const MapUpdater: React.FC<{ bounds: [number, number][] }> = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    // Fix map loading gray tiles issue on mount and fit bounds
    const timer = setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [50, 50] });
    }, 400);
    return () => clearTimeout(timer);
  }, [map, bounds]);

  return null;
};

// Waypoints tracing actual streets perfectly (5th Avenue NYC - a perfect straight line)
const waypoints: [number, number][] = [
  [40.748433, -73.985656], // 5th Ave & 34th St
  [40.735132, -73.993623], // 5th Ave & 14th St
];

const getBearing = (
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number,
) => {
  const rLat1 = startLat * (Math.PI / 180);
  const rLat2 = destLat * (Math.PI / 180);
  const dLon = (destLng - startLng) * (Math.PI / 180);
  const y = Math.sin(dLon) * Math.cos(rLat2);
  const x =
    Math.cos(rLat1) * Math.sin(rLat2) -
    Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLon);
  let brng = Math.atan2(y, x);
  return (brng * (180 / Math.PI) + 360) % 360;
};

// Helper to interpolate points for smooth realistic tracking
const generateSmoothRoute = (
  points: [number, number][],
  numSteps: number,
): { lat: number; lng: number; bearing: number }[] => {
  const result: { lat: number; lng: number; bearing: number }[] = [];
  let totalDistance = 0;

  const getDist = (p1: [number, number], p2: [number, number]) =>
    Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

  const segmentDistances: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dist = getDist(points[i], points[i + 1]);
    segmentDistances.push(dist);
    totalDistance += dist;
  }

  points.forEach((_, i) => {
    if (i === points.length - 1) return;
    const p1 = points[i];
    const p2 = points[i + 1];
    const segmentSteps = Math.max(
      2,
      Math.round((segmentDistances[i] / totalDistance) * numSteps),
    );
    const bearing = getBearing(p1[0], p1[1], p2[0], p2[1]);

    for (let j = 0; j < segmentSteps; j++) {
      const t = j / segmentSteps;
      const lat = p1[0] + (p2[0] - p1[0]) * t;
      const lng = p1[1] + (p2[1] - p1[1]) * t;
      result.push({ lat, lng, bearing });
    }
  });

  const lastPoint = points[points.length - 1];
  const lastBearing = result.length > 0 ? result[result.length - 1].bearing : 0;
  result.push({ lat: lastPoint[0], lng: lastPoint[1], bearing: lastBearing });
  return result;
};

// Generate 400 animation frames along the street path for a smooth ~40s drive
const routeData = generateSmoothRoute(waypoints, 400);

const ActiveRide: React.FC = () => {
  const [driverStatus, setDriverStatus] = useState("Driver is heading to you");
  const [eta, setEta] = useState("4 min");
  const [progress, setProgress] = useState(0);
  const [carPosIndex, setCarPosIndex] = useState(0);
  const history = useHistory();
  const [present] = useIonToast();

  useEffect(() => {
    // Demo Mode Simulation
    let count = 0;
    const maxTicks = routeData.length - 1;

    const interval = setInterval(() => {
      count += 1;
      const percent = count / maxTicks;

      setProgress(percent);
      setCarPosIndex(Math.min(count, maxTicks));

      if (percent < 0.3) {
        setEta("3 min");
      } else if (percent < 0.6) {
        setEta("2 min");
      } else if (percent < 0.9) {
        setEta("1 min");
        setDriverStatus("Driver is arriving");
      } else if (percent < 1.0) {
        setEta("Arriving now");
        setDriverStatus("Driver has arrived");
      } else {
        clearInterval(interval);
        // show final message safely
        present({
          message: "Your ride is here! Enjoy your trip.",
          duration: 4000,
          position: "top",
          color: "dark",
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, []); // Empty dependencies array strictly prevents the loop from resetting!

  const shareLocation = () => {
    present({
      message: "Location shared safely with trusted contacts.",
      duration: 2000,
      position: "bottom",
      icon: shareSocial,
      color: "primary",
    });
  };

  const emergencyCall = () => {
    present({
      message: "Connecting to emergency services...",
      duration: 3000,
      position: "bottom",
      icon: warningOutline,
      color: "danger",
    });
  };

  const currentPos = routeData[Math.floor(carPosIndex)];

  // Modern real car icon rotated to face travel direction using pure inline SVG
  const carIcon = L.divIcon({
    className: "custom-car-marker",
    html: `
      <div style="transform: rotate(${currentPos.bearing}deg); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <svg width="28" height="52" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.4))">
          <!-- Car Body -->
          <rect x="2" y="2" width="20" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
          <!-- Front Windshield -->
          <path d="M4 14C4 11 20 11 20 14L18 22H6L4 14Z" fill="#1e293b"/>
          <!-- Rear Windshield -->
          <path d="M6 34H18L16 38C16 40 8 40 6 38Z" fill="#1e293b"/>
          <!-- Roof details -->
           <rect x="5.5" y="22" width="13" height="12" rx="2" fill="#f8fafc"/>
        </svg>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

  // Destination Dot
  const destIcon = L.divIcon({
    className: "dest-marker",
    html: `<div style="background: #1e3a8a; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="ride-transparent-toolbar">
          <IonButtons slot="start">
            <IonButton
              className="back-btn-glass"
              onClick={() => history.replace("/tabs/home")}
            >
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ride-content-bg">
        <div className="ride-map-fullscreen">
          <MapContainer
            center={waypoints[Math.floor(waypoints.length / 2)]}
            zoom={16}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
            attributionControl={false}
          >
            {/* Clean, minimalist map style */}
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapUpdater bounds={waypoints} />

            <Polyline
              positions={routeData.map((p) => [p.lat, p.lng])}
              color="#1e3a8a"
              weight={5}
              opacity={0.9}
            />
            <Marker
              position={waypoints[waypoints.length - 1]}
              icon={destIcon}
            />

            {/* Moving Car */}
            <Marker
              position={[currentPos.lat, currentPos.lng]}
              icon={carIcon}
            />
          </MapContainer>
        </div>

        <div className="ride-bottom-sheet">
          <div className="sheet-pill"></div>

          <div className="ride-sheet-content">
            <div className="ride-header">
              <h2 className="ride-status-text">{driverStatus}</h2>
              <div className="ride-eta-box">
                <span className="ride-time">{eta}</span>
              </div>
            </div>

            <IonProgressBar
              value={progress}
              className="ride-progress-bar"
            ></IonProgressBar>

            <div className="driver-card">
              <div className="driver-hero">
                <div className="avatar-wrapper">
                  <IonAvatar className="driver-avatar-real">
                    <img
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"
                      alt="Driver"
                    />
                  </IonAvatar>
                  <div className="rating-pill">4.9 ★</div>
                </div>

                <div className="driver-meta">
                  <h3>John D.</h3>
                  <p>White Toyota Prius</p>
                  <div className="license-badge">ABC 123</div>
                </div>
              </div>

              <div className="car-image-mock">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80"
                  alt="car"
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                />
              </div>
            </div>

            <div className="ride-actions">
              <div className="action-circle">
                <IonButton fill="clear" className="circle-btn bg-soft">
                  <IonIcon icon={callOutline} color="dark" />
                </IonButton>
                <span>Call</span>
              </div>
              <div className="action-circle">
                <IonButton fill="clear" className="circle-btn bg-soft">
                  <IonIcon icon={chatbubbleOutline} color="dark" />
                </IonButton>
                <span>Message</span>
              </div>
              <div className="action-circle">
                <IonButton
                  fill="clear"
                  className="circle-btn bg-brand"
                  onClick={shareLocation}
                >
                  <IonIcon icon={shareSocial} color="light" />
                </IonButton>
                <span className="text-brand">Share</span>
              </div>
              <div className="action-circle">
                <IonButton
                  fill="clear"
                  className="circle-btn bg-danger-soft"
                  onClick={emergencyCall}
                >
                  <IonIcon icon={shieldCheckmark} color="danger" />
                </IonButton>
                <span className="text-red">Safety</span>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ActiveRide;
