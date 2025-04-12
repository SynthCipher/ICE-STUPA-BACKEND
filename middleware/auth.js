import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

// Regular authentication middleware
export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle special case for environment variable admin
    if (decoded.userId === "admin-env") {
      req.user = {
        _id: "admin-env",
        fullName: "System Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin"
      };
      return next();
    }
    
    // Find user by id for database users
    const user = await userModel.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active
    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Admin authentication middleware
export const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // User is admin, proceed
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authorization check'
    });
  }
};

// Supervisor authentication middleware
export const supervisorAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has supervisor role or admin role (admins can access supervisor routes)
    if (req.user.role !== 'supervisor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Supervisor or admin access required'
      });
    }

    // User is supervisor or admin, proceed
    next();
  } catch (error) {
    console.error('Supervisor auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authorization check'
    });
  }
};