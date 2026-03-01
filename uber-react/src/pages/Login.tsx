import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonItem,
  IonLabel,
  IonLoading,
} from "@ionic/react";
import "./Auth.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      history.push("/tabs/home");
    }, 1500);
  };

  return (
    <IonPage>
      <IonContent className="auth-content">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="brand-logo">CoRide.</h1>
            <p>Welcome back, enter your details to log in.</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <IonItem className="auth-input-item" lines="none">
              <IonLabel position="floating">Email Address</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem className="auth-input-item" lines="none">
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                required
              />
            </IonItem>

            <IonButton expand="block" type="submit" className="auth-button">
              Sign In
            </IonButton>
          </form>

          <div className="auth-footer">
            <IonText>Don't have an account? </IonText>
            <IonButton
              fill="clear"
              onClick={() => history.push("/signup")}
              className="link-button"
            >
              Create Account
            </IonButton>
          </div>
        </div>
        <IonLoading
          isOpen={loading}
          message={"Authenticating..."}
          spinner="crescent"
          mode="ios"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
