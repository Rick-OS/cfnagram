<template>
  <amplify-authenticator>
      <div>
        Rix Auth Page
        <amplify-sign-out v-if="authState == 'signedin'"></amplify-sign-out>
      </div>
  </amplify-authenticator>
    
</template>

<script>
// @ts-ignore
import { onAuthUIStateChange, AuthState } from '@aws-amplify/ui-components'
import { Hub, Logger } from '@aws-amplify/core'

const logger = new Logger('Authentication')
const noAuthMessage = 'user is undefined'
const authMessageChannel = 'UI Auth'

/**
 * Authentication view authenticates a customer and redirects to desired page if successful
 * Non-authenticated users are redirected to this view via Route Guards
 */
export default {
  name: 'Authentication',
  /**
   * @param {string} redirectTo - Sets Route one must go once authenticated
   */
  props: {
    redirectTo: String
  },
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState
      this.user = authData

      if (authState === AuthState.SignIn) {
        logger.debug('Customer needs to sign in yet...')
      }

      if (authState === AuthState.SignedIn) {
        logger.debug('user successfully signed in!')
        logger.debug('user data: ', authData)
        console.log("redirected from: ",this.redirectTo)
        this.$router.push({ name: this.redirectTo })
      }
    })

    Hub.listen(authMessageChannel, (data) => {
      const event = data.payload?.event ?? ''
      const message = data.payload?.message ?? ''

      // Ignore message if customer hasn't attempted to login yet
      if (message === noAuthMessage) return

      if (event === 'ToastAuthError') {
        this.$q.notify(message)
      }
    })
  },
  beforeDestroy() {
    return onAuthUIStateChange
  },
  data() {
    return {
      authState: undefined,
      user: undefined,
      
    }
  }
}
</script>

<style lang="sass">

</style>
