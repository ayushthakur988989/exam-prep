import axios from "axios";
import React, { useState } from "react";

const AdminChangePassword = () => {
  const id = localStorage.getItem("id");

  const [form, setForm] = useState({
    op: "",
    np: "",
    cnp: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.op || !form.np || !form.cnp) {
      alert("All fields are required");
      return;
    }

    if (form.np !== form.cnp) {
      alert("New passwords do not match");
      return;
    }

    try {
      const res = await axios.put(
        `https://exam-prep-1v8x.onrender.com/api/admin/change/${id}`,
        form
      );

      alert(res.data.message || "Password updated successfully");

      setForm({
        op: "",
        np: "",
        cnp: "",
      });
    } catch (er) {
      console.log(er);
      alert(
        er.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="container-fluid change-password-page">
      <div className="change-password-card">
        <h3 className="fw-bold mb-3" style={{ color: "#6f42c1" }}>
          Change Password
        </h3>

        <form method="POST" onSubmit={handleSubmit}>
          <label>Enter your old password</label>
          <input
            type="password"
            className="form-control mt-2 mb-2"
            name="op"
            value={form.op}
            onChange={handleChange}
            placeholder="Old password"
          />

          <label>Enter new password</label>
          <input
            type="password"
            className="form-control mt-2 mb-2"
            name="np"
            value={form.np}
            onChange={handleChange}
            placeholder="New password"
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            className="form-control mt-2 mb-2"
            name="cnp"
            value={form.cnp}
            onChange={handleChange}
            placeholder="Confirm New Password"
          />

          <button className="btn btn-primary mt-2" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminChangePassword;