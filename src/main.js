import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {createStore} from 'vuex';
import {accountsModule} from "./store/accounts";

const firebaseConfig = {
  apiKey: "AIzaSyCs4dk1dVJfH0gbJ3BUwRfIYhbu9_mValo",
  authDomain: "supafoundation-74914.firebaseapp.com",
  projectId: "supafoundation-74914",
  storageBucket: "supafoundation-74914.appspot.com",
  messagingSenderId: "523642389183",
  appId: "1:523642389183:web:bb1f65124dc166fad27c0a",
  measurementId: "G-XCB141P6CN"
};
import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import './registerServiceWorker'
const firebaseApp =initializeApp(firebaseConfig);
const fbauth = getAuth(firebaseApp);
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(fbauth, user => {
          unsubscribe();
          resolve(user);
      }, reject);
  })
};
// const fbUser = async() => {
//   return await getCurrentUser()
// };




const store = createStore({
    modules: {
     accounts:accountsModule,
    
    }

});


const app = createApp(App)
.use(IonicVue, {
  rippleEffect: false,
  mode: 'md'
})
  .use(store)
  .use(router);
export { fbauth,getCurrentUser}
router.isReady().then(() => {
  app.mount('#app');
});
