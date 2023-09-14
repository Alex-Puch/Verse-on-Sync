import connectDB from "../../../middleware/mongodb";
import User from "../../../models/User"

const handler = async (req, res) => {
    if (req.method === 'POST') {
        if (req.body.discordId) {
            try {
              var loggedUser = await User.findOneAndUpdate(
                  {discordId: req.body.discordId},
                  {discordUsername: req.body.discordUsername, discordEmail: req.body.discordEmail, discordImg: req.body.discordImg},
                  {new: true,upsert: true}
              );
              return res.status(200).send(loggedUser);
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