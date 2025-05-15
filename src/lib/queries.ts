import { gql } from '@apollo/client';

export const GENERATE_CHAT_TITLE = gql`
  query($message: String!) {
    generateChatTitle(message: $message)
  }
`;
