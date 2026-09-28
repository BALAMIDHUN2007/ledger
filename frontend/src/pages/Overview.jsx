import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import AppLayout from "../components/AppLayout.jsx";

const Overview = () => {
  const [summary, setSummary] = useState({
    students: 0,
    courses: 0,
    departments: 0,
    engagement: 0,
  });
  const [coursePulse, setCoursePulse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const [courseRes, studentRes] = await Promise.all([
          api.get("/courses"),
          api.get("/students"),
        ]);

        const courses = courseRes.data.courses || [];
        const students = studentRes.data.students || [];
        const departmentSet = new Set(students.map((student) => student.department).filter(Boolean));

        const activeCourses = courses.filter((course) => (course.students || []).length > 0).length;
        const engagement = courses.length
          ? Math.round((activeCourses / courses.length) * 100)
          : 0;

        setSummary({
          students: students.length,
          courses: courses.length,
          departments: departmentSet.size,
          engagement,
        });

        setCoursePulse(
          courses
            .slice()
            .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
            .slice(0, 4)
            .map((course) => ({
              id: course._id,
              name: course.name,
              code: course.code,
              enrolled: course.students?.length || 0,
            }))
        );
      } catch (error) {
        console.error("Overview failed to load:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const highlights = useMemo(
    () => [
      {
        title: "Enrollment coverage",
        value: `${summary.engagement}%`,
        detail: `${summary.students} students across ${summary.courses} active courses`,
      },
      {
        title: "Departments",
        value: `${summary.departments}`,
        detail: "Academic units represented in the system",
      },
      {
        title: "Active rosters",
        value: `${activeCourseTotal(coursePulse)}`,
        detail: "Courses with at least one enrolled learner",
      },
    ],
    [coursePulse, summary]
  );

  return (
    <AppLayout>
      <header className="page-header">
        <div>
          <p className="eyebrow">Campus overview</p>
          <h1>Academic operations at a glance</h1>
        </div>
        <p className="page-subtitle">
          Track enrollment, coverage, and how engaged each learning group is this term.
        </p>
      </header>

      {loading ? (
        <p className="empty-row">Loading overview...</p>
      ) : (
        <>
          <section className="stat-grid stat-grid--wide">
            {highlights.map((item) => (
              <div className="stat-block stat-block--feature" key={item.title}>
                <p className="stat-label">{item.title}</p>
                <p className="stat-figure">{item.value}</p>
                <p className="stat-caption">{item.detail}</p>
              </div>
            ))}
          </section>

          <section className="content-grid">
            <div className="panel panel--large">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Top courses</p>
                  <h2>Enrollment pulse</h2>
                </div>
              </div>

              <div className="rank-list">
                {coursePulse.map((course, index) => (
                  <div className="rank-item" key={course.id}>
                    <div className="rank-number">0{index + 1}</div>
                    <div className="rank-copy">
                      <strong>{course.name}</strong>
                      <span>{course.code}</span>
                    </div>
                    <div className="rank-meter">
                      <span style={{ width: `${Math.min((course.enrolled / Math.max(summary.students, 1)) * 100, 100)}%` }} />
                    </div>
                    <div className="rank-value">{course.enrolled} students</div>
                  </div>
                ))}

                {coursePulse.length === 0 && <p className="empty-row">No course performance data available yet.</p>}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Operations</p>
                  <h2>Quick notes</h2>
                </div>
              </div>

              <ul className="note-list">
                <li>
                  <span className="dot dot--gold" />
                  Review the student ledger before weekly mentorship meetings.
                </li>
                <li>
                  <span className="dot dot--maroon" />
                  Keep attendance tracking current for all active rosters.
                </li>
                <li>
                  <span className="dot dot--slate" />
                  Update course capacity and teaching assignments as needed.
                </li>
              </ul>
            </div>
          </section>
        </>
      )}
    </AppLayout>
  );
};

const activeCourseTotal = (coursePulse) => coursePulse.filter((course) => course.enrolled > 0).length;

export default Overview;
