<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && whiteboards.length">
          <q-card
            v-for="post in whiteboards"
            :key = "post.guid"
            class="my-card q-mb-md"
            bordered
            flat          >
          <div>
          </div>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">{{user.attributes.name}}</q-item-label>
              <q-item-label caption class="text-bold">
                {{post.ImageFilename}}
              </q-item-label>
              <q-item-label caption >
                {{post.event_location}}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
          <q-card class="my-card">
            <q-video :src="post.hlsUrl" style="height: 400px"/>
            <q-card-section class="text-grey-6">
              {{post.event_Description}}
              <div>{{post.date | niceDate}}</div>
              <div class="text-subtitle1">
                Winter Olympics
              </div>
              <div class="text-caption text-grey">
                Downhill Ski run by Australian Rick O'Sullivan.
              </div>
            </q-card-section>
            <q-card-actions >
              <q-btn 
                flat 
                round 
                :label=post.up_votes
                @click="addUpVote(post.guid)"
                color="blue" 
                icon="thumb_up_alt" 
              />
              <q-btn 
                flat round 
                :label=post.down_votes
                @click="addDownVote(post.guid)"
                color="red" 
                icon="thumb_down_alt" />
            </q-card-actions>
          </q-card>
        </q-card>
      </template>
      <!-- Adding a loading skeleton and fallback message component while posts are loading -->
      <template v-else-if="!loadingPosts && !whiteboards.length">
        <h5 class="text-center" text-grey> No Posts Yet</h5>
      </template>
      <template v-else>
        <Loading-Skeleton/>
      </template>
      </div>
      <div class="col-4 large-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">{{user.attributes.name}}</q-item-label>
            <q-item-label caption class="text-bold">
            </q-item-label>
          </q-item-section>
        </q-item>
      </div> 
    </div>
  </q-page>
</template>
<script src="https://cdn.jsdelivr.net/npm/hls.js@alpha"></script>
<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import { date } from 'quasar'
import whiteboards from 'src/store/whiteboards';
export default {
  data() {
    return {
      loadingPosts: true
    }
  },

  name: 'PageHome',
  async mounted() {
    if (this.isAuthenticated) {
      this.loadingPosts = true
      this.loadWhiteboards()
    }
  },
  filters: {
    niceDate(value){
      return date.formatDate(value, 'MMMM D h:mmA')
    }
  },
  components: {
    'Loading-Skeleton': require('../components/Loading-Skeleton.vue').default,
  },
  computed: {
    ...mapState({
      whiteboards: (state) => state.whiteboards.whiteboards,
      user: (state) => state.profile.user
    }),
    ...mapGetters('profile', ['isAuthenticated'])
  },
  methods: {
    // ...mapMutations(['incrementVotes']),
    // ...mapActions("whiteboards", ["fetchPosts"]),
    async loadWhiteboards() {
      try {
        if (this.isAuthenticated) {
          await this.$store.dispatch('whiteboards/fetchPosts')
          this.loadingPosts = false
        }
      } catch (error) {
        console.error(error)
        this.loadingPosts = false
        this.$q.notify(
          `Error while fetching results - Check browser console messages`
        )
      }
    },
    async addUpVote(id) {
      console.log(id)
      var arrayIndex = ''
      if(id == '05c0f223-be12-4082-83a0-5f6397fce370'){
        arrayIndex = 0
      }else{arrayIndex = 1}
      this.$store.commit('whiteboards/incrementVotes',arrayIndex)
      await this.$store.dispatch('whiteboards/upvote', id)
    }, 
    async addDownVote(id) {
      console.log(id)
      var arrayIndex = ''
      if(id == '05c0f223-be12-4082-83a0-5f6397fce370'){
        arrayIndex = 0
      }else{arrayIndex = 1}
      this.$store.commit('whiteboards/decrementVotes',arrayIndex)
      await this.$store.dispatch('whiteboards/downvote', id)
      
    }, 
    async logout() {
      await this.$store.dispatch("auth/logout");
      this.$router.push("/");
    }
  },
}
</script>

<style lang="sass">
.card-post
  .q-img
    min-height: 200px

.post__card
  opacity: 1
  box-shadow: 5px 5px 5px 5px rgba(0,0,0,0.3)
  min-height: 400px
</style>