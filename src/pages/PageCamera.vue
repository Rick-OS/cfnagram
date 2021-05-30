<template>
  <q-page class="constrain-camera q-pa-md">
    <div class="camera-frame q-pa-md">

      <video ref= "video" v-show="!imageCaptured" class="full-width" autoplay />
      <canvas ref= "canvas" v-show="imageCaptured" class="full-width" height="240" />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        v-if="hasCameraSupport"
        @click="captureImage"
        color="grey-10"
        icon="eva-camera"
        size="lg"
        round
      />
      <q-file
        label="Choose file to upload"
        accept="image/*"
        @input="captureImageFallback"
        v-else
        v-model="imageUpload"
        outlined
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.solution"
          class="col col-sm-6"
          label="Solution Name"
          dense></q-input
        >
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.location"
          :loading="locationLoading"
          class="col col-sm-6"
          label="Location"
          dense
        >
        <template v-slot:append>
          <q-btn
            v-if="!locationLoading && geolocationSupported"
            @click="getLocation"
            icon="eva-navigation-2-outline"
            dense
            flat
            round/>
        </template>
        </q-input>
      </div>
      <div class="row justify-center q-ma-md">
        <q-btn unelevated rounded color="primary" label="Upload " />
      </div>
    </div>
  </q-page>
</template>

<script>
import { uid } from 'quasar'
import Amplify, { Auth, Storage } from 'aws-amplify';
import { Logger } from '@aws-amplify/core'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PageCamera',
  data() {
    return{
      post:{
        id: uid(),
        solution:'',
        location:'',
        photo:null,
        date:Date.now()
      },
      imageCaptured: false,
      imageUpload: [],
      hasCameraSupport: true,
      locationLoading: false
    }
  },
  computed: {
    geolocationSupported() {
      console.log(navigator)
      if ('geolocation' in navigator) return true
      else return false
    },
    ...mapGetters({
      isAuthenticated: 'profile/isAuthenticated',
      firstName: 'profile/firstName',
      lastName: 'profile/lastName'
    }),
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },
  },
  methods: {
    initCamera() {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        this.$refs.video.srcObject = stream
      }).catch(error => {
        this.hasCameraSupport = false
      })
    },
    captureImage() {
      let video = this.$refs.video
      let canvas = this.$refs.canvas

      canvas.width = video.getBoundingClientRect().width
      canvas.height = video.getBoundingClientRect().height
      let context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      console.log("CapturedImaged")
      this.imageCaptured = true
      let filename = `${Date.now()}.jpg`
      this.post.photo = this.dataURItoBlob(canvas.toDataURL())
      let imageblob = this.post.photo
      this.uploadImage(filename, imageblob)
      this.disableCamera()
    },
    disableCamera(){
      this.$refs.video.srcObject.getVideoTracks().forEach(track => {
        track.stop()
      })
    },
    captureImageFallback(file) {
      this.post.photo = file
      
      let canvas = this.$refs.canvas
      let context = canvas.getContext('2d')
      var reader = new FileReader();
      reader.onload = event => {
        var img = new Image()
        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            context.drawImage(img,0,0);
        }
        this.imageCaptured = true
        img.src = event.target.result;
      }
      reader.readAsDataURL(file); 

      console.log(file)
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], {type: mimeString});
      return blob;
    },
    getLocation(){
      this.locationLoading = true
      navigator.geolocation.getCurrentPosition(position => {
        console.log("position:", position)
        this.getCityandCountry(position)
      }, err => {
        this.locationError()
      }, {timeout: 7000})
    },
    getCityandCountry(position){
      let geoURI = `https://geocode.xyz/${ position.coords.latitude },${ position.coords.longitude }?json=1`
      this.$axios.get(geoURI).then(result => {
        console.log("result:", result)
        this.locationSuccess(result)
      }).catch( err => {
        this.locationError()
      })
    },
    locationSuccess(result){
      this.post.location = result.data.city
      if (result.data.country){
        this.post.location += `, ${result.data.country}`
      }
      this.locationLoading = false
    },
    locationError(){
      this.$q.dialog({
        title: 'Error',
        message: 'Error Getting Location.'
      })
      this.locationLoading = false
    },
    uploadImage(filename, blob){
      let s3Upload = Amplify.Storage.vault.put(filename, blob, {
      contentType: 'iamge/jpg'
      });   
    }
  },
  mounted() {
    this.initCamera()
    if (this.isAuthenticated) {
      console.log("Im Authenticated")
    }
  },
  beforeDestroy(){
    if (this.hasCameraSupport) {
      this.disableCamera()
    }
  }
}
</script>
<style lang="sass">
  .camera-frame
    border: 2px solid $grey-10
    border-radius: 10px
</style>