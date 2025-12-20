import express from 'express';
import { logout, onboard, signin, signup } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const route = express.Router();

route.post('/signup',signup);
route.post('/signin',signin);
route.post('/logout',logout);

route.post('/onboarding',protectRoute,onboard);

route.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user});
})

export default route;