import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollStudent,
} from "../controllers/courseController.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAllCourses);
router.get("/:id", protect, getCourseById);
router.post("/", protect, allowRoles("admin"), createCourse);
router.put("/:id", protect, allowRoles("admin"), updateCourse);
router.delete("/:id", protect, allowRoles("admin"), deleteCourse);
router.post("/:id/enroll", protect, allowRoles("admin", "teacher"), enrollStudent);

export default router;
