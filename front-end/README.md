# 👨‍💻 Official Frontend for the Aesthetics API

- The frontend is structured as followed:
  - In the layoutComponents folder you can find the layout of the site
  - Within the layouts several components are placed
  - Some components have subcomponents if needed
  - Firebase is used for managing login credentials
  - Within the utils folder you find a Reducer and Store for exchanging data globally

- To run the frontend, API credentials of a firebase projects are needed for the authentication
- You can download the config file from `https://firebase.google.com/`
- You need to create a webapp and the config file will be available in the settings
- Save the config file with the name `firebaseConfig.js` within your src folder
- The file should look like:
```javascript
export const firebaseConfig = {
    apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "appName.firebaseapp.com",
    projectId: "projectId",
    storageBucket: "projectId.appspot.com",
    messagingSenderId: "986342195848",
    appId: "x:xxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxx"
};
```

- Run `yarn start` to start the front-end application
- If you haven't installed the dependencies it won't work, run `npm install or yarn install`


- Happy hacking 🤖🖤