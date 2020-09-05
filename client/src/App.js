import React, { useState } from "react";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import Home from "./pages/Home";
import { ApolloProvider } from "@apollo/react-hooks";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  );
};

export default App;
