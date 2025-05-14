import { gql } from '@apollo/client';

export const GENERATE_RESPONSE = gql`
  query GenerateResponse($prompt: String!) {
    generateAiResponse(prompt: $prompt)
  }
`;
