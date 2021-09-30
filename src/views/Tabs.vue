<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon :icon="people" />
          <ion-label>Team</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon :icon="cog"  />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script >
import { toastController,IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { home,people,cog } from 'ionicons/icons';
 import {fbauth} from '../main'
 import {useStore} from 'vuex'

export default {
  name: 'Tabs',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
        const store = useStore()
     const launchToast= async(message,color)=>{
   

      const toast = await toastController
        .create({
          message: message,
          color: color,
          duration: 3000
        })
      return toast.present();
   
    };
   const refreshInfo =()=>  {
    fbauth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      let formData = new FormData();
formData.append('token', idToken);
fetch('https://api.supa.foundation/refreshuser', {
  method: "POST",
  body: formData,
 
})
.then(response => response.json()) 
.then(json => {
  if (json.userinfo.length==0){
          launchToast("An error occurred refreshing data.","danger")

  }else{
    store.commit("accounts/saveAccountDetails",json.userinfo[0])
    store.commit("accounts/saveGroupInfo",json.group)

      
  }
  
 
})
.catch(err => console.log(err));


      }).catch(function(error) {
  // Handle error
  console.log(error)
    
});



   }
   const refreshNews= async()=> {
    let response = await fetch('https://app.supa.foundation/news.json');

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let data = await response.json();
   
       store.commit("accounts/saveNewsDetails",data.news)
        // handle data
    }

}
  
   refreshInfo()
   refreshNews()
    return {
   home, people,cog

    }
  },
  created(){
     this.$store.dispatch("accounts/initAccountDetails");

  },
}
</script>