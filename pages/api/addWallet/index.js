const nacl = require('tweetnacl');
const bs58 = require('bs58');
import connectDB from '../../../middleware/mongodb';
import User from '../../../models/User';
import Wallet from '../../../models/Wallet';
import { ObjectId } from 'mongodb';


const handler = async (req, res) => {
    if (req.method === 'POST') {
        const signedMessage = req.body.signedMessage;
        const session = req.body.session.user;
        if (signedMessage && session) {
            try {
                const nonce = req.cookies["auth-nonce"];
                const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
                const messageBytes = new TextEncoder().encode(message);
                const publicKeyBytes = bs58.decode(signedMessage.publicKey);
                const signatureBytes = bs58.decode(signedMessage.signature);
                                
                const result = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
            
                if (!result) {
                  throw new Error("user can not be authenticated");
                }
                
                if(session.provider === 'solana'){
                    const loggedWallet = await Wallet.findOne({publicKey: session.id});
                    const myUser = await User.findOne({_id: ObjectId(loggedWallet.owner)});
                    if(myUser.solWallets?.includes(signedMessage.publicKey)){
                        console.log("Wallet is already linked to this account");
                        return res.status(200).json("Wallet is already linked to this account");
                    }

                    console.log("Añadiendo wallet");
                    myUser.solWallets.push(signedMessage.publicKey);
                    await myUser.save();

                    const wallet = await Wallet.findOneAndUpdate({publicKey: signedMessage.publicKey},{owner: myUser._id},{new: false,upsert: true})
                    if(wallet){
                        console.log("Existia usuario, eliminando wallet");
                        await User.findOneAndUpdate({_id: ObjectId(wallet.owner)},{$pull: {solWallets: signedMessage.publicKey}});
                    }


                    return res.status(200).json("Wallet succesfully added");



                }

                if(session.provider === 'discord'){

                    const myUser = await User.findOne({discordId: session.id});
                    if(myUser.solWallets.includes(signedMessage.publicKey)){
                        return res.status(200).json("Wallet is already linked to this account");
                    }

                    const newOwner = await User.findOneAndUpdate({discordId: session.id},{$push:{solWallets: signedMessage.publicKey}});
                    if(!newOwner){
                        throw new Error("user by discord cannot be found");
                    }
                    
                    const wallet = await Wallet.findOneAndUpdate({publicKey: signedMessage.publicKey},{owner: newOwner._id},{new: false,upsert: true})
                    if(wallet){
                        await User.findOneAndUpdate({_id: ObjectId(wallet.owner)},{$pull: {solWallets: signedMessage.publicKey}});
                    }
                }
                return res.status(200).json("New Wallet linked correctly");

            } catch (error) {
              console.log("Error A");
              console.log(error);
              return res.status(500).send(error.message);
            }
          } else {
            console.log("Error B");
            res.status(422).send('data_incomplete');
          }
      } else {
        console.log("Error C");
        res.status(422).send('req_method_not_supported');
      }
  
};

export default connectDB(handler);