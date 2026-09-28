import Course from "../models/Course.js";
import Student from "../models/Student.js";

// POST /api/courses
export const createCourse = async (req, res) => {
  try {
    const { name, code, department, teacher } = req.body;
    const existing = await Course.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Course code already exists" });
    }
    const course = await Course.create({ name, code, department, teacher });
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
};

// GET /api/courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email")
      .populate("students", "rollNumber");
    res.status(200).json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

// GET /api/courses/:id
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email")
      .populate({
        path: "students",
        populate: { path: "user", select: "name email" },
      });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};

// PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const { name, department, teacher } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, department, teacher },
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
};

// DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
};

// POST /api/courses/:id/enroll  { studentId }
export const enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await course.save();
    }
    if (!student.courses.includes(course._id)) {
      student.courses.push(course._id);
      await student.save();
    }

    res.status(200).json({ message: "Student enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling student", error: error.message });
  }
};
