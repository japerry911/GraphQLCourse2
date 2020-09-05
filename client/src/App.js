import React, { useState } from "react";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

const App = () => {
  const [posts, setPosts] = useState([]);

  client
    .query({
      query: gql`
        {
          allPosts {
            id
            title
            description
          }
        }
      `,
    })
    .then((result) => setPosts(result.data.allPosts));

  return (
    <div className="container">
      <div className="row p-5">
        {posts.map((post) => (
          <div key={post.id} className="col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  <h4>{post.title}</h4>
                </div>
                <div className="card-text">{post.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
