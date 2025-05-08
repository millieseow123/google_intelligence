import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, // e.g., 'https://your-graphql-api.com/graphql'
    cache: new InMemoryCache(),
})

export default client
