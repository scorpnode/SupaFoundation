<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" >
        <ion-title>Team</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
 
      
      <!-- <ExploreContainer name="Tab 2 page" /> -->
   
        <ion-button color="danger" @click="shareReferral" v-if="false">Invite others to boost your mining rate!</ion-button>
 <ion-card>
           <ion-card-header>
          <ion-card-title>Team Members </ion-card-title>
          <ion-card-subtitle>Total: {{groupInfo.length}}</ion-card-subtitle>
        </ion-card-header>
     <ion-card-content>
  <ion-list :key="timeNow">
        
        <ion-item v-for="teamMember in groupInfo" v-bind:key="teamMember.nick">
          <ion-avatar slot="start">
            <img :src="teamMember.photoURL.replace('_normal','')">
          </ion-avatar>
          <ion-label>
            <h2>{{teamMember.name}}</h2>
            <h3>@{{teamMember.nick}}  <span class="logged-in" v-if="teamMember.endTime>=timeNow">● Active</span>
          <span class="logged-out" v-if="teamMember.endTime<timeNow">● Inactive</span></h3>

            <p v-if="teamMember.endTime<timeNow">{{(((teamMember.balEnd === undefined) ? 0 : teamMember.balEnd)/1000).toFixed(3)}} sFuel</p>
            <p v-if="teamMember.endTime>=timeNow">    {{((((teamMember.balEnd-((teamMember.balStart === undefined) ? 0 : teamMember.balStart))*( (86400-(teamMember.endTime-timeNow)) / 86400))+((teamMember.balStart === undefined) ? 0 : teamMember.balStart))/1000).toFixed(3)}} sFuel
            </p>
          </ion-label>
         
        </ion-item>
       
        
          </ion-list>



     </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController,IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,IonHeader, IonList, IonAvatar,IonCardContent,IonToolbar, IonTitle, IonContent,IonButton,  IonItem, IonLabel } from '@ionic/vue';
//import ExploreContainer from '@/components/ExploreContainer.vue';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { computed,ref } from 'vue'
import { useStore } from 'vuex'

export default  {
  name: 'Tab2',
  components: {IonHeader, IonToolbar, IonTitle, IonContent,IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonPage,IonButton,  IonCardContent,IonItem, IonLabel,IonList, IonAvatar,  },
    data: () => ({
     timeNow:Math.round(new Date() / 1000),
  })
  ,setup(){
          const store=useStore();
  const referralCode=ref("http://app.supa.foundation/r/"+store.state.accounts.accountDetails.nick)
    const shareReferral= async()=>{
    await Share.share({
  title: 'See cool stuff',
  text: 'Really awesome thing you need to see right meow',
  url: 'http://ionicframework.com/',
  dialogTitle: 'Share with buddies',
});
  }

  const copyReferral= async () => {
  await Clipboard.write({
    string: "http://app.supa.foundation/r/"+store.state.accounts.accountDetails.nick
  });
        launchToast("Referral link copied to clipboard!","success")



};
   const launchToast= async(message,color)=>{
      
      const toast = await toastController
        .create({
          message: message,
          color: color,
          duration: 3000
        })
      return toast.present();
   
    };

    
return {
  shareReferral,
  copyReferral,
  referralCode,
   accountInfo: computed(() => store.getters["accounts/getAccountDetails"]),

}
  

  },
  computed:{
     groupInfo(){
    const groupArray= this.$store.getters["accounts/getGroupDetails"];
    return groupArray.sort((a, b) => parseFloat(b.endTime) - parseFloat(a.endTime))
    
    }
  },
 methods:{

   getTime() {
var self = this
     if (this.task) {
          clearInterval(this.task);
        }
       
         this.task = setInterval(() => {
          self.getTime();
        }, 1000);
      
    this.timeNow = Math.round(new Date() / 1000)


   } 
 },
  updated() {
 
this.getTime()

  }
}
</script>

<style scoped>
ion-input{
    --placeholder-color: red;
    --placeholder-opacity: 1;
}
.logged-in {
  color: green;
}

.logged-out {
  color: red;
}

</style>