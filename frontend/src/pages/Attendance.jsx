import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import AppLayout from "../components/AppLayout.jsx";

const canMark = (role) => role === "admin" || role === "teacher";

const Attendance = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [roster, setRoster] = useState([]);
  const [marks, setMarks] = useState({}); // studentId -> status
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [myRecords, setMyRecords] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (canMark(user.role)) {
          const { data } = await api.get("/courses");
          setCourses(data.courses);
        } else {
          const { data: profile } = await api.get("/students/me/profile");
          const { data } = await api.get(`/attendance/student/${profile.student._id}`);
          setMyRecords(data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Could not load attendance data");
      }
    };
    init();
  }, [user.role]);

  const loadRoster = async (courseId) => {
    setSelectedCourse(courseId);
    setMessage("");
    if (!courseId) {
      setRoster([]);
      return;
    }
    try {
      const { data } = await api.get(`/courses/${courseId}`);
      setRoster(data.course.students || []);
      const initialMarks = {};
      (data.course.students || []).forEach((s) => (initialMarks[s._id] = "present"));
      setMarks(initialMarks);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load course roster");
    }
  };

  const submitAttendance = async () => {
    try {
      const records = Object.entries(marks).map(([studentId, status]) => ({
        studentId,
        status,
      }));
      await api.post("/attendance", { courseId: selectedCourse, records });
      setMessage("Attendance saved for today.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save attendance");
    }
  };

  if (!canMark(user.role)) {
    return (
      <AppLayout>
        <header className="page-header">
          <h1>Your attendance</h1>
          <p className="page-subtitle">A running record across all your courses.</p>
        </header>

        {error && <p className="form-error">{error}</p>}

        {myRecords && (
          <>
            <div className="stat-grid">
              <div className="stat-block">
                <p className="stat-figure">{myRecords.percentage}%</p>
                <p className="stat-label">Overall attendance</p>
              </div>
              <div className="stat-block">
                <p className="stat-figure">{myRecords.present}</p>
                <p className="stat-label">Sessions present</p>
              </div>
              <div className="stat-block">
                <p className="stat-figure">{myRecords.total}</p>
                <p className="stat-label">Sessions recorded</p>
              </div>
            </div>

            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myRecords.records.map((r) => (
                  <tr key={r._id}>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.course?.name} ({r.course?.code})</td>
                    <td className={`status-${r.status}`}>{r.status}</td>
                  </tr>
                ))}
                {myRecords.records.length === 0 && (
                  <tr>
                    <td colSpan={3} className="empty-row">
                      No attendance recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <header className="page-header">
        <h1>Mark attendance</h1>
        <p className="page-subtitle">Pick a course and record today's session.</p>
      </header>

      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}

      <select value={selectedCourse} onChange={(e) => loadRoster(e.target.value)}>
        <option value="">Select a course...</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} ({c.code})
          </option>
        ))}
      </select>

      {roster.length > 0 && (
        <>
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll no.</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((s) => (
                <tr key={s._id}>
                  <td>{s.user?.name || s.rollNumber}</td>
                  <td>{s.rollNumber}</td>
                  <td>
                    <input
                      type="radio"
                      name={`status-${s._id}`}
                      checked={marks[s._id] === "present"}
                      onChange={() => setMarks({ ...marks, [s._id]: "present" })}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      name={`status-${s._id}`}
                      checked={marks[s._id] === "absent"}
                      onChange={() => setMarks({ ...marks, [s._id]: "absent" })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-primary" onClick={submitAttendance}>
            Save attendance
          </button>
        </>
      )}
      {selectedCourse && roster.length === 0 && (
        <p className="empty-row">No students enrolled in this course yet.</p>
      )}
    </AppLayout>
  );
};

export default Attendance;
