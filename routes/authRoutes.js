import express from "express";
import {
  adminLogin,
  userLogin,
  registerUser,
  getCurrentUser,
  fetchSupervisor,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const authRouter = express.Router();

// Auth routes
authRouter.post("/admin/login", adminLogin);
authRouter.post("/user/login", userLogin);
authRouter.get("/supervisors", auth, adminAuth, fetchSupervisor);


// Update user
authRouter.put("/user/:id",auth, adminAuth, updateUser);
// Delete user
authRouter.delete("/user/:id",auth, adminAuth, deleteUser);
// Protected routes
authRouter.post("/register", auth, adminAuth, registerUser);

authRouter.get("/me", auth, getCurrentUser);

export default authRouter;

// import express from "express";
// import { adminLogin, userLogin } from "../controllers/adminController.js";

// const loginRouter = express.Router();

// loginRouter.post("/admin", adminLogin);
// loginRouter.post("/local", userLogin);

// export default loginRouter;
