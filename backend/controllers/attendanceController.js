import Attendance from "../models/Attendance.js";

// POST /api/attendance  { courseId, records: [{ studentId, status }], date }
export const markAttendance = async (req, res) => {
  try {
    const { courseId, records, date } = req.body;

    if (!courseId || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "courseId and records are required" });
    }

    const attendanceDate = date ? new Date(date) : new Date();

    const entries = await Promise.all(
      records.map(({ studentId, status }) =>
        Attendance.findOneAndUpdate(
          {
            course: courseId,
            student: studentId,
            date: attendanceDate,
          },
          {
            course: courseId,
            student: studentId,
            date: attendanceDate,
            status,
            markedBy: req.user.id,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    res.status(201).json({ message: "Attendance recorded", entries });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error: error.message });
  }
};

// GET /api/attendance/course/:courseId
export const getAttendanceByCourse = async (req, res) => {
  try {
    const records = await Attendance.find({ course: req.params.courseId })
      .populate({ path: "student", populate: { path: "user", select: "name" } })
      .sort({ date: -1 });
    res.status(200).json({ count: records.length, records });
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
};

// GET /api/attendance/student/:studentId
export const getAttendanceByStudent = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId })
      .populate("course", "name code")
      .sort({ date: -1 });

    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    res.status(200).json({ total, present, percentage, records });
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
};
