<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <q-card
          v-for="post in whiteboards"
          :key = "post.id"
          class="card-post q-mb-md"
          bordered
          flat
        >
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">{{user.attributes.name}}</q-item-label>
          <q-item-label caption class="text-bold">
            {{post.name}}
          </q-item-label>
          <q-item-label caption >
            {{post.location}}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />
        <q-card class="my-card">
          <img :src="post.image">
        <q-card-section class="text-grey-6">
          {{post.description}}
          <div>{{post.date | niceDate}}</div>
          
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat round color="red" icon="favorite" />
          <q-btn flat round color="teal" icon="bookmark" />
          <q-btn flat round color="primary" icon="share" />
        </q-card-actions>
        
      </q-card>
      </q-card>
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

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { date } from 'quasar'
export default {
  name: 'PageHome',
  async mounted() {
    if (this.isAuthenticated) {
      this.loadWhiteboards()
    }
  },
  filters: {
    niceDate(value){
      return date.formatDate(value, 'MMMM D h:mmA')
    }
  },
  components: {
    // 'buttons': require('../components/button.vue').default
  },
  computed: {
    ...mapState({
      whiteboards: (state) => state.whiteboards.whiteboards,
      user: (state) => state.profile.user
    }),
    ...mapGetters('profile', ['isAuthenticated'])
  },
  methods: {
    // ...mapActions("whiteboards", ["fetchPosts"]),
    async loadWhiteboards() {
      try {
        if (this.isAuthenticated) {
          await this.$store.dispatch('whiteboards/fetchPosts')
        }
      } catch (error) {
        console.error(error)
        this.$q.notify(
          `Error while fetching results - Check browser console messages`
        )
      }
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
</style>