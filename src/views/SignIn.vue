<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" >
        <ion-title>Welcome to Supa Foundation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
  
      <div id="container">
             

      <ion-button v-if="!fbuser && showLogin" @click="signInTwitter">
  <ion-icon :icon="logoTwitter"></ion-icon>

  Sign In With Twitter
  </ion-button>
    <ion-spinner v-if="(fbuser || !showLogin) && !showForm" name="crescent"></ion-spinner>
  <ion-item-group v-if="showForm">
    <ion-text color="dark">
  <h1>Register</h1>
</ion-text>
     <ion-item>
    <ion-label position="floating"  >Nickname (required)</ion-label>
    <ion-input v-model="nicknameval"></ion-input>
  </ion-item>
    <ion-item>
    <ion-label position="floating">Referrer (optional)</ion-label>
    <ion-input  v-model="referrerval"></ion-input>
  </ion-item>
<p>
  <ion-text color="danger" >
  <span v-if="nicknameError">Nickname alphanumeric (3-20 letters). Underscore is optional</span>
  <span v-if="referrerError && !nicknameError">Referrer alphanumeric (3-20 letters) with or without underscore.</span>

</ion-text>
</p>

<ion-button  @click="registerAccount" :disabled="!showForm || referrerError || nicknameError || !nicknameval">
Submit
  </ion-button>


  
  </ion-item-group>
      </div>
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController,IonPage, IonHeader, IonToolbar, IonButton,  IonTitle, IonContent,IonIcon ,IonSpinner, IonInput, IonItem,IonItemGroup,IonLabel,IonText} from '@ionic/vue';
//import ExploreContainer from '@/components/ExploreContainer.vue';
 import { signInWithPopup, TwitterAuthProvider }  from 'firebase/auth'
 import {fbauth} from '../main'
import { logoTwitter } from 'ionicons/icons';
import { useRouter,useRoute } from 'vue-router';
import {ref} from 'vue';
import {useStore} from 'vuex';
import { useForm, useField  } from 'vee-validate';
import * as yup from 'yup';

export default  {
  components: {   IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonPage,IonIcon, IonSpinner,IonInput, IonItem,IonItemGroup,IonLabel,IonText },
   setup() {
     const userAccessToken=ref(null)
     const schema = yup.object({
      nickname: yup.string().matches(/^[A-Za-z0-9_]{3,20}$/, { excludeEmptyString: false }),
      referrer: yup.string().matches(/^[A-Za-z0-9_]{3,20}$/, { excludeEmptyString: true }),
    });
    useForm({
      validationSchema: schema,
    });
    const launchToast= async(message,color)=>{
      
      const toast = await toastController
        .create({
          message: message,
          color: color,
          duration: 3000
        })
      return toast.present();
   
    };

    const { value: nicknameval, errorMessage: nicknameError} = useField('nickname');
    const { value: referrerval, errorMessage: referrerError } = useField('referrer');
   
const store = useStore()
    const route = useRoute()
    //console.log(route.params.nickname,"NICKNAME")
    if (route.params.nickname!=undefined){

    referrerval.value=route.params.nickname

    }
     const router=useRouter() 
     let fbuser=ref(null)
     
     const showLogin=ref(true)
     const showForm=ref(false)
     const provider = new TwitterAuthProvider();
     const signInTwitter =  () => {
signInWithPopup(fbauth, provider)
  .then((result) => {
    // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
    // You can use these server side with your app's credentials to access the Twitter API.
//console.log(result.user)
    const user = result.user;

   let formData = new FormData();
formData.append('token', user.accessToken);
userAccessToken.value=user.accessToken
//console.log(user)
fetch('https://api.supa.foundation/signin', {
  method: "POST",
  body: formData,
 
})
.then(response => response.json()) 
.then(json => {

   if (json.userinfo.length==0){
showForm.value=true
showLogin.value=false
nicknameval.value=user.reloadUserInfo.screenName

  }else{
   // showForm.value=true //del

    store.commit("accounts/saveAccountDetails",json.userinfo[0])
    store.commit("accounts/saveGroupInfo",json.group)
     router.replace("/")
  }
  
})
.catch(err => console.log(err));
    // The signed-in user info.
   
    // ...
  }).catch((error) => {
//     // Handle Errors here.
//    if(fbuser.value){
    
//        let formData = new FormData();
// formData.append('token', fbuser.value.accessToken);
// userAccessToken.value=fbuser.value.accessToken
// fetch('https://api.supa.foundation/signin', {
//   method: "POST",
//   body: formData,
 
// })
// .then(response => response.json()) 
// .then(json => {
//   if (json.userinfo.length==0){
// showForm.value=true
//   }else{
//      store.commit("accounts/saveAccountDetails",json.userinfo[0])
//     store.commit("accounts/saveGroupInfo",json.group)
//       router.replace("/")
//       //showForm.value=true
//   }
  
//   //console.log(json)
// })
// .catch(err => console.log(err));

//     // The signed-in user info.
    
//       //router.replace("/")

//     }
//     else{
//     showLogin.value=true
//     }
    // ...
    console.log(error)
  });


  }
 
   const registerAccount = ()=>{
  
      if(nicknameError.value==undefined && referrerError.value==undefined && userAccessToken.value!=null){
         let formData = new FormData();
      formData.append('token', userAccessToken.value);
    formData.append('nickname', nicknameval.value);
    formData.append('referrer', referrerval.value);
      fetch('https://api.supa.foundation/signup', {
       method: "POST",
      body: formData,
 
})
.then(response => response.json()) 
.then(json => {
   if (json.error==true){
  showForm.value=true
  launchToast("An error occurred during registration. Please recheck details.","danger")
  }else{

       let formData = new FormData();
formData.append('token', userAccessToken.value);
fetch('https://api.supa.foundation/signin', {
  method: "POST",
  body: formData,
 
})
.then(response => response.json()) 
.then(json => {
  if (json.userinfo.length==0){
showForm.value=true
  }else{
    store.commit("accounts/saveAccountDetails",json.userinfo[0])
    store.commit("accounts/saveGroupInfo",json.group)
      router.replace("/")
      
  }
  
 
})
.catch(err => console.log(err));
    // store.commit("accounts/setAccountDetails",json.userinfo)
    // store.commit("accounts/setGroupInfo",json.userinfo)
      //router.replace("/")
  }
  
})
.catch(err => console.log(err));
      }
    }
   return {logoTwitter,signInTwitter, fbuser, showLogin,showForm,nicknameval, referrerval, nicknameError,referrerError,registerAccount}
},
   created() {
    this.$store.dispatch("accounts/initAccountDetails");
  }, 

}
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
#container img{
 
        max-width: 100px;
  height: auto;

 
  
  
}
</style>