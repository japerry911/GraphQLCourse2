import React, { useContext } from "react";
import ApolloClient from "apollo-boost";
import Home from "./pages/Home";
import { ApolloProvider } from "@apollo/react-hooks";
import Nav from "./components/Nav";
import { Route, Switch } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ToastContainer } from "react-toastify";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import { AuthContext } from "./context/authContext";
import PrivateRoute from "./components/PrivateRoute";
import PasswordReset from "./pages/auth/PasswordReset";
import Post from "./pages/post/Post";
import Profile from "./pages/auth/Profile";

const App = () => {
  const { state } = useContext(AuthContext);

  const { user } = state;

  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    request: (operation) => {
      operation.setContext({
        headers: {
          authtoken: user ? user.token : null,
        },
      });
    },
  });

  return (
    <ApolloProvider client={client}>
      <Nav />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route
          exact
          path="/complete-registration"
          component={CompleteRegistration}
        />
        <PrivateRoute exact path="/password/update" component={PasswordReset} />
        <PrivateRoute exact path="/post/create" component={Post} />
        <PrivateRoute exact path="/profile" component={Profile} />
      </Switch>
    </ApolloProvider>
  );
};

export default App;
