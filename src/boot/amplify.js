import Amplify from '@aws-amplify/core'
import { Auth } from '@aws-amplify/auth'
import awsconfig from '../aws-exports'
import '@aws-amplify/ui-vue'

Amplify.configure(awsconfig)
Auth.configure(awsconfig)

Amplify.Logger.LOG_LEVEL = process.env.LOG_LEVEL || 'INFO'

export const auth_logout = async () => {
    try {
      await Auth.signOut();
      const result = await Auth.currentUserInfo();
      return { status: 'ok', payload: {} };
    } catch (error) {
      return { status: 'error', payload: {} };
    }
  };