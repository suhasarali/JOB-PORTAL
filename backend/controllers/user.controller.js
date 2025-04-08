import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res
        .status(400)
        .json({ msg: "Please fill all the fields", success: false });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "User already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res
      .status(201)
      .json({ msg: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ msg: "Please fill all the fields", success: false });
    };

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User does not exist", success: false });
    }
    const ispasswordMatch = await bcrypt.compare(password, user.password);
    if (!ispasswordMatch) {
      return res
        .status(400)
        .json({ msg: "Invalid credentials", success: false });
    }
    //check role is correct
    if (role !== user.role) {
      return res
        .status(400)
        .json({ msg: "Invalid credentials", success: false });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token)
      .json({ msg: "Login successful", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token")
      .json({ msg: "Logout successful", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    //cloudinary 
    let skillsArray;
    if(skills){
        skillsArray = skills.split(",");
    };
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User does not exist", success: false });
    }
     // updating data
     if(fullname) user.fullname = fullname
     if(email) user.email = email
     if(phoneNumber)  user.phoneNumber = phoneNumber
     if(bio) user.profile.bio = bio
     if(skills) user.profile.skills = skillsArray

    await user.save();
    
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    }

    return res
      .status(200)
      .json({ msg: "Profile updated successfully", user, success: true });
  } catch (error) {
    console.log(error);
  }
};
