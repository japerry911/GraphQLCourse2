import React, { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import omitDeep from "omit-deep";

const USER_INFO = gql`
  fragment userInfo on User {
    _id
    username
    name
    email
    images {
      url
      public_id
    }
    about
    createdAt
    updatedAt
  }
`;

const PROFILE = gql`
  query {
    profile {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

const USER_UPDATE = gql`
  mutation userUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

const Profile = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    images: [],
    about: "",
  });
  const [loading, setLoading] = useState(false);

  const { data } = useQuery(PROFILE);

  useEffect(() => {
    if (data) {
      setValues({
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        images: omitDeep(data.profile.images, ["__typename"]),
        about: data.profile.about,
      });
    }
  }, [data]);

  const [userUpdate] = useMutation(USER_UPDATE, {
    update: ({ data }) => {
      console.log("USER UPDATE MUTATION IN PROFILE", data);
      toast.success("Profile updated.");
    },
  });

  const handleImageChange = () => {};

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    userUpdate({ variables: { input: values } });
    setLoading(false);
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          className="form-control"
          placeholder="Username"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          className="form-control"
          placeholder="Name"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="form-control"
          placeholder="Email"
          disabled
        />
      </div>
      <div className="form-group">
        <label>Image</label>
        <input
          type="file"
          name="image"
          value={values.image}
          onChange={handleImageChange}
          className="form-control"
          placeholder="Email"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>About</label>
        <input
          type="text"
          name="about"
          value={values.about}
          onChange={handleChange}
          className="form-control"
          placeholder="About"
          disabled={loading}
        />
      </div>
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!values.email || loading}
      >
        Submit
      </button>
    </form>
  );

  return <div className="container p-5">{profileUpdateForm()}</div>;
};

export default Profile;
