import React from "react";

const AuthForm = ({
  email,
  password = "",
  loading,
  setEmail,
  setPassword,
  handleSubmit,
  showPasswordInput = false,
}) => (
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
    {showPasswordInput && (
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
    )}
    <button className="btn btn-raised btn-primary" disabled={loading || !email}>
      {showPasswordInput ? "Sign In" : "Submit"}
    </button>
  </form>
);

export default AuthForm;
