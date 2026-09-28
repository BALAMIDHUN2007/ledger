import express from "express";
import {
  markAttendance,
  getAttendanceByCourse,
  getAttendanceByStudent,
} from "../controllers/attendanceController.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, allowRoles("admin", "teacher"), markAttendance);
router.get("/course/:courseId", protect, allowRoles("admin", "teacher"), getAttendanceByCourse);
router.get("/student/:studentId", protect, getAttendanceByStudent);

export default router;
