import React from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { star, locationOutline } from "ionicons/icons";
import "./RideHistory.css";

const RideHistory: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="premium-header-bg">
          <IonTitle className="premium-title">Activity</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="history-bg">
        <div className="section-title">Past trips</div>

        <IonList lines="none" className="history-list">
          <IonItem button detail={false} className="history-item">
            <div className="history-icon-box bg-blue-light" slot="start">
              <IonIcon icon={locationOutline} className="text-brand" />
            </div>
            <IonLabel>
              <h2>795 Folsom Street</h2>
              <p>Jun 15 • 10:24 AM</p>
              <h3 className="car-type">CoRide X</h3>
            </IonLabel>
            <div className="price-details" slot="end">
              <h2>$12.50</h2>
              <div className="rating">
                <span>5</span> <IonIcon icon={star} />
              </div>
            </div>
          </IonItem>

          <IonItem button detail={false} className="history-item">
            <div className="history-icon-box bg-gray" slot="start">
              <IonIcon icon={locationOutline} />
            </div>
            <IonLabel>
              <h2>San Francisco Int. Airport</h2>
              <p>Jun 10 • 08:15 AM</p>
              <h3 className="car-type">Premium</h3>
            </IonLabel>
            <div className="price-details" slot="end">
              <h2>$45.00</h2>
              <div className="rating">
                <span>5</span> <IonIcon icon={star} />
              </div>
            </div>
          </IonItem>

          <IonItem button detail={false} className="history-item">
            <div className="history-icon-box bg-gray" slot="start">
              <IonIcon icon={locationOutline} />
            </div>
            <IonLabel>
              <h2>Golden Gate Park</h2>
              <p>Jun 05 • 03:40 PM</p>
              <h3 className="car-type">CoRide X</h3>
            </IonLabel>
            <div className="price-details" slot="end">
              <h2>$18.20</h2>
              <div className="rating">
                <span>4</span> <IonIcon icon={star} />
              </div>
            </div>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default RideHistory;
