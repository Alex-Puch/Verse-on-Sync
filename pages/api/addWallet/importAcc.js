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
                

                if(session.provider === 'discord'){

                    console.log("Dentro");

                    const myUser = await User.findOne({discordId: session.id});

                    if(myUser.solWallets.includes(signedMessage.publicKey)){
                        console.log("Opcion Wallet linked");
                        return res.status(200).json("Wallet is already linked to this account");
                    }

                    const loggedWallet = await Wallet.findOne({publicKey: signedMessage.publicKey});

                    if(!loggedWallet){
                        console.log("Opcion Wallet Nuevo");
                        const wallet = await Wallet.findOneAndUpdate({publicKey: signedMessage.publicKey},{owner: myUser._id},{new: false,upsert: true})
                        myUser.solWallets.push(signedMessage.publicKey);
                        myUser.save();
                        return res.status(200).json("Successfully added a new wallet");
                    };

                    const oldUser = await User.findOne({_id: loggedWallet.owner});
                    console.log("oldUser");
                    console.log(oldUser);

                    if(oldUser?.discordId){
                        console.log("Opcion Cuenta existia");
                        console.log(oldUser);
                        myUser.solWallets.push(loggedWallet.publicKey);
                        oldUser.solWallets.pull(loggedWallet.publicKey);
                        loggedWallet.owner = myUser._id;
                        await myUser.save();
                        await oldUser.save();
                        await loggedWallet.save();
                        console.log("Opcion 1");
                        return res.status(200).json("Moved only 1 wallet since it was linked to an complete account");

                    }else{
                        console.log("Opcion migracion entera");
                        console.log(oldUser.solWallets);
                        
                        for(var walletPk of oldUser.solWallets){
                            var pk = walletPk;
                            console.log(walletPk);
                            await Wallet.findOneAndUpdate({publicKey: walletPk},{owner:myUser._id});
                            myUser.solWallets.push(walletPk);

                        }
                        await myUser.save();
                        await User.findByIdAndDelete(oldUser._id);
                        return res.status(200).json("Moved all wallets since it was linked to an incomplete account");
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