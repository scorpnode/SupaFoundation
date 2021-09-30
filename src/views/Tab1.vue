<template>
  <ion-page>
    <ion-header >
      <ion-toolbar color="primary" >
        <ion-title>Home</ion-title>
          <ion-buttons slot="end" v-if="deferredPrompt" ><ion-button color="warning" @click="install">Install App to HomeScreen</ion-button>
    </ion-buttons>
      </ion-toolbar>
    
    </ion-header>
    <ion-content :fullscreen="true">
            
     <ion-refresher slot="fixed" @ionRefresh="refreshData($event)">
     <ion-refresher-content >
    </ion-refresher-content></ion-refresher>
            
       <div class="miner">
    <ve-progress 
  :progress="progress"

  color="#7579ff"
  empty-color="transparent"
  :empty-color-fill="emptyColorFill"                      
  :size="180"
  :thickness="10"
  empty-thickness="5%"
  line-mode="in-over"
  line-position="out 10"
  :hide-legend="false"
  legend-class="legend-custom-style"
  dash="60 0.8"
  animation="loop 1000 100"
  :noData="false"           
  font-color="white"
  font-size="1.5rem">
  
   <span v-if="!showCounter" slot="legend-caption" >
        <ion-button color="primary" @click="goMine">START FARMING!</ion-button>
        <p> <span>{{ balEnd }} sFuel</span></p>

    
      </span>
         <span v-if="showCounter" slot="legend-caption" >
   <p>
        <span>{{ counterString }}</span></p>
        <p> <span>{{ currentBal }} sFuel</span></p>
                <p> <span>{{ currentRate }} sFuel/hr</span></p>

      </span>
  
</ve-progress>
</div>
<div class="bg">
</div>
<div class="circular-square" v-if="accountInfo">
<img  :src="accountInfo.photoURL.replace('_normal','')" />
</div>
<div class="user-profile">
<ion-card>
      
        <ion-card-header v-if="accountInfo">
          <ion-card-title>{{accountInfo.name}}</ion-card-title>
           <ion-card-subtitle>@{{accountInfo.nick}}</ion-card-subtitle>

        </ion-card-header>
      
      </ion-card>
      <ion-item  @click="copyReferral">
         
          <ion-label>
            <h2>Refer others to boost mining!</h2>
            <ion-text color="danger">

            <h3>Referral ID: {{accountInfo.nick}} </h3>
            </ion-text>
        
          </ion-label>
         <ion-button color="primary" slot="end" fill="outline">Copy Link</ion-button>
        </ion-item>
 
   
      </div>
     <ion-card-header v-if="newsInfo">
          <ion-card-title>News and Announcements</ion-card-title>        </ion-card-header>
     <ion-card-content v-if="newsInfo">
  <ion-list>
        
        <ion-item v-for="news in newsInfo" v-bind:key="news.timestamp" @click="openLink(news.link)">
          <ion-thumbnail slot="start">
            <img :src="news.photoURL">
          </ion-thumbnail>
          <ion-label>
            <h2>{{news.title}}</h2>
            <h3>{{news.subtitle}} </h3>
            <p>{{news.summary.slice(0, 64)}}...</p>

        
          </ion-label>
         
        </ion-item>
       
        
          </ion-list>



     </ion-card-content>        
           
     <div id="container">


     </div>
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController, modalController, IonPage,IonList, IonButtons, IonText,IonCardContent,IonThumbnail, IonItem, IonLabel, IonRefresher,IonRefresherContent, IonHeader, IonToolbar, IonTitle, IonContent,IonButton,IonCardHeader,IonCardSubtitle,IonCardTitle,IonCard } from '@ionic/vue';
import { computed,ref,  onUpdated} from 'vue'
import { useStore } from 'vuex'
import { VeProgress } from "vue-ellipse-progress";
import Interval from "@/interval";
import * as dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'
 import {fbauth} from '../main'
  import { copyText } from 'vue3-clipboard'
import ModalPrompt from './ModalPrompt.vue'
dayjs.extend(duration)

