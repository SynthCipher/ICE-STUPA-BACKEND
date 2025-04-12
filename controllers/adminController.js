import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import userModel from "../model/userModel.js";
import siteModel from "../model/siteModel.js";
import mongoose from "mongoose";

// Create JWT Token with expiry
const createToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

// Admin Login API
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("Admin login attempt:", email);

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    // First check if admin exists in the database (for upgraded admins)
    const adminUser = await userModel.findOne({ email, role: "admin" });

    if (adminUser) {
      // Compare password for database admin
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (isMatch) {
        const token = createToken(adminUser._id);

        // Update last login time
        adminUser.lastLogin = new Date();
        await adminUser.save();

        return res.json({
          success: true,
          token,
          user: {
            _id: adminUser._id,
            fullName: adminUser.fullName,
            email: adminUser.email,
            role: adminUser.role,
          },
          message: "Login successful",
        });
      }
    }

    // Fall back to environment variable check for legacy admin
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate a token for the environment variable admin
      const token = jwt.sign(
        { userId: "admin-env", role: "admin" },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        success: true,
        token,
        user: {
          _id: "admin-env",
          fullName: "System Admin",
          email: process.env.ADMIN_EMAIL,
          role: "admin",
        },
        message: "Login successful",
      });
    }

    // If no credentials match
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// User/Supervisor Login API
const userLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if username and password are provided
    if (!userName || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing username or password" });
    }

    // Check if user exists
    const user = await userModel.findOne({ userName });
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User does not exist. Please check your username or contact an administrator.",
      });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create token if password matches
    const token = createToken(user._id);

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("User login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin/Supervisor Registration API (admin only)
const registerUser = async (req, res) => {
  try {
    const { fullName, userName, email, password, phone, location, role } =
      req.body;

    // Validate required fields
    if (!fullName || !userName || !password || !phone || !location || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate role (must be either supervisor or admin)
    if (role !== "supervisor" && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    // Check if username already exists
    const existingUser = await userModel.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // If email is provided, check if it's already in use
    if (email) {
      const existingEmail = await userModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      fullName,
      userName,
      email: email || "",
      password: hashedPassword,
      phone,
      location,
      role,
      isLocal: true,
      createdBy: req.user._id, // Store which admin created this user
    });

    await newUser.save();

    // Return success without sending back password
    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      phone: newUser.phone,
      email: newUser.email,
      location: newUser.location,
      role: newUser.role,
      isLocal: newUser.isLocal,
    };

    res.status(201).json({
      success: true,
      message: `${
        role === "admin" ? "Admin" : "Local supervisor"
      } registered successfully`,
      user: userResponse,
    });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// fetching all user
const fetchSupervisor = async (req, res) => {
  try {
    const users = await userModel.find({ role: "supervisor" });
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Site Registration API with Cloudinary image upload
const registerSite = async (req, res) => {
  try {
    const {
      siteName,
      location,
      latitude,
      longitude,
      altitude,
      siteDescription,
      contactPerson,
      contactPhone,
      siteStatus,
      supervisorId,
      beneficiaries,
      established,
      waterCapacity,
      country,
    } = req.body;

    // Validate required fields
    if (!siteName || !location) {
      return res.status(400).json({
        success: false,
        message: "Site name and location are required",
      });
    }

    // Check if site already exists
    const existingSite = await siteModel.findOne({ siteName });
    if (existingSite) {
      return res.status(400).json({
        success: false,
        message: "Site with this name already exists",
      });
    }

    // Handle image upload to Cloudinary if provided
    let siteImageUrl = "";

    if (req.file) {
      // Configure cloudinary
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
      });

      // Upload image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "ice-stupa-sites",
        use_filename: true,
        unique_filename: true,
      });

      siteImageUrl = result.secure_url;
    }

    // Create new site
    const newSite = new siteModel({
      siteName,
      location,
      coordinates: {
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        altitude: altitude ? parseFloat(altitude) : null,
      },
      siteDescription: siteDescription || "",
      contactPerson: contactPerson || "",
      contactPhone: contactPhone || "",
      siteImage: siteImageUrl,
      siteStatus: siteStatus || "inactive",
      beneficiaries,
      established,
      waterCapacity,
      country,

      // To handle both cases:
      createdBy:
        req.user.role === "admin-env"
          ? mongoose.Types.ObjectId(process.env.DEFAULT_ADMIN_ID)
          : req.user._id,
      supervisorId,
      // : req.user.role === "supervisor" ? req.user._id : null,
    });

    await newSite.save();

    res.status(201).json({
      success: true,
      message: "Site registered successfully",
      site: newSite,
    });
  } catch (error) {
    console.error("Register site error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during site registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user profile",
    });
  }
};
// API for Getting all locations
const allSites = async (req, res) => {
  try {
    const locationData = await siteModel.find({});

    res.json({
      success: true,
      locationData,
      message: "Successfully retrieved all locations",
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching locations",
    });
  }
};

