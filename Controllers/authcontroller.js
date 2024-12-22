import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';
// Register Function
export const register = async (req, res) => {
  const { name, email, password, role } = req.body; // Destructure role from request

  try {
    // Input validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required."
      });
    }

    // Validate role
    if (role !== "user" && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'user' or 'admin'."
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists."
      });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role, // Save role in the database
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};
// Login Function
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }); // Case-insensitive email check

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "User not found or password is missing."
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials. Password is incorrect."
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // Include 'role' here
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};
