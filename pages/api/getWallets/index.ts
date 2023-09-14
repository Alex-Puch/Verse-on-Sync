import connectDB from '../../../middleware/mongodb';
import User from '../../../models/User';
import Wallet from '../../../models/Wallet';

import { ObjectId } from 'mongodb';


const handler = async (req, res) => {

    const session = req.body.session.user;
    var myUser;
    console.log(session);
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

    const walletList = myUser.solWallets;
    console.log(walletList);
    
    return res.status(200).json({walletList});
}

export default connectDB(handler);



