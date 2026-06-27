import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Examinee = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    college: '',
    course: '',
    branch: '',
    phone: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editFormVisible, setEditFormVisible] = useState(false);

  useEffect(() => {
    handlefetch();
  }, []);

  const handlefetch = async () => {
    const res = await axios.get('https://exam-prep-1v8x.onrender.com/api/examinee');
    setData(res.data);
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(`https://exam-prep-1v8x.onrender.com/api/examinee/${id}`);
    if (res) {
      alert("Deleted Successfully");
    } else {
      alert("Try Again Later");
    }
    handlefetch();
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      email: item.email,
      college: item.college,
      course: item.course,
      branch: item.branch,
      phone: item.phone,
    });
    setEditingId(item._id);
    setEditFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await axios.put(`https://exam-prep-1v8x.onrender.com/api/examinee/${editingId}`, form);
      alert('Examinee Updated Successfully');
      setForm({
        name: '',
         email: '',
        college: '',
        course: '',
        branch: '',
       phone: ''
      });
      setEditingId(null);
      setEditFormVisible(false);
      handlefetch();
    } catch (error) {
      console.error("Error updating examinee:", error);
      alert("Error updating examinee");
    }
  };

  return (
    <>
     <div className='container-fluid p-0'>
       {editFormVisible && (
       <div className="card" style={{ border: "1px solid #6f42c1", width: "100%" }}>
          <div className="card-body">
            <h3 className="fw-bold" style={{ color: "#6f42c1" }}>Edit Examinee</h3>
            <form className="border p-3 rounded" onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-sm-4">
                  <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
                </div>
                <div className="col-sm-4">
                  <input className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                </div>
                <div className="col-sm-4">
                  <input className="form-control" name="college" value={form.college} onChange={handleChange} placeholder="College" required />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-sm-4">
                  <input className="form-control" name="course" value={form.course} onChange={handleChange} placeholder="Course" />
                </div>
                <div className="col-sm-4">
                  <input className="form-control" name="branch" value={form.branch} onChange={handleChange} placeholder="Branch" />
                </div>
                <div className="col-sm-4">
                  <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-light text-white mb-1 me-2" style={{ background: "#39064fff " }}>Update</button>
                <button type="button" className="btn-edit mb-1" onClick={() => setEditFormVisible(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card mx-auto mt-2" style={{ border: "1px solid #6f42c1", width: "100%" }}>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="fw-bold" style={{ color: "#6f42c1" }}>Examinee Details</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="table-responsive examinee-table-wrapper">
  <table className="table table-bordered text-center examinee-table">
                <thead className="thead-light-purple">
                  <tr>
                    <th>S.No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>College</th>
                    <th>Course</th>
                    <th>Branch</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr key={item._id }>
                      <td>{i + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.college}</td>
                      <td>{item.course}</td>
                      <td>{item.branch}</td>
                      <td>{item.phone}</td>
                      <td>
                        <button className="btn-edit me-2" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
    </>
  );
};

export default Examinee;