import Student from "../models/Student.js";
import User from "../models/User.js";

// GET /api/students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "name email")
      .populate("courses", "name code");
    res.status(200).json({ count: students.length, students });
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};

// GET /api/students/me/profile
export const getMyStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate("user", "name email")
      .populate("courses", "name code");
    if (!student) return res.status(404).json({ message: "Student profile not found" });
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// GET /api/students/:id
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("user", "name email")
      .populate("courses", "name code");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error: error.message });
  }
};

// PUT /api/students/:id
export const updateStudent = async (req, res) => {
  
  try {
    const { department, year, rollNumber } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { department, year, rollNumber },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error: error.message });
  }
};

// DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Also remove the linked user account
    await User.findByIdAndDelete(student.user);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error: error.message });
  }
};
