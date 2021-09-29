<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" >
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
   
      
     <ion-button @click="logOut">
  <ion-icon :icon="logOutOutline"></ion-icon>
  LogOut
  </ion-button>
    </ion-content>
  </ion-page>
</template>

<script >
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonButton,IonIcon } from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import {  signOut } from "firebase/auth";
import {fbauth} from '../main'
import { useRouter } from 'vue-router';

export default  {
  name: 'Tab3',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonIcon,IonButton },
  setup(){
   const router = useRouter()

    const logOut= ()=>{
      signOut(fbauth).then(() => {
    window.open("https://twitter.com/logout", '_blank');

      router.replace({ name: 'signIn'})
    }).catch((error) => {
     console.log(error)
    });
    }
    return{logOutOutline,logOut}
  }
}
</script>