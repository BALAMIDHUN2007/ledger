import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import AppLayout from "../components/AppLayout.jsx";

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [newCourse, setNewCourse] = useState({ name: "", code: "", department: "" });
  const [enrollPicks, setEnrollPicks] = useState({}); // courseId -> studentId

  const loadCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data.courses);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load courses");
    }
  };

  const loadStudents = async () => {
    if (user.role !== "admin" && user.role !== "teacher") return;
    try {
      const { data } = await api.get("/students");
      setStudents(data.students);
    } catch {
      // non-fatal, enroll UI just won't populate
    }
  };

  useEffect(() => {
    loadCourses();
    loadStudents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/courses", newCourse);
      setNewCourse({ name: "", code: "", department: "" });
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create course");
    }
  };

  const handleEnroll = async (courseId) => {
    const studentId = enrollPicks[courseId];
    if (!studentId) return;
    try {
      await api.post(`/courses/${courseId}/enroll`, { studentId });
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Could not enroll student");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete course");
    }
  };

  return (
    <AppLayout>
      <header className="page-header">
        <h1>Courses</h1>
        <p className="page-subtitle">{courses.length} courses offered</p>
      </header>

      {error && <p className="form-error">{error}</p>}

      {user.role === "admin" && (
        <form className="inline-form" onSubmit={handleCreate}>
          <input
            placeholder="Course name"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            required
          />
          <input
            placeholder="Code (e.g. CS101)"
            value={newCourse.code}
            onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            required
          />
          <input
            placeholder="Department"
            value={newCourse.department}
            onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary btn-compact">
            Add course
          </button>
        </form>
      )}

      <div className="card-grid">
        {courses.map((c) => (
          <article key={c._id} className="course-card">
            <div className="course-card-head">
              <h3>{c.name}</h3>
              <span className="course-code">{c.code}</span>
            </div>
            <p className="course-meta">
              {c.department} · {c.students?.length || 0} enrolled
            </p>
            <p className="course-meta">
              Teacher: {c.teacher?.name || "Unassigned"}
            </p>

            {(user.role === "admin" || user.role === "teacher") && (
              <div className="enroll-row">
                <select
                  value={enrollPicks[c._id] || ""}
                  onChange={(e) =>
                    setEnrollPicks({ ...enrollPicks, [c._id]: e.target.value })
                  }
                >
                  <option value="">Enroll a student...</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.user?.name} ({s.rollNumber})
                    </option>
                  ))}
                </select>
                <button className="btn-link" onClick={() => handleEnroll(c._id)}>
                  Enroll
                </button>
              </div>
            )}

            {user.role === "admin" && (
              <button
                className="btn-link btn-link--danger"
                onClick={() => handleDelete(c._id)}
              >
                Delete course
              </button>
            )}
          </article>
        ))}
        {courses.length === 0 && <p className="empty-row">No courses yet.</p>}
      </div>
    </AppLayout>
  );
};

export default Courses;
