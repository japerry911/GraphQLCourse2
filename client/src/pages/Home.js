import React, { useContext } from "react";
import { gql } from "apollo-boost";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/authContext";

const GET_ALL_POSTS = gql`
  {
    allPosts {
      id
      title
      description
    }
  }
`;

const Home = () => {
  const { data, loading, error } = useQuery(GET_ALL_POSTS);
  const [fetchPosts, { data: posts }] = useLazyQuery(GET_ALL_POSTS);
  const { state, dispatch } = useContext(AuthContext);

  if (error) {
    console.log(error);
  }

  if (loading) {
    return <p className="p-5">Loading...</p>;
  }

  return (
    <div className="container">
      <div className="row p-5">
        {data &&
          data.allPosts.map((post) => (
            <div key={post.id} className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="card-title">
                    <h4>{post.title}</h4>
                  </div>
                  <p className="card-text">{post.description}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="row p-5">
        <button
          className="btn-btn-raised btn-primary"
          onClick={() => fetchPosts()}
        >
          Fetch Posts
        </button>
      </div>
      <hr />
      {JSON.stringify(posts)}
    </div>
  );
};

export default Home;
