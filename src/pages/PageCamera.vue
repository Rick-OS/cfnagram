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
          v-model="post.customername"
          class="col col-sm-6"
          label="Customer Name"
          dense></q-input
          >
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.projectname"
          class="col col-sm-6"
          label="Album Name"
          dense></q-input
          >
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.capturedimage"
          class="col col-sm-6"
          label="Image Name"
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
        <q-btn 
          v-if="hasCameraSupport"
          @click="getPredictions()" 
          unelevated rounded color="primary" label="Process Image" />
      </div>
      <div class="q-pa-md q-gutter-sm">
        <div>
          <q-toggle
            v-model="imagesProtected"
            color="blue"
            unchecked-icon="clear"
            label="Keep Image Private"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { uid } from 'quasar'
import Amplify, { Auth, Storage, Predictions, API } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import { Logger } from '@aws-amplify/core'
import { mapState, mapGetters } from 'vuex'
// import query definition
import { createPost } from '../graphql/mutations'
Amplify.addPluggable(new AmazonAIPredictionsProvider());

export default {
  name: 'PageCamera',
  data() {
    return{
      post:{
        id: uid(),
        customername:'',
        capturedimage:'',
        projectname:'',
        location:'',
        photo:null,
        date:Date.now(),
        signedImageUrl: ''
      },
      imageCaptured: false,
      imageUpload: [],
      hasCameraSupport: true,
      locationLoading: false,
      imagesProtected: true,
      protectionLevel: 'protected',
      imageFilename: ''
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
      this.post.photo = this.dataURItoBlob(canvas.toDataURL())
      const imageblob = this.post.photo
      // Temporaray call to uploadImage as part of the Image Capture. This should be moved to the Upload button
      this.uploadImage(imageblob)
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
    uploadImage(blob){
      if (this.post.customername && this.post.projectname){
        var filename = `${ this.post.customername }/${ this.post.projectname }/${ this.post.capturedimage }-${Date.now("dd-mm-yyyy")}.jpg`.toLowerCase();
      }else if(this.post.projectname){
        var filename = `${ this.post.projectname }/${ this.post.capturedimage }-${Date.now("dd-mm-yyyy")}.jpg`.toLowerCase();
      }else{
        var filename = `${ this.post.capturedimage }-${Date.now("dd-mm-yyyy")}.jpg`.toLowerCase();
      }
      console.log("Filename: ", filename)
      this.imageFilename = filename
      // Setting the Protection Level based on Form Toggle v-model: imagesProtected
      if (this.imagesProtected === false) {
        this.protectionLevel = 'public'
      }
      console.log("Protection Level: ", this.protectionLevel)
      // Uploading file to S3
      const s3Upload = Storage.put(filename, blob, {
          level: this.protectionLevel,
          contentType: 'image/jpg'
      });
      // Grabbing a Presigned Key for Downloading files from S3 -
      // #TODO - This needs to be moved into the onMounted hook as these are time bound
      Storage.get(filename, {level: this.protectionLevel}).then(ResponseData => {
      this.post.signedImageUrl = ResponseData
      console.log("Signed Url : ", this.post.signedImageUrl)
      })
    },
    async getPredictions(){
      /* -- PREDICTIONS -- */
      console.log('asking for predictions');
      const predicted = await Predictions.identify({
        labels: {
            source: {
                key: this.imageFilename,
                level: this.protectionLevel  // Adding Level key for public or protected files
            },
            type: "ALL"
          }
        });
      console.log('predicted: ');
      console.log(predicted);
      let predictedLabel = ' ';
      for (let label of predicted.labels) {
        console.log(label);
        if(label.metadata?.confidence > 90.0) {
            predictedLabel +='#' + label.name + ' ';
        }
      }
      /* --- end PREDICTIONS --- */
      // const postId = uid();
      const postDescription = predictedLabel;
      const postInfo = { name: this.post.capturedimage, description: postDescription, location: this.post.location, image: this.post.signedImageUrl, id: this.post.id };
      console.log("post info is");
      console.log(postInfo)
      const CreatePostResponse = API.graphql({
        query: createPost,
        variables: { input: postInfo },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      });
      console.log(CreatePostResponse)
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