// Update Site API with Cloudinary image upload
const updateSite = async (req, res) => {
  try {
    const { id } = req.params; // Get site ID from URL parameter

    // Check if site exists
    const existingSite = await siteModel.findById(id);
    if (!existingSite) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    // Check if user has permission to update this site
    if (
      !req.user.isAdmin &&
      existingSite.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this site",
      });
    }

    // Extract form data
    const {
      siteName,
      location,
      country,
      siteDescription,
      contactPerson,
      contactPhone,
      siteStatus,
      supervisorId,
      beneficiaries,
      established,
      waterCapacity,
      active,
    } = req.body;

    // Handle coordinates
    const coordinates = {
      latitude: req.body["coordinates[latitude]"]
        ? parseFloat(req.body["coordinates[latitude]"])
        : existingSite.coordinates.latitude,
      longitude: req.body["coordinates[longitude]"]
        ? parseFloat(req.body["coordinates[longitude]"])
        : existingSite.coordinates.longitude,
      altitude: req.body["coordinates[altitude]"]
        ? parseFloat(req.body["coordinates[altitude]"])
        : existingSite.coordinates.altitude,
    };

    // Handle image upload to Cloudinary if provided
    let siteImageUrl = existingSite.siteImage;

    if (req.file) {
      // Configure cloudinary
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
      });

      // Upload new image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "ice-stupa-sites",
        use_filename: true,
        unique_filename: true,
      });

      siteImageUrl = result.secure_url;

      // Delete previous image if exists
      if (
        existingSite.siteImage &&
        existingSite.siteImage.includes("cloudinary")
      ) {
        // Extract public ID from the URL
        const publicId = existingSite.siteImage.split("/").pop().split(".")[0];
        if (publicId) {
          await cloudinary.v2.uploader.destroy(`ice-stupa-sites/${publicId}`);
        }
      }
    } else if (req.body.siteImage === "") {
      // If siteImage is explicitly set to empty string, remove the image
      siteImageUrl = "";

      // Delete previous image if exists
      if (
        existingSite.siteImage &&
        existingSite.siteImage.includes("cloudinary")
      ) {
        // Extract public ID from the URL
        const publicId = existingSite.siteImage.split("/").pop().split(".")[0];
        if (publicId) {
          await cloudinary.v2.uploader.destroy(`ice-stupa-sites/${publicId}`);
        }
      }
    }

    // Update site data
    const updatedSite = await siteModel.findByIdAndUpdate(
      id,
      {
        siteName: siteName || existingSite.siteName,
        location: location || existingSite.location,
        country: country || existingSite.country,
        coordinates,
        siteDescription:
          siteDescription !== undefined
            ? siteDescription
            : existingSite.siteDescription,
        contactPerson:
          contactPerson !== undefined
            ? contactPerson
            : existingSite.contactPerson,
        contactPhone:
          contactPhone !== undefined ? contactPhone : existingSite.contactPhone,
        siteImage: siteImageUrl,
        siteStatus: siteStatus || existingSite.siteStatus,
        supervisorId:
          supervisorId !== undefined ? supervisorId : existingSite.supervisorId,
        beneficiaries:
          beneficiaries !== undefined
            ? parseInt(beneficiaries)
            : existingSite.beneficiaries,
        established: established || existingSite.established,
        waterCapacity:
          waterCapacity !== undefined
            ? parseInt(waterCapacity)
            : existingSite.waterCapacity,
        active:
          active !== undefined
            ? active === "true" || active === true
            : existingSite.active,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Site updated successfully",
      site: updatedSite,
    });
  } catch (error) {
    console.error("Update site error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during site update",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete Site API with Cloudinary image cleanup
const deleteSite = async (req, res) => {
  try {
    const { id } = req.params; // Get site ID from URL parameter

    // Check if site exists
    const existingSite = await siteModel.findById(id);
    if (!existingSite) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    // Check if user has permission to delete this site
    if (
      !req.user.isAdmin &&
      existingSite.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this site",
      });
    }

    // If site has an image stored in Cloudinary, delete it
    if (
      existingSite.siteImage &&
      existingSite.siteImage.includes("cloudinary")
    ) {
      // Configure cloudinary
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
      });

      // Extract public ID from the URL
      const publicId = existingSite.siteImage.split("/").pop().split(".")[0];
      if (publicId) {
        try {
          await cloudinary.v2.uploader.destroy(`ice-stupa-sites/${publicId}`);
        } catch (cloudinaryError) {
          console.error(
            "Error deleting image from Cloudinary:",
            cloudinaryError
          );
          // Continue with site deletion even if image deletion fails
        }
      }
    }

    // Delete the site
    await siteModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Site deleted successfully",
    });
  } catch (error) {
    console.error("Delete site error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during site deletion",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


export {
  userLogin,
  adminLogin,
  registerUser,
  registerSite,
  getCurrentUser,
  fetchSupervisor,
  allSites,
  updateSite,
  deleteSite,
  
};
