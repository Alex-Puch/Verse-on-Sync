import connectDB from '../../../middleware/mongodb';
import VerifiedSolanaCollection from '../../../models/VerifiedSolanaCollection';

const collectionExample = {
    unique_name: "Solana Droid Business",
    description: "SDB is a collection of 5,000 uniquely generated 24-bit droids living on the Solana blockchain.",
    size: 5000,
    maxPesoVoto: 5000,
    img: "https://i.imgur.com/JtbLBBC.jpg",
    candyMachineId : "GdXab5GxaU23gpzdY7Zqzfm4t7b3LHkHnnCqsb21yLGY"
};

const handler = async (req, res) => {
    
    var exists = await VerifiedSolanaCollection.findOneAndUpdate({unique_name: collection1.unique_name},{description: collection1.description, size: collection1.size, maxPesoVoto:collection1.maxPesoVoto,img:collection1.img},{new: true, upsert: true})
    console.log(exists);       
    return res.status(200).json("Hola");
}

export default connectDB(handler);