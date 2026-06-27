import axios from 'axios'
import React, { useState } from 'react'

const UserChangePassword = () => {
    const id = localStorage.getItem('id');
    const [form, setForm] = useState({
        op: '',
        np: '',
        cnp: ''
    });
    const [loading, setLoading] = useState(false);

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

        setLoading(true);
        try {
            const res = await axios.put(`https://exam-prep-1v8x.onrender.com/api/examinee/changepassword/${id}`, form);
            alert(res.data.message || "Password updated successfully");
            setForm({ op: '', np: '', cnp: '' });
        } catch (er) {
            alert(er.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="header">
                <h1>Change Password</h1>
            </div>
            <div className="card" style={{ maxWidth: '480px', marginTop: '24px' }}>
                <h3>Update Your Password</h3>
                <form onSubmit={handleSubmit} method="POST">
                    <label htmlFor="op">Current Password</label>
                    <input
                        id="op"
                        type="password"
                        className="form-control mt-1 mb-3"
                        name="op"
                        value={form.op}
                        onChange={handleChange}
                        placeholder="Enter current password"
                    />
                    <label htmlFor="np">New Password</label>
                    <input
                        id="np"
                        type="password"
                        className="form-control mt-1 mb-3"
                        name="np"
                        value={form.np}
                        onChange={handleChange}
                        placeholder="Enter new password"
                    />
                    <label htmlFor="cnp">Confirm New Password</label>
                    <input
                        id="cnp"
                        type="password"
                        className="form-control mt-1 mb-3"
                        name="cnp"
                        value={form.cnp}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                    />
                    <div className="buttons">
                        <button
                            type="button"
                            className="cancel"
                            onClick={() => setForm({ op: '', np: '', cnp: '' })}
                        >
                            Clear
                        </button>
                        <button type="submit" className="submit" disabled={loading}>
                            {loading ? 'Updating…' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserChangePassword;
