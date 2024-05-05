import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
// Create a new user and save it to the database and save token in cookie
const newUser = async (req, res) => {
  const { name, username, password, bio } = req.body;

  // const file = req.file;

  // if (!file) return next(new ErrorHandler("Please Upload Avatar"));

  // const result = await uploadFilesToCloudinary([file]);

  // const avatar = {
  //   public_id: result[0].public_id,
  //   url: result[0].url,
  // };
  const avatar = {
    public_id: "uisdgf",
    url: "kjsdbd",
  };

  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

  // res.status(201).json({
  //   message: "User created successfully",
  // });
  sendToken(res, user, 201, "user created");
};

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

  const isMatch = await compare(password, user.password);

  if (!isMatch)
    return next(new ErrorHandler("Invalid Username or Password", 404));

  sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

const getMyProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user);

  // if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});
const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("pigeon-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "logged out successfully",
    });
});

export { login, newUser, getMyProfile, logout };
