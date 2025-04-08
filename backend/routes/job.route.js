import express from 'express';
import { postJob, getAdminJobs, getAllJobs, getJobById } from '../controllers/job.controller.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();    

router.post("/post", isAuthenticated, postJob);
router.get("/get", isAuthenticated, getAllJobs);
router.get("/getadminjobs", isAuthenticated, getAdminJobs);
router.get("/get/:id", isAuthenticated, getJobById);

export default router;