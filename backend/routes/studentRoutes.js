import express from "express";
import {
  getAllStudents,
  getMyStudentProfile,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, allowRoles("admin", "teacher"), getAllStudents);
router.get("/me/profile", protect, getMyStudentProfile);
router.get("/:id", protect, getStudentById);
router.put("/:id", protect, allowRoles("admin"), updateStudent);
router.delete("/:id", protect, allowRoles("admin"), deleteStudent);

export default router;
