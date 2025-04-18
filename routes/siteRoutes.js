import express from "express";
import {
  allSites,
  deleteSite,
  fetchAllUser,
  registerSite,
  sendContactEmail,
  updateSite,
} from "../controllers/adminController.js";
import { auth, supervisorAuth } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const siteRouter = express.Router();

// Site registration route with image upload
siteRouter.post(
  "/register",
  auth,
  supervisorAuth,
  upload.single("siteImage"),
  registerSite
);

siteRouter.get("/info", allSites);
siteRouter.put("/:id", auth, upload.single("siteImage"), updateSite);
siteRouter.delete("/:id", auth, deleteSite);
siteRouter.post("/send", sendContactEmail);
siteRouter.get("/allUser", auth, fetchAllUser);

export default siteRouter;
