const fetchPosts = (state, PostData) => {
    state.whiteboards = PostData;
};

const updateStateData = (state, PostData) => {
    state.whiteboards = PostData;
};

const incrementVotes = (state, postId) => {
    console.log("Updating Array index", postId)
    state.whiteboards[(postId)].up_votes++
}
    
const decrementVotes = (state, postId) => {
    console.log("Updating Array index", postId)
    state.whiteboards[(postId)].down_votes++
}
export {
    fetchPosts,
    incrementVotes,
    decrementVotes
};
