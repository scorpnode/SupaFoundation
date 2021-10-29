<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" >
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
   <div class="center">
       <ion-card>
    <ion-card-header>
      <ion-card-title>About</ion-card-title>

    </ion-card-header>

    <ion-card-content>
    SupaFuel tokens will be redeemable for in-game utility at a later stage.
    </ion-card-content>
  </ion-card>
      <ion-card>
    <ion-card-header>
      <ion-card-title>Social Media</ion-card-title>
  <ion-button @click="redir(1)"> <ion-icon :icon="logoTwitter"></ion-icon>
Twitter</ion-button>
 <ion-button @click="redir(2)" >   <ion-icon :icon="logoDiscord"></ion-icon>
Discord</ion-button>
    </ion-card-header>
  <ion-card-content @click="copyReferral">
    ENCRYPTED CODE: NFYS2OBY (BASE32 ENCRYPTED)
    </ion-card-content>
    
  </ion-card>
<ion-button @click="logOut">
  <ion-icon :icon="logOutOutline"></ion-icon>
  LogOut
  </ion-button>
   </div>
      
     
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController,IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonButton,IonIcon,IonCardTitle,IonCardHeader,IonCardContent,IonCard } from '@ionic/vue';
import { logOutOutline,logoTwitter,logoDiscord } from 'ionicons/icons';
import {  signOut } from "firebase/auth";
import {fbauth} from '../main'
  import { copyText } from 'vue3-clipboard'

import { useRouter } from 'vue-router';

export default  {
  name: 'Tab3',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonIcon,IonButton,IonCardTitle,IonCardHeader,IonCardContent,IonCard  },
  setup(){
   const router = useRouter()
     const launchToast= async(message,color)=>{
      
      const toast = await toastController
        .create({
          message: message,
          color: color,
          duration: 3000
        })
      return toast.present();
   
    };
  const copyReferral= async () => {
   copyText( 'NFYS2OBY', undefined, (error, event) => {
          if (error) {
     
            console.log(error)
          } else {
        launchToast("Code copied","success")
            console.log(event)
          }
        })

  // await Clipboard.write({
  //   string: "http://app.supa.foundation/r/"+referralCode.value
  // });



};
    const logOut= ()=>{
      signOut(fbauth).then(() => {
    window.open("https://twitter.com/logout", '_blank');

      router.replace({ name: 'signIn'})
    }).catch((error) => {
     console.log(error)
    });
    }

    const redir=(num)=>{
      if(num==1){
            window.open("https://twitter.com/SupaFoundation", '_blank');


      }else{
            window.open("https://discord.com/invite/7zP4fs3U3N", '_blank');


      }

    }
    return{logOutOutline,logOut,logoTwitter,logoDiscord,redir,copyReferral}
  }
}
</script>
<style scoped>
.center {
    text-align: center;

  margin: auto;
 
}
</style>