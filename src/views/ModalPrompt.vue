<template>
  <ion-header>
    <ion-toolbar color="primary" >
      <ion-title>Install the Web App</ion-title>
        <ion-buttons slot="end">
                <ion-button @click="dismissModal">Dismiss</ion-button>
              </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
  <ion-label>
            <ion-text color="primary">

            <h2> Step 1: Ensure you are using Safari Browser</h2>
            </ion-text>
        <ion-text color="primary">

            <h2> Step 2: Hit the <ion-icon :icon="shareOutline"></ion-icon> icon.</h2>
            </ion-text>
             <ion-text color="primary">

            <h2> Step 3: Select "Add to HomeScreen"</h2>
            </ion-text>
          </ion-label>
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar, modalController,IonIcon,IonText,IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import { shareOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'ModalPrompt',
 setup(){

     const dismissModal=async()=> {
  await modalController.dismiss();
  localStorage.setItem("installPrompt",Math.round(new Date() / 1000)+600)
}

return{
dismissModal,shareOutline
}
 },
  data() {
    return {
      content: 'Content',
    }
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar,IonIcon,IonText,IonLabel }
});
</script>