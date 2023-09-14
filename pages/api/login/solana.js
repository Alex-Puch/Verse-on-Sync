import { ObjectId } from "mongodb";
import connectDB from "../../../middleware/mongodb";
import User from "../../../models/User"
import Wallet from "../../../models/Wallet";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        if (req.body.pk) {
            try {
              var loggedWallet = await Wallet.findOne({publicKey: req.body.pk});
              if (loggedWallet){
                var loggedUser = await User.findOne({_id: new ObjectId(loggedWallet.owner)});
                return res.status(200).send(loggedUser);
              }else{
                var newUser = await new User({solWallets: [req.body.pk]});
                await newUser.save();
                var newWallet = await new Wallet({publicKey: req.body.pk, owner: new ObjectId(newUser._id)});
                await newWallet.save();
                return res.status(200).send(loggedUser);
              }
            } catch (error) {
              return res.status(500).send(error.message);
            }
          } else {
            res.status(422).send('data_incomplete');
          }
      } else {
        res.status(422).send('req_method_not_supported');
      }
};
export default connectDB(handler);

