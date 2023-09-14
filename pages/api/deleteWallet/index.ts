import connectDB from '../../../middleware/mongodb';
import User from '../../../models/User';
import Wallet from '../../../models/Wallet';

import { ObjectId } from 'mongodb';


const handler = async (req, res) => {

    const session = req.body.session.user;
    const pk = req.body.pk;

    var myUser;
    console.log(session);
    console.log(pk)
    if(!session?.id){
        console.log("No hay sesion");
        return res.status(200).json({});
    }
    if(session.provider === 'discord'){
        myUser = await User.findOne({discordId: session.id});
    }else{
        var myWallet = await Wallet.findOne({publicKey: session.id});
        myUser = await User.findOne({_id: ObjectId(myWallet.owner)})
    }
    if(myUser.solWallets.includes(pk)){
        myUser.solWallets.pull(pk);
        await myUser.save();
        await Wallet.findOneAndDelete({publicKey: pk})
        console.log("Wallet deleted Successfully");
        return res.status(200).json({});
    }else{
        console.log("Wallet isn't owned by the user")
        return res.status(200).json({});
    }
}

export default connectDB(handler);



