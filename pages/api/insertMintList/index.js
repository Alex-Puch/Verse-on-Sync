import { ObjectId } from "mongodb";
import connectDB from "../../../middleware/mongodb";
import VerifiedSolanaNft from "../../../models/VerifiedSolanaNft";
 


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


