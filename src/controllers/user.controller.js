import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplodeOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'

/* ==============================
   GENERATE TOKENS
============================== */
const generateAccessRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found for token generation");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.log("TOKEN ERROR:", error);

        throw new ApiError(
            500,
            "something went wrong while generating access and refresh tokens"
        );
    }
};

/* ==============================
   REGISTER USER
============================== */
const registerUser = asyncHandler(async (req, res) => {

    // get user details from frontend 
    const { fullName, email, username, password } = req.body;

    // validation - not empty
    if (
        [fullName, email, username, password].some(
            (field) => !field || field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // check user already exists: username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "user with email or username already exist"
        );
    }

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    let coverImageLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // uplode them to cloudinary
    const avatar = await uplodeOnCloudinary(avatarLocalPath);
    const coverImage = await uplodeOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // check for user creation
    if (!createdUser) {
        throw new ApiError(
            500,
            "something went wrong while registering the user"
        );
    }

    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    );
});

/* ==============================
   LOGIN USER
============================== */
const loginUser = asyncHandler(async (req, res) => {

    console.log("LOGIN BODY:", req.body);

    const { email, username, password } = req.body;

    // username or email
    if (!(username || email)) {
        throw new ApiError(400, "username or passward is required");
    }

    // find the user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(400, "User doesnot exist");
    }

    // password check
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // access and refresh token
    const { accessToken, refreshToken } =
        await generateAccessRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // send cookie
const options = {
    httpOnly: true,
    secure: false, // localhost fix
    sameSite: "lax",
    path: "/"
};

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "user logged In Successfully"
            )
        );
});


/* ==============================
   LOGOUT USER
============================== */
const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    );

    const options = {
        httpOnly: true,
        secure: false, // 🔥 IMPORTANT for localhost
        sameSite: "lax",
        path: "/"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            message: "User logged out successfully"
        });
});

const refreshAcessToken=asyncHandler(async(req,res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
   }

  try {
     const decodedToken=jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
     )
  
     const user=await User.findById(decodedToken?._id)
  
        if(!user){
      throw new ApiError(401,"Invalid refresh token")
     }
  
     if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401,"Refresh token is expired or used")
     }
  
     const options={
      httpOnly:true,
      secure:true
     }
  
     const {accessToken, newRefreshToken}=await generateAccessRefreshTokens(user._id)
  
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newRefreshToken,options)
     .json(
      new ApiResponse(
          200,
          {accessToken, refreshToken: newRefreshToken},
          "Access token refreshed"
          
      )
  
      
     )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAcessToken
};