import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonButton,
} from "@ionic/react";
import { time, personCircle } from "ionicons/icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "./Home.css";

// Fix for default marker icon in react-leaflet
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to handle map sizing issues and smooth panning
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    // Fix map loading gray tiles issue
    setTimeout(() => {
      map.invalidateSize();
      map.panTo(center);
    }, 400);
  }, [map, center]);
  return null;
};

const Home: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [showRideOptions, setShowRideOptions] = useState(false);
  const history = useHistory();

  // Coordinates for a mockup city center
  const center: [number, number] = [40.7128, -74.006];

  const handleSearch = (e: any) => {
    setSearchText(e.detail.value);
    if (e.detail.value && e.detail.value.length > 2) {
      setShowRideOptions(true);
    } else {
      setShowRideOptions(false);
    }
  };

  const bookRide = () => {
    history.push("/active-ride");
  };

  return (
    <IonPage id="main-content">
      <IonHeader className="ion-no-border">
        <IonToolbar className="home-toolbar">
          <div className="toolbar-content">
            <h1 className="brand-logo-small">CoRide.</h1>
            <IonAvatar
              className="profile-btn-small"
              onClick={() => history.push("/tabs/profile")}
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                alt="Profile"
              />
            </IonAvatar>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        <div className="map-wrapper">
          <MapContainer
            center={center}
            zoom={14}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater center={center} />
            <Marker position={center} icon={customIcon} />
            <ZoomControl position="topright" />
          </MapContainer>
          <div className="top-gradient-overlay" />
        </div>

        <div className={`bottom-sheet ${showRideOptions ? "expanded" : ""}`}>
          {!showRideOptions ? (
            <div className="search-container">
              <h2 className="greeting">Good afternoon, Charlie</h2>
              <IonSearchbar
                placeholder="Where to?"
                className="premium-search"
                value={searchText}
                onIonChange={handleSearch}
                mode="ios"
              />

              <div className="recent-places">
                <IonItem lines="none" detail={false} className="recent-item">
                  <div slot="start" className="icon-bg bg-blue-light">
                    <IonIcon icon={time} className="text-brand" />
                  </div>
                  <IonLabel>
                    <h3>Home</h3>
                    <p>123 Main Street, Apt 4B</p>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none" detail={false} className="recent-item">
                  <div slot="start" className="icon-bg bg-blue-light">
                    <IonIcon icon={time} className="text-brand" />
                  </div>
                  <IonLabel>
                    <h3>Work</h3>
                    <p>456 Tech Park, Building A</p>
                  </IonLabel>
                </IonItem>
              </div>
            </div>
          ) : (
            <div className="ride-options-container">
              <div className="drag-handle"></div>
              <h3 className="options-title">Choose a ride</h3>

              <IonList className="ride-list">
                <IonItem
                  lines="none"
                  className="ride-item selected"
                  onClick={bookRide}
                >
                  <img
                    slot="start"
                    src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a1c97/original/UberX_Transparent.png"
                    className="car-icon"
                    alt="CoRide X"
                  />
                  <IonLabel className="ride-label">
                    <h2>CoRide X</h2>
                    <p className="eta-text">10:24 AM • 4 mins away</p>
                  </IonLabel>
                  <div slot="end" className="price-info">
                    <h3>$12.50</h3>
                  </div>
                </IonItem>

                <IonItem lines="none" className="ride-item" onClick={bookRide}>
                  <img
                    slot="start"
                    src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1555367538/assets/31/ad21b7-595c-42e8-ac53-53966b4a5fee/original/Black_v1.png"
                    className="car-icon"
                    alt="CoRide Premium"
                  />
                  <IonLabel className="ride-label">
                    <h2>Premium</h2>
                    <p className="eta-text">10:27 AM • 7 mins away</p>
                  </IonLabel>
                  <div slot="end" className="price-info">
                    <h3>$28.00</h3>
                  </div>
                </IonItem>
              </IonList>

              <div className="book-btn-wrapper">
                <IonButton
                  expand="block"
                  className="book-btn"
                  onClick={bookRide}
                >
                  Confirm CoRide X
                </IonButton>
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
