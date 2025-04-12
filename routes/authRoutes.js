import express from "express";
import {
  adminLogin,
  userLogin,
  registerUser,
  getCurrentUser,
  fetchSupervisor,
} from "../controllers/adminController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const authRouter = express.Router();

// Auth routes
authRouter.post("/admin/login", adminLogin);
authRouter.post("/user/login", userLogin);
authRouter.get("/supervisors",auth,adminAuth,fetchSupervisor)
// Protected routes
authRouter.post("/register",auth, adminAuth, registerUser);
authRouter.get("/me", auth, getCurrentUser);

export default authRouter;

// import express from "express";
// import { adminLogin, userLogin } from "../controllers/adminController.js";

// const loginRouter = express.Router();

// loginRouter.post("/admin", adminLogin);
// loginRouter.post("/local", userLogin);

// export default loginRouter;
