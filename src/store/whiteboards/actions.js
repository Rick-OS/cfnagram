import API, { graphqlOperation } from "@aws-amplify/api";
import { listWhiteboaardss } from "src/graphql/queries";

export async function fetchWhiteboards(){
    return new Promise(async (resolve, reject)=> {
        try {
            const {
                // @ts-ignore
                data: {
                    listWhiteboaardss: { items: whiteboardData }
                    }
                } = await API.graphql(graphqlOperation(listWhiteboaardss))
          
              // data mutations happen within a Flight class
              // here we convert graphQL results into an array of Flights
              // before committing to Vuex State Management
              // const whiteboards = whiteboardData.map((whiteboard) => new Whiteboard(whiteboard))

                console.log("Hello Rick", whiteboardData)
                // const whiteboards = resultdata.map(whiteboard => new Whiteboard(Whiteboard))
        } catch (error){
            console.error(error)
            }
    })
}