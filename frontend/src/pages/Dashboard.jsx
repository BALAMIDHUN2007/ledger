import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import AppLayout from "../components/AppLayout.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: null, courses: null, departments: 0 });
  const [error, setError] = useState("");
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const courseRes = await api.get("/courses");
        const courses = courseRes.data.courses || [];
        let studentCount = null;
        let departmentSet = new Set();

        if (user.role === "admin" || user.role === "teacher") {
          const studentRes = await api.get("/students");
          const students = studentRes.data.students || [];
          studentCount = studentRes.data.count;
          students.forEach((student) => {
            if (student.department) departmentSet.add(student.department);
          });
        }

        const activeCourses = courses.filter((course) => (course.students || []).length > 0).length;
        const attendanceFocus = courses.length ? Math.round((activeCourses / courses.length) * 100) : 0;

        setStats({
          students: studentCount,
          courses: courseRes.data.count,
          departments: departmentSet.size,
          engagement: attendanceFocus,
        });

        const lessonCards = [
          {
            label: "Courses running",
            value: courseRes.data.count,
            tone: "gold",
            detail: "Updated from the latest course roster",
          },
          {
            label: "Student records",
            value: studentCount ?? "—",
            tone: "slate",
            detail: user.role === "student" ? "Your academic profile" : "Total learners enrolled",
          },
          {
            label: "Enrollment health",
            value: `${attendanceFocus}%`,
            tone: "maroon",
            detail: "Courses with at least one active enrollment",
          },
        ];

        setHighlights(lessonCards);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard data");
      }
    };
    loadStats();
  }, [user.role]);

  const actions = [
    {
      title: "Review academic records",
      text: user.role === "student" ? "Track your weekly attendance and course activity." : "Monitor students, departments, and active rosters.",
      link: user.role === "student" ? "/attendance" : "/students",
    },
    {
      title: "Update course details",
      text: "Add new offerings, manage enrollment, and keep course information current.",
      link: "/courses",
    },
    {
      title: "View reports",
      text: "Use the summary view to spot attendance and course trends faster.",
      link: "/reports",
    },
  ];

  return (
    <AppLayout>
      <header className="page-header page-header--split">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{user.name.split(" ")[0]}'s dashboard</h1>
        </div>
        <div className="header-chip">{user.role}</div>
      </header>

      {error && <p className="form-error">{error}</p>}

      <section className="stat-grid">
        {highlights.map((card) => (
          <div key={card.label} className={`stat-block stat-block--${card.tone}`}>
            <p className="stat-label">{card.label}</p>
            <p className="stat-figure">{card.value}</p>
            <p className="stat-caption">{card.detail}</p>
          </div>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel panel--large">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Operations</p>
              <h2>What you can do next</h2>
            </div>
          </div>

          <div className="action-list">
            {actions.map((action) => (
              <a key={action.title} className="action-card" href={action.link}>
                <strong>{action.title}</strong>
                <span>{action.text}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Guidance</p>
              <h2>Priority checklist</h2>
            </div>
          </div>

          <ul className="check-list">
            {(user.role === "admin" || user.role === "teacher") && (
              <li>Review the student roster and keep records current.</li>
            )}
            <li>Browse courses and confirm enrollment details are up to date.</li>
            {(user.role === "admin" || user.role === "teacher") && (
              <li>Mark daily attendance for any active course session.</li>
            )}
            {user.role === "student" && (
              <li>Check your attendance percentage and course participation.</li>
            )}
            <li>Use the reports panel to catch patterns before the next class.</li>
          </ul>
        </div>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
