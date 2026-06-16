import axios from "axios";
import React, { useEffect, useState } from "react";

const Result = () => {
  const [data, setData] = useState([]);
  const userId = localStorage.getItem("id");

  const handlefetch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/exams/examinee-result/${userId}`
      );

      setData(
        Array.isArray(res.data.message)
          ? res.data.message
          : [res.data.message]
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlefetch();
  }, []);

  return (
    <div className="result-page">
      <div className="card result-card">
        <div className="card-body">
          <h3 className="fw-bold result-title">Examinee Result</h3>

          <div className="table-responsive result-table-wrapper">
            <table className="table table-bordered text-center result-table">
              <thead className="table-secondary">
                <tr>
                  <th>S.N</th>
                  <th>Exam Name</th>
                  <th>Your Name</th>
                  <th>Total Marks</th>
                  <th>Score</th>
                  <th>Passing Marks</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, i) => (
                  <tr key={item._id || i}>
                    <td>{i + 1}</td>
                    <td>{item.examId?.title}</td>
                    <td>{item.examineeId?.name || item.examineeId}</td>
                    <td>{item.totalMarks}</td>
                    <td>{item.score}</td>
                    <td>{item.passingMarks}</td>
                    <td>{item.status}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Result;