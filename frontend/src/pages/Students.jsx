import { useEffect, useState } from "react";
import api from "../api/axios.js";
import AppLayout from "../components/AppLayout.jsx";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // student being edited
  const [form, setForm] = useState({ rollNumber: "", department: "", year: 1 });

  const loadStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data.students);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load students");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const startEdit = (student) => {
    setEditing(student._id);
    setForm({
      rollNumber: student.rollNumber,
      department: student.department,
      year: student.year,
    });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/students/${id}`, form);
      setEditing(null);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update student");
    }
  };

  const removeStudent = async (id) => {
    if (!window.confirm("Remove this student and their account?")) return;
    try {
      await api.delete(`/students/${id}`);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete student");
    }
  };

  return (
    <AppLayout>
      <header className="page-header">
        <h1>Student roster</h1>
        <p className="page-subtitle">{students.length} students on record</p>
      </header>

      {error && <p className="form-error">{error}</p>}

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll no.</th>
            <th>Department</th>
            <th>Year</th>
            <th>Courses</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.user?.name}</td>
              <td>
                {editing === s._id ? (
                  <input
                    value={form.rollNumber}
                    onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                  />
                ) : (
                  s.rollNumber
                )}
              </td>
              <td>
                {editing === s._id ? (
                  <input
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  />
                ) : (
                  s.department
                )}
              </td>
              <td>
                {editing === s._id ? (
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                ) : (
                  s.year
                )}
              </td>
              <td>{s.courses?.map((c) => c.code).join(", ") || "—"}</td>
              <td className="row-actions">
                {editing === s._id ? (
                  <>
                    <button className="btn-link" onClick={() => saveEdit(s._id)}>
                      Save
                    </button>
                    <button className="btn-link" onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-link" onClick={() => startEdit(s)}>
                      Edit
                    </button>
                    <button
                      className="btn-link btn-link--danger"
                      onClick={() => removeStudent(s._id)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={6} className="empty-row">
                No students registered yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AppLayout>
  );
};

export default Students;