export default  {
  name: 'Tab1',
  components: { IonHeader, IonToolbar, IonButtons,IonList, IonText,IonCardContent,IonThumbnail,IonItem,IonLabel, IonRefresher,IonRefresherContent,IonTitle,IonContent, IonPage,VeProgress,IonButton,IonCardHeader,IonCardSubtitle,IonCardTitle,IonCard },
    data: () => ({
    sec: 0,
    min: 0,
    hour:0,
  timeNow:Math.round(new Date() / 1000),
      deferredPrompt: null,
    emptyColor: {
      radial: false,
      colors: [
        {
          color: "#8ec5fc",
          offset: "0",
          opacity: "1",
        },
        {
          color: "#e0c3fc",
          offset: "100",
          opacity: "1",
        },
      ],
    },
    emptyColorFill: {
         radial: true,
      colors: [
        {
          color: "#754fc1",
          offset: "0",
          opacity: "0.3",
        },
        {
          color: "#366bfc",
          offset: "100",
          opacity: "0.3",
        },
      ],
    },
  }),
  computed: {
   hourPrefix() {
      return this.hour < 10 ? "0" : "";
    },
    minPrefix() {
      return this.min < 10 ? "0" : "";
    },
    secPrefix() {
      return this.sec < 10 ? "0" : "";
    },
    getEndTime(){
      return this.$store.state.accounts.accountDetails
    },  
    groupInfo(){
    const groupArray= this.$store.getters["accounts/getGroupDetails"];
    return groupArray.sort((a, b) => parseFloat(b.endTime) - parseFloat(a.endTime))
    
    },
     newsInfo(){
    const groupArray= this.$store.getters["accounts/getNewsDetails"];
    if(groupArray){
  return groupArray.sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp))
    }
    return groupArray
    }
             

  
  },
   methods: {
       async openModal() {
      const modal = await modalController
        .create({
          component: ModalPrompt,
        
        })
      return modal.present();
    },
  runTimer() {
       // console.log(dayjs.duration(this.secondsRemaining*1000).format('HH:mm:ss'))
        if(this.secondsRemaining<=0){
         Interval.stop()
         this.secondsRemaining=0
         this.showCounter=false
          return
        }
      this.secondsRemaining--;
  this.counterString=dayjs.duration(this.secondsRemaining*1000).format('HH:mm:ss')
this.timeNow=Math.round(new Date() / 1000)

      this.progress = (86400-this.secondsRemaining)*100 / 86400;
    },
       async dismiss() {
      this.deferredPrompt = null;
    },
    async install() {
      this.deferredPrompt.prompt();
    },
    needsToSeePrompt() {
  // we pass in the result of our query-param to this method
  if (navigator.standalone) {
    return false;
  }
 console.log(navigator.platform)
  
  let isApple = ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
  return isApple;
},
  },

  mounted() {
  // console.log(this.$store.state.accounts.accountDetails)
  if(localStorage.getItem('installPrompt') <=Math.round(new Date() / 1000) && this.needsToSeePrompt()==true){
  this.openModal()

  }

  },
  setup(){

 const store = useStore()
       const referralCode=ref("https://app.supa.foundation/r/"+store.state.accounts.accountDetails.nick)
let balEnd = ref((store.state.accounts.accountDetails.balEnd === undefined) ? 0 : store.state.accounts.accountDetails.balEnd);
  let balStart = ref((store.state.accounts.accountDetails.balStart === undefined) ? 0 : store.state.accounts.accountDetails.balStart);
  const copyReferral= async () => {
   copyText( referralCode.value, undefined, (error, event) => {
          if (error) {
     
            console.log(error)
          } else {
        launchToast("Referral link copied to clipboard!","success")
            console.log(event)
          }
        })

  // await Clipboard.write({
  //   string: "http://app.supa.foundation/r/"+referralCode.value
  // });



};
const progress=ref(0)
    const currentBal=ref(0);
    const counterString=ref("")
      const secondsRemaining=ref(0)
     const showCounter=ref(false)
    const currentRate=ref(0)
     const refreshNews= async()=> {
    let response = await fetch('https://supa.foundation/news.json');



    if (response.status === 200) {
        let data = await response.json();
   
       store.commit("accounts/saveNewsDetails",data.news)

        // handle data
    }

}
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
    
              launchToast("Data Refreshed!","success")

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
   const refreshData=(event)=>{
     refreshNews()
     refreshInfo()
   if (event){
          event.target.complete();


   }

   }
   const updateDisplaySetup=(balStart,balEnd,endTime)=>{
 
   const timestamp = Math.round(new Date() / 1000);
   const diff=parseInt(endTime, 10)-timestamp

      if(diff>0){
        currentBal.value=((((balEnd-balStart)*( (86400-diff) / 86400))+balStart)/1000).toFixed(3);
        counterString.value=dayjs.duration(diff*1000).format('HH:mm:ss')
        secondsRemaining.value=diff;
        showCounter.value=true
        currentRate.value=((balEnd-(currentBal.value*1000))/(secondsRemaining.value/3600)/1000).toFixed(1)
       
        Interval.addTask(runTimerSetup);
        Interval.run()
      } else{
      counterString.value=dayjs.duration(0*1000).format('HH:mm:ss')
         secondsRemaining.value=0
        currentBal.value=(balEnd/1000).toFixed(3);
        showCounter.value=false
        Interval.stop()
      }
   } 
  const runTimerSetup=()=>{

       // console.log(dayjs.duration(this.secondsRemaining*1000).format('HH:mm:ss'))
        if(secondsRemaining.value<=0){
         Interval.stop()
         secondsRemaining.value=0
         showCounter.value=false
          return
        }
      secondsRemaining.value--;
      counterString.value=dayjs.duration(secondsRemaining.value*1000).format('HH:mm:ss')
      currentBal.value=((((balEnd.value-balStart.value)*( (86400-secondsRemaining.value) / 86400))+balStart.value)/1000).toFixed(3);
      currentRate.value=((balEnd.value-(currentBal.value*1000))/(secondsRemaining.value/3600)/1000).toFixed(1)
      progress.value = (86400-secondsRemaining.value)*100 / 86400;
    
   }
  onUpdated(() => {
    Interval.stop()
    Interval.clearTask();
 balEnd.value = (store.state.accounts.accountDetails.balEnd === undefined) ? 0 : store.state.accounts.accountDetails.balEnd;
   balStart.value = (store.state.accounts.accountDetails.balStart === undefined) ? 0 : store.state.accounts.accountDetails.balStart;
//console.log(store.state.accounts.accountDetails)
updateDisplaySetup(balStart,balEnd,store.state.accounts.accountDetails.endTime)
    })


  const launchToast= async(message,color)=>{
      
      const toast = await toastController
        .create({
          message: message,
          color: color,
          duration: 3000
        })
      return toast.present();
   
    };
     const openLink=(link)=>{

     window.open(link, '_blank');
   }
 const goMine=()=>{

fbauth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
  // Send token to your backend via HTTPS
  // ...
     let formData = new FormData();
formData.append('token', idToken);
fetch('https://api.supa.foundation/mine', {
  method: "POST",
  body: formData,
 
})
.then(response => response.json()) 
.then(json => {
  if (json.error==true){
      launchToast("Unable to start mining process.","danger")

  }else{

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
    showCounter.value=true
  const balEnd = (json.userinfo[0].balEnd === undefined) ? 0 : json.userinfo[0].balEnd;
  const balStart = (json.userinfo[0].balStart === undefined) ? 0 : json.userinfo[0].balStart;
    updateDisplaySetup(balStart,balEnd,json.userinfo[0].endTime)

    store.commit("accounts/saveAccountDetails",json.userinfo[0])
    store.commit("accounts/saveGroupInfo",json.group)
  
      
  }
  
 
})
.catch(err => console.log(err));
     showCounter.value=true

      
  }
  
 
})
.catch(err => console.log(err));
}).catch(function(error) {
  // Handle error
  console.log(error)
});
   
  
 }

  
    return {
      openLink,
      // access a state in computed function
      refreshData,
    currentRate,
        currentBal,
        counterString,
        secondsRemaining,
     showCounter,
     progress,
  referralCode,
  copyReferral,
      goMine,
      balEnd,
      // access a getter in computed function
      accountInfo: computed(() => store.getters["accounts/getAccountDetails"]),

    }
  },created() {
 window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
       });
  window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
  }, 
}
</script>

<style scoped>

.miner {
   text-align: center;
   overflow: hidden;
}

.bg {
  width:100%;
  height: 230px;
  border-radius: 0 0 100% 100%;
  background-color:  #111c35;
  margin-top:-200px;
}
.miner strong {
  font-size: 20px;
  line-height: 26px;
}

.miner p {
  font-size: 16px;
  line-height: 22px;
  color: #fff;
  margin: 0;
}

.miner a {
  text-decoration: none;

}
.circular-square{
  
       text-align: center;
      margin-top:-30px;
       
}
.circular-square img{
  border-radius: 50%;
        max-width: 60px;
  height: auto;
  border: 1px solid #111c35;

 
  
  
}
.user-profile {
    text-align: center;

  position: relative;
 margin-top:-30px; 
 z-index: -1;

}

#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
 

}
.logged-in {
  color: green;
}

.logged-out {
  color: red;
}
#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #fff;
  margin: 0;
}

#container a {
  text-decoration: none;
}
ion-input{
    --placeholder-color: red;
    --placeholder-opacity: 1;
}
</style>