<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="constrain">
        <q-btn
          to="/camera"
          class="large-screen-only q-mr-sm"
          color="white-10"
          icon="eva-camera-outline"
          size="20px"
          flat
          round
        />
        <q-separator
          class="large-screen-only"
          spaced
          vertical
        />
        <q-toolbar-title class="text-grand-hotel">
          cfn-agram
        </q-toolbar-title>
        <q-btn
          to="/"
          class="large-screen-only"
          color="white-10"
          icon="eva-home-outline"
          size="20px"
          flat
          round
        />
      </q-toolbar>
    </q-header>
    <q-footer class="bg-white small-screen-only" elevated>
      <q-tabs class="text-grey-10" active-color="primary">
          <q-route-tab icon="eva-home-outline" label="Home" name="Home" to="/" />          
          <q-route-tab icon="eva-camera" label="Camera" name="Camera" to="/camera" />        
        </q-tabs>
    </q-footer>
    <q-page-container class="bg-grey-3">
      <transition enter-active-class="animated fadeIn" appear>
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { auth_logout } from 'src/boot/amplify';
import { mapGetters } from "vuex";

export default {
  name: 'MainLayout',
  
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
  async logout() {
    const stat = await auth_logout();
    if (stat.status == 'ok') {
      this.loggedIn = false;
    }
  }
}
}
</script>

<style lang="sass">
  .q-toolbar
    @media ( min-width: $breakpoint-sm-min )
      height: 77px
  .q-toolbar__title
    @media ( max-width: $breakpoint-xs-max )
      text-align: center
    font-size: 30px
</style>
