import API, { graphqlOperation } from "@aws-amplify/api";
import { listWhiteboaardss } from "src/graphql/queries";

export async function fetchWhiteboards(){
    return new Promise(async (resolve, rreject)=> {
        try {
            const resultdata = await API.graphql(graphqlOperation(listWhiteboaardss))
            console.log("Hello Rick")
            const whiteboards = resultdata.map(whiteboard => new Whiteboard(Whiteboard))
        } catch (error){
            console.error(error)
            }
    })
}