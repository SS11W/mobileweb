<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
        <ion-label >โดย เอกสิทธิ์ พินิจมนตรี รหัส 663380249-5</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- CHANGE: Add a grid component to display the photos -->
      <ion-grid>
        <ion-row>
          <!-- CHANGE: Create a new column and image component for each photo -->
          <ion-col size="6" :key="photo.filepath" v-for="photo in photos">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      
    </ion-content>

    <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <!-- CHANGE: Add a click event listener to the floating action button -->
        <ion-fab-button @click="addNewToGallery()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
  </ion-page>
</template>

<script setup lang="ts">
import { camera, trash, close } from 'ionicons/icons';
import {
  IonPage,
  IonHeader,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLabel,
} from '@ionic/vue';

import { usePhotoGallery } from '@/composables/usePhotoGallery';

// CHANGE: Add `photos` array to destructure from `usePhotoGallery()`
const { photos, addNewToGallery } = usePhotoGallery();
</script>