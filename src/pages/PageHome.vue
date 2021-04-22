<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <q-card
          v-for="post in posts"
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
          <q-item-label class="text-bold">Rickos</q-item-label>
          <q-item-label caption class="text-bold">
            {{post.customer}}
          </q-item-label>
          <q-item-label caption >
            {{post.solution}}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />
        <q-card class="my-card">
          <img :src="post.imageUrl">
        <q-card-section class="text-grey-6">
          {{post.location}}
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
            <q-item-label class="text-bold">Rickos</q-item-label>
            <q-item-label caption class="text-bold">
              Rickos
            </q-item-label>
          </q-item-section>
        </q-item>
      </div> 
    </div>
    
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { date } from 'quasar'
export default {
  name: 'PageHome',
  data() {
    return {
      posts: [
        {
          id: 1,
          customer: "AMP Bank",
          caption:"Project 1",
          solution:"Generate Tables",
          date: 123456765432345,
          location: "Melbourne, Victoria, Australia",
          imageUrl: "https://d2908q01vomqb2.cloudfront.net/b7eb6c689c037217079766fdb77c3bac3e51cb4c/2019/05/18/cfn-tables-arch-diagram-1024x508.png",
        },
        {
          id: 2,
          customer: "Ricks Bank",
          caption:"Project 2",
          solution:"Simple ML Solution",
          date: 123456765432345,
          location: "Sydney, NSW, Australia",
          imageUrl: "https://i.pinimg.com/originals/76/0d/36/760d36c608114d6eeb2831ca04e7a9a7.png",
        },
        {
          id: 3,
          customer: "Cams Bank",
          caption:"Project Z",
          solution:"Cams Solution",
          date: 123456765432345,
          location: "Melbourne, Victoria, Australia",
          imageUrl: "https://www.departmentofproduct.com/wp-content/uploads/2016/12/System-overview.png",
        },
      ]
    }
  },
  filters: {
    niceDate(value){
      return date.formatDate(value, 'MMMM D h:mmA')
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch("auth/logout");
      this.$router.push("/");
    }
  }
}
</script>

<style lang="sass">
.card-post
  .q-img
    min-height: 200px
</style>