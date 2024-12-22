import express from "express";
import { login, register } from "../Controllers/authcontroller.js";
import { authMiddleware, authorizeRoles } from "../Middleware/AuthMiddleware.js";
import { createProject, getAllproject, getAllUsers, getProjectById, getUserTasks, role, takeProject, updateProjectStatus } from "../Controllers/AdminController.js";

const router=express.Router();

router.post('/login',login);
router.post('/register',register)

router.post('/addProject',authMiddleware,authorizeRoles('admin'),createProject)
router.post('/takeProject/:id',authMiddleware,authorizeRoles('user'),takeProject)
router.post('/status/:id',authMiddleware,authorizeRoles('admin','user'),updateProjectStatus)
router.get('/Project',getAllproject)
router.get('/user',authMiddleware,authorizeRoles('admin','user'),getUserTasks)
router.get('/users',authMiddleware,authorizeRoles('admin'),getAllUsers)
router.get('/project/:id',authMiddleware,authorizeRoles('admin','user'),getProjectById)
router.get('/role',authMiddleware,authorizeRoles('admin','user'),role)
export default router