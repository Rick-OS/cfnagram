/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWhiteboaards = /* GraphQL */ `
  mutation CreateWhiteboaards(
    $input: CreateWhiteboaardsInput!
    $condition: ModelWhiteboaardsConditionInput
  ) {
    createWhiteboaards(input: $input, condition: $condition) {
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
export const updateWhiteboaards = /* GraphQL */ `
  mutation UpdateWhiteboaards(
    $input: UpdateWhiteboaardsInput!
    $condition: ModelWhiteboaardsConditionInput
  ) {
    updateWhiteboaards(input: $input, condition: $condition) {
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
export const deleteWhiteboaards = /* GraphQL */ `
  mutation DeleteWhiteboaards(
    $input: DeleteWhiteboaardsInput!
    $condition: ModelWhiteboaardsConditionInput
  ) {
    deleteWhiteboaards(input: $input, condition: $condition) {
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
