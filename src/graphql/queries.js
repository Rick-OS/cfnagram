/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWhiteboaards = /* GraphQL */ `
  query GetWhiteboaards($id: ID!) {
    getWhiteboaards(id: $id) {
      id
      captureDate
      captureDescription
      capturePageNum
      customerID
      pattern
      captureLocation
      createdAt
      updatedAt
    }
  }
`;
export const listWhiteboaardss = /* GraphQL */ `
  query ListWhiteboaardss(
    $filter: ModelWhiteboaardsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWhiteboaardss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        captureDate
        captureDescription
        capturePageNum
        customerID
        pattern
        captureLocation
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
