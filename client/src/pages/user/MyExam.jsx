import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

const MyExam = () => {
  const [data, setData] = useState([]);

  const handlefetch = async () => {
    const res = await axios.get("http://localhost:5000/api/exams/exams");
    setData(res.data);
  };

  useEffect(() => {
    handlefetch();
  }, []);

  return (
    <div className="card myexam-card">
      <div className="card-body">
        <h4>My Exams</h4>

        <div className="table-responsive myexam-table-wrapper">
          <table className="table table-bordered text-center myexam-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Exam Name</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.date}</td>
                  <td>{item.duration}</td>
                  <td>
                    <Link
                      className="btn btn-primary btn-sm"
                      to={`/userDashboard/getexams/${item._id}`}
                    >
                      Start
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MyExam;