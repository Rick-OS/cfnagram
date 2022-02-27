import API, { graphqlOperation } from "@aws-amplify/api";
import { listWhiteboaardss } from "src/graphql/queries";
import { upvotePost, downvotePost, createVodVotes } from "src/graphql/mutations";

// import query definition
import { listPosts,getVids, listVodVotes } from '../../graphql/queries'

export async function fetchPosts({commit}, username) {
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
    try {
      console.log("Username is:", username)
      const votefilterData = {filter: {
        userid: {
          eq: username
        }
      }}
      console.log("Fetching Voting Data with filter :", votefilterData)
      const iceSkating = 0
      await API.graphql({query: listVodVotes, variables: votefilterData}).then(myVoteReturnData => {
        console.log("MyVoteData:", myVoteReturnData.data.listVodVotes.items)
        
      const eventArray = myVoteReturnData.data.listVodVotes.items.reduce(function(sums,entry){
          sums[entry.event] = (sums[entry.event] || 0) + 1;
          return sums
       },{});
      console.log(eventArray)
      commit('voteStats', eventArray)
        });
    }catch (error) {
        console.log({ error })
    }
  }
export async function upvote({commit}, objectdata) {
  try {
    console.log('Updating Vote Data for videoidd:', objectdata.Id)
    console.log('Updating Vote Data for userId:', objectdata.username)
    
    const vidId = { guid: objectdata.Id };
    console.log(vidId)
    API.graphql({query: upvotePost, variables: {input: vidId}}).then(PostData => {
        console.log("Postdata:", PostData)
    })}
    catch(error) {
    console.log("Unable to update Vote:",error)   
  }
  try {
    const voteData = {
      userid: objectdata.username, 
      videoid: objectdata.Id, 
      vote: "up",
      location: objectdata.eventlocation,
      event: objectdata.eventdescription
    }
    console.log("We are inserting the following input data for votes",voteData)
    API.graphql({query: createVodVotes, variables: {input: voteData}}).then(voteReturnData => {
      console.log("Votedata:", voteReturnData)
  })
  } catch (error) {
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