import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

import {
  API_KEY,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
} from '@env';

const config = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
  firebase.firestore().settings({experimentalForceLongPolling: true});
}

export {firebase};
