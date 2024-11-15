import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://beta.pokeapi.co/graphql/v1beta", // URL de l'API GraphQL
  cache: new InMemoryCache(), // Gère le cache local
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
