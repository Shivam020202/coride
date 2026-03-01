import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  mapOutline,
  timeOutline,
  personOutline,
  cardOutline,
} from "ionicons/icons";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import RideHistory from "./pages/RideHistory";
import ActiveRide from "./pages/ActiveRide";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./index.css";

setupIonicReact();

const MainTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/tabs/home" component={Home} />
      <Route exact path="/tabs/history" component={RideHistory} />
      <Route exact path="/tabs/wallet" component={Wallet} />
      <Route exact path="/tabs/profile" component={Profile} />
      <Route exact path="/tabs">
        <Redirect to="/tabs/home" />
      </Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom" className="premium-tab-bar">
      <IonTabButton tab="home" href="/tabs/home">
        <IonIcon icon={mapOutline} />
        <IonLabel>Ride</IonLabel>
      </IonTabButton>
      <IonTabButton tab="history" href="/tabs/history">
        <IonIcon icon={timeOutline} />
        <IonLabel>Activity</IonLabel>
      </IonTabButton>
      <IonTabButton tab="wallet" href="/tabs/wallet">
        <IonIcon icon={cardOutline} />
        <IonLabel>Wallet</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/tabs/profile">
        <IonIcon icon={personOutline} />
        <IonLabel>Account</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route path="/tabs" component={MainTabs} />
        <Route exact path="/active-ride" component={ActiveRide} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
