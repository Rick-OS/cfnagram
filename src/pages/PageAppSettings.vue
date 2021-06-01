<template>
  <q-page class="constrain-camera q-pa-md">
    
    <div class="text-center q-pa-md">
      
        <q-input
          v-model="post.bucket"
          class="col col-sm-6"
          label="S3 Bucket Name"
          dense>
          </q-input>
      <div class="row justify-center q-ma-md">
        <q-btn @click="GetWhiteboards" rounded color="primary" label="Update Settings" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { uid } from 'quasar'
import { Logger } from '@aws-amplify/core'
import { mapState, mapGetters } from 'vuex'
import API, { graphqlOperation } from "@aws-amplify/api";
import { listWhiteboaardss } from "src/graphql/queries";
import { fetchWhiteboards } from '../store/whiteboards/actions'

export default {
  name: 'PageAppSettings',
  data() {
    return{
      post:{
        id: uid(),
        bucket:'',
        date:Date.now()
      },
      
    }
  },
  computed: {
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
    GetWhiteboards(){
      fetchWhiteboards();
    }
  }
}

</script>
<style lang="sass">
  .camera-frame
    border: 2px solid $grey-10
    border-radius: 10px
</style>