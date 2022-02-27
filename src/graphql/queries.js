/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      name
      location
      predictions
      imageFilename
      imageAccessLevel
      imageUrl
      createdAt
      updatedAt
      up_votes
      down_votes
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        location
        predictions
        imageFilename
        imageAccessLevel
        imageUrl
        createdAt
        updatedAt
        up_votes
        down_votes
      }
      nextToken
    }
  }
`;
export const getVids = /* GraphQL */ `
  query getVids(
    $filter: VodFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getVids(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        event_location
        down_votes
        guid
        hlsUrl
        event_Description
        imageAccessLevel
        imageFilename
        imageUrl
        srcVideo
        up_votes
      }
      nextToken
    }
  }
`;
export const listVodVotes = /* GraphQL */ `
  query listVodVotes(
    $filter: TableVodVotesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVodVotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        location
        event
      }
      nextToken
    }
  }
`;