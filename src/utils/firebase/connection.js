import * as firebase from 'firebase';

const serverURL = 'https://us-central1-you-move-me.cloudfunctions.net/';
//const serverURL = 'http://localhost:5002/you-move-me/us-central1/';

const config = {
  apiKey: 'AIzaSyCvrZWf22Z4QGRDpL-qI3YlLGkP9-BIsrY',
  authDomain: 'you-move-me.firebaseapp.com',
  databaseURL: 'https://you-move-me.firebaseio.com',
  storageBucket: 'you-move-me.appspot.com',
};
firebase.initializeApp(config);

const auth = firebase.auth();

// this will return immediately if the user is already logged in
const loginAnonymously = (callback) => {
  auth.signInAnonymously()
    .then(() => {
      callback(null);
    })
    .catch((error) => {
      callback(error);
    });
};

// URL: endpoint of http function
// dataToSend: data object to send in the request body
const contactServer = (URL, dataToSend) => {
  const promise = new Promise((resolve, reject) => {
    loginAnonymously((error) => {
      if (error) throw error;

      const secret = localStorage ? localStorage.getItem('secret') : '';
      const request = new XMLHttpRequest();
      request.open('PUT', URL, true);
      request.setRequestHeader('Authorization', `Bearer ${secret}`);

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          resolve(JSON.parse(request.responseText));
        } else {
          console.log(request.responseText);
          // problem reaching server
          resolve({ success: false, error: 'error connecting to server' });
        }
      };

      request.onerror = (err) => {
        reject(err);
      };

      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify(dataToSend));
    });
  });

  return promise;
};

const firebaseConnection = {
  firebase,
  contactServer,
  serverURL, 
};

export default firebaseConnection;
