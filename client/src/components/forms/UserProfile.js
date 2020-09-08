import React from "react";

const UserProfile = ({ handleSubmit, values, handleChange, loading }) => (
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

export default UserProfile;
