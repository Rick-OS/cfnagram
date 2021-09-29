import API, { graphqlOperation } from "@aws-amplify/api";
import { listWhiteboaardss } from "src/graphql/queries";

// import query definition
import { listPosts } from '../../graphql/queries'

export async function fetchPosts({commit}) {
    try {
        console.log('Fetching Whiteboard Data')
        await API.graphql({ query: listPosts }).then(PostData => {
          commit('fetchPosts', PostData.data.listPosts.items)
      })
      
    } catch (err) {
      console.log({ err })
    }
}