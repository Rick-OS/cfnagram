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
              <q-btn 
                flat 
                round 
                :label=post.up_votes
                @click="addUpVote(post.guid, index)"
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
      <q-img src="../assets/images/summary.png" />

      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="leaderboard"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Replay Voting Statistics
          </div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="vote" />
          </div>
        </div>

        <!-- <q-rating v-model="stars" :max="5" size="32px" /> -->
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">
         Voting By category
        </div>
        <div class="text-caption text-grey">
          Ice Skating - 7%
        </div>
        <div class="text-caption text-grey">
          Snow Boarding - 47%
        </div>
        <div class="text-caption text-grey">
          Curling - 1%
        </div>
        <div class="text-caption text-grey">
          Luge - 1%
        </div>
        <div class="text-caption text-grey">
          Ski Jumping - 1%
        </div>
        <div class="text-caption text-grey">
          Bobsleigh - 1%
        </div>
        <div class="text-caption text-grey">
          Ice Hockey - 1%
        </div>
      </q-card-section>
    
      <q-separator />
      <q-card-actions>
        <q-btn flat round icon="leaderboard" />
        <q-btn flat color="Primary" @click="openLink('https://ap-southeast-2.quicksight.aws.amazon.com/sn/analyses/13e5a84d-18ab-4938-9215-3e006550c44c')">
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
      // this.loadWhiteboards()
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
    async addUpVote(guid, index) {
      this.$store.commit('whiteboards/incrementVotes',index)
      await this.$store.dispatch('whiteboards/upvote', guid)
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