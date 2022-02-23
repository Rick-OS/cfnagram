import API, { graphqlOperation } from "@aws-amplify/api";
import { listWhiteboaardss } from "src/graphql/queries";
import { upvotePost, downvotePost } from "src/graphql/mutations";

// import query definition
import { listPosts,getVids } from '../../graphql/queries'

export async function fetchPosts({commit}) {
    try {
        console.log('Fetching Whiteboard Data')
        //await API.graphql({ query: listPosts }).then(PostData => {
          await API.graphql({ query: getVids }).then(PostData => {
          console.log("Postdata:", PostData)
          commit('fetchPosts', PostData.data.getVids.items)
          //commit('fetchPosts', PostData.data.listPosts.items)
      })
      
    } catch (err) {
      console.log({ err })
    }
}
export async function upvote({commit}, Id) {
  try {
    console.log('Updating Vote Data for Id:', Id)
    const vidId = { guid: Id };
    console.log(vidId)
    API.graphql({query: upvotePost, variables: {input: vidId}}).then(PostData => {
        console.log("Postdata:", PostData)
        console.log("YESSSSS")
        // Time to update the state with the values
    })}
    catch(error) {
    console.log("Unable to update Vote:",error)   
  }
}

export async function downvote({commit}, Id) {
  try {
    console.log('Updating Vote Data for Id:', Id)
    const vidId = { guid: Id };
    console.log(vidId)
    API.graphql({query: downvotePost, variables: {input: vidId}}).then(PostData => {
        console.log("Postdata:", PostData)
        console.log("YESSSSS")
        // Time to update the state with the values
    })}
    catch(error) {
    console.log("Unable to update Vote:",error)
  }
}