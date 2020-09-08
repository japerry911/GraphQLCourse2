import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, googleAuthProvider } from "../../firebase";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const USER_CREATE = gql`
  mutation {
    userCreate {
      username
      email
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const { dispatch } = useContext(AuthContext);

  const history = useHistory();

  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const result = await auth.signInWithEmailAndPassword(email, password);

      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      dispatch({
        type: "LOGGED_IN_USER",
        payload: { email: user.email, token: idTokenResult.token },
      });

      userCreate();

      history.push("/");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    const result = await auth.signInWithPopup(googleAuthProvider);

    const { user } = result;
    const idTokenResult = await user.getIdTokenResult();

    dispatch({
      type: "LOGGED_IN_USER",
      payload: { email: user.email, token: idTokenResult.token },
    });

    userCreate();

    history.push("/");
  };

  return (
    <div className="container p-5">
      {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Login</h4>}{" "}
      <button onClick={googleLogin} className="btn btn-raised btn-danger mt-5">
        Login with Google
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter Email"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter Password"
            disabled={loading}
          />
        </div>
        <button
          className="btn btn-raised btn-primary"
          disabled={!password || loading || !email}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
