import React from "react";
import { createRoot } from "react-dom/client"; // Utilisez createRoot pour React 18
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import client from "./apolloClient";
import './index.css'

const container = document.getElementById("root"); // Récupérez le conteneur racine
const root = createRoot(container!); // Créez la racine avec createRoot

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
