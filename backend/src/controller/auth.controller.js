import { upsertStreamUsers } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export async function signup(req,res){
    const {fullName,email,password} = req.body;
    try {
        if(!email || !password || !fullName){
            return res.status(400).json({
                message:"All fields are required"
            });
        }
        if(password.length<6){
            return res.status(400).json({
                message:"password must be at least 6 characters"
            }); 
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        }
        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"email already exists"})

        }
        const idex = Math.floor(Math.random()*100) +1;//genrate 1-100
        const randomavatar = `https://avatar.iran.liara.run/public/${idex}.png`;



        const newUser = await User({
            fullName,email,password,proflePic:randomavatar
        });
        //todo; for stream
        try {
            await upsertStreamUsers({
            id:newUser._id.toString(),
            name:newUser.fullName,
            Image:newUser.proflePic||"",
        });
        console.log(`stream user created for${newUser.fullName}`);

            
        } catch (error) {
            console.error("error in creating stream user",error);
            
        }
        

        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        });


        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,//prevent xss attaack
            sameSite:"strict",//prevent csrf attack
            secure:process.env.NODE_ENV==="production",//https only in production

        });
        
        await newUser.save();
        res.status(201).json({message:"User created successfully"});
    } catch (error) {
        console.log("error in signup",error);
        res.status(500).json({message:"internal server error"})
        
    }

   
}

export async function signin(req,res){
    try {
        const {email,password}= req.body;
        if(!email || !password ){
            return res.status(400).json({
                message:"All fields are required"
            });
        }
        const user = await User.findOne({email});
         if(!user){
            return res.status(401).json({message:"email and password incorrect"})

        }
        const isPasswordMatch = await user.matchPassword(password);
        if(!isPasswordMatch){
            return res.status(401).json({message:"email and password incorrect"});

        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        });


        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,//prevent xss attaack
            sameSite:"strict",//prevent csrf attack
            secure:process.env.NODE_ENV==="production",//https only in production

        });
        res.status(200).json({message:"login successful"});
    } catch (error) {
        console.log("error in signin",error);
        res.status(500).json({message:"internal server error"});
    }
}

export function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({success:true,message:"logout successful"});
}
export async function onboard(req,res){
    try {
        const requser  = req.user;
        const userId = req.user._id;
        const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body;
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message:"All fields are required",
                missingFields:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const uptadedUser = await User.findByIdAndUpdate(
            userId,{
                ...req.body,
                isOnboarding:true,
            },{new:true});//.select("-password");

            console.log("in onbord contoller",uptadedUser);

            if(!uptadedUser){
                return res.status(404).json({message:"User not found"});
            }

            res.status(200).json({
                success:true,
                user:req.user,
            })

    } catch (error) {
        console.log("error in onboarding",error);
        res.status(500).json({message:"internal server error"});
    }

    
}