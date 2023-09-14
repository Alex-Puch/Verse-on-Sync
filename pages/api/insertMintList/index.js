import { ObjectId } from "mongodb";
import connectDB from "../../../middleware/mongodb";
import VerifiedSolanaNft from "../../../models/VerifiedSolanaNft";



const mintList = [
    {mint: "JAJLWp1Ea5JK6CQou4anQ4S9Jvm2aKfbpC2fRWRg7Rtf", nombre: "Crimson Crook #759", collectionId: "629749813997a73b4ac4b4ee"},
    {mint: "Gn34FJLiaKV47ndw1jDJH43AhbsSRSGngF4ak9vs9ygo", nombre: "Crimson Crook #549", collectionId: "629749813997a73b4ac4b4ee"},
    {mint: "BDnNtyEFqkST3ZBudMp7drxrUvS1qDL9awbHAGEZHBrH", nombre: "Crimson Crook #69", collectionId: "629749813997a73b4ac4b4ee"},
    {mint: "wTW7LkAf4XA3D3wy25HH5ocxzaPPyDFt6X3BzS3hDmz", nombre: "SolanaDroidBusiness #3734", collectionId: "629749cb3997a73b4ac4b7a3"},
    {mint: "EueBZxvdj796X9NsdDEEFzmeyhx8w6YWdix4Pu54f4iU", nombre: "SolanaDroidBusiness #4839", collectionId: "629749cb3997a73b4ac4b7a3"},

]
    


const handler = async (req, res) => {
    const collectionId = req.body.collectionId;
    for(const elem of req.bodymintList){
        const metResponse = await fetch(process.env.BASE_URL+'api/getMetadata/'+elem.mint);
        const resData = await metResponse.json();
        await VerifiedSolanaNft.findOneAndUpdate(
            {mint: elem.mint},
            {metadataName:resData.newResult.name,metadataImg:resData.newResult.image,collectionId: ObjectId(collectionId)},
            {new: true, upsert: true});
    }
    return res.status(200).json("Insertion completed");
}
export default connectDB(handler);


