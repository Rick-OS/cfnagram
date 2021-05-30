import API, { graphqlOperation } from "@aws-amplify/api";
import axios from "axios";
import { listWhiteboaardss } from "src/graphql/queries";

// async mounted() {
// if (this.authenticated){
//     await this.$store.dispatch("catalog/fetchWhiteboards", {
//         date: this.date
//     }
//     ])


// }
// }

export function fetchWhiteboards({ commit }, {a, b, c}) {
    return new Promise(async(resolve, reject) => {
        commit("SET_LOADER", true);
        try {
            // const {data: whiteboardData} = await axios.get("/mocks/whiteboards.json");
            // GRAPHQL API HERE
            const {data: whiteboardData } = await API.graphql(graphqlOperation(listWhiteboaardss))

            const whiteboards = whiteboardData.map(whiteboard => new Whiteboard(Whiteboard))
            commit("SET_WHITEBOARD", whiteboards)
            commit("SET_LOADER", false);
            resolve();
        } catch (error){
            console.error(error)
            commit("SET_LOADER", true);
            reject(error);

        }
    })
}