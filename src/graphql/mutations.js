/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      name
      location
      predictions
      imageFilename
      imageAccessLevel
      imageUrl
      createdAt
      updatedAt
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      name
      location
      predictions
      imageFilename
      imageAccessLevel
      imageUrl
      createdAt
      updatedAt
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      name
      location
      predictions
      imageFilename
      imageAccessLevel
      imageUrl
      createdAt
      updatedAt
    }
  }
`;

export const upvotePost = /* GraphQL */`
  mutation upvotePost(
    $input: VodInput!
    ) {
      upvotePost(input: $input) {
        guid
        up_votes
        down_votes
        imageFilename
        event_location
        srcVideo
        imageAccessLevel
        imageUrl
      }
    }
`;

export const downvotePost = /* GraphQL */`
  mutation downvotePost(
    $input: VodInput!
    ) {
      downvotePost(input: $input) {
        guid
        up_votes
        down_votes
        imageFilename
        event_location
        srcVideo
        imageAccessLevel
        imageUrl
      }
    }
`;