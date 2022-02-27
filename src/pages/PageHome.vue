<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && whiteboards.length">
          <q-card
            v-for="post,index in whiteboards"
            :key = "post.guid"
            class="my-card q-mb-md"
            bordered
            flat          >
          <div>
          </div>
          <q-item>
            <q-item-section avatar>
              <q-avatar square>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/2022_Winter_Olympics_logo.svg/500px-2022_Winter_Olympics_logo.svg.png">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">Winter Olympics</q-item-label>
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
              Gold Medal Race
              <div>{{post.date | niceDate}}</div>
              <div class="text-subtitle1">
                {{post.event_Description}}
              </div>
              <div class="text-caption text-grey">
              </div>
            </q-card-section>
            <q-card-actions >
              <div class=" text-grey-6 text-bold">Is this gold medal worthly?. Decide with votes</div>
              <q-btn 
                flat 
                round
                :label=post.up_votes
                @click="addUpVote(post.guid, index, post.event_location, post.event_Description)"
                color="blue" 
                icon="thumb_up_alt" 
              />
              <q-btn 
                flat round 
                :label=post.down_votes
                @click="addDownVote(post.guid, index)"
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
        <q-item class="sticky">
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
        
        <q-card class="my-card">
      <!-- <q-img src="../assets/images/summary.png" /> -->
      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="leaderboard"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
        />

        <div class="row no-wrap items-center">
          <div class="col ellipsis text-grey-9 text-bold">
            My Voting Statistics
          </div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="vote" />
          </div>
        </div>

        <!-- <q-rating v-model="stars" :max="5" size="32px" /> -->
      </q-card-section>
      <q-card-section >
        <div v-for="item, index in voteData" :key="index">
          <q-badge outline align="middle" color="primary">
          {{ index }} - {{item}}
          </q-badge>  
        </div>
      </q-card-section>
    
      <q-separator />
      <q-card-actions>
        <q-btn flat round icon="leaderboard" />
        <q-btn flat color="Primary" @click="openLink('https://us-east-1.quicksight.aws.amazon.com/sn/dashboards/d43dbd8a-0e6a-4e10-9105-08047724ce8e')">
        Goto Voting Dashboard
        </q-btn>
      </q-card-actions>
    </q-card>
      </div> 
    </div>
  </q-page>
</template>
<script src="https://cdn.jsdelivr.net/npm/hls.js@alpha"></script>
<script>
import { openURL } from 'quasar'
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import { date } from 'quasar'
import whiteboards from 'src/store/whiteboards';
import { firstName, userId } from 'src/store/profile/getters';
export default {
  data() {
    return {
      loadingPosts: true
    }
  },

  name: 'PageHome',
  async mounted() {
    const username = this.username
    if (this.isAuthenticated) {
      this.loadingPosts = true
      this.loadWhiteboards(username)
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
      user: (state) => state.profile.user,
      voteData: (state) => state.whiteboards.voteData
    }),
    ...mapGetters('profile', ['isAuthenticated', 'username'])
  },
  methods: {
    async loadWhiteboards(username) {
      try {
        if (this.isAuthenticated) {
          await this.$store.dispatch('whiteboards/fetchPosts', username)
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
    async addUpVote(guid, index, location, description) {
      const objectdata = {}
      objectdata.username = this.username
      objectdata.Id = guid
      objectdata.eventlocation = location
      objectdata.eventdescription = description
      console.log("ObjectData",objectdata)
      this.$store.commit('whiteboards/incrementVotes',index)
      await this.$store.dispatch('whiteboards/upvote', objectdata)
    }, 
    async addDownVote(guid, index) {
      this.$store.commit('whiteboards/decrementVotes',index)
      await this.$store.dispatch('whiteboards/downvote', guid)
    }, 
    async logout() {
      await this.$store.dispatch("auth/logout");
      this.$router.push("/");
    },
    openLink(URL){
      openURL(URL)

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