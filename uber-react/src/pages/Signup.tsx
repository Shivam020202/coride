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

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSignup = (e: React.FormEvent) => {
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
            <p>Join the community and start riding.</p>
          </div>

          <form onSubmit={handleSignup} className="auth-form">
            <IonItem className="auth-input-item" lines="none">
              <IonLabel position="floating">Full Name</IonLabel>
              <IonInput
                type="text"
                value={name}
                onIonChange={(e) => setName(e.detail.value!)}
                required
              />
            </IonItem>

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
              Create Account
            </IonButton>
          </form>

          <div className="auth-footer">
            <IonText>Already have an account? </IonText>
            <IonButton
              fill="clear"
              onClick={() => history.push("/login")}
              className="link-button"
            >
              Sign In
            </IonButton>
          </div>
        </div>
        <IonLoading
          isOpen={loading}
          message={"Creating Account..."}
          spinner="crescent"
          mode="ios"
        />
      </IonContent>
    </IonPage>
  );
};

export default Signup;
