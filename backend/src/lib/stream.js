import{StreamChat} from "stream-chat";
import "dotenv/config";
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
if(!apiKey||!apiSecret){
    console.error("Stream Api key and secret are missing");
   
}
const streamClient = StreamChat.getInstance(apiKey,apiSecret);
 export const upsertStreamUsers = async(userData)=>{
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
        
    } catch (error) {
        console.error("error in cresting stream user",error);
        
    }
   }

   export const generateStreamToken = (userId)=>{
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.log("error in generateStreamToken: ",error);
        
        
    }

   };
