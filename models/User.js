import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var user = new Schema({
  discordId: {
    type: String,
    required: false
  },
  discordUsername: {
    type: String,
    required: false
  },
  discordEmail: {
    type: String,
    required: false
  },
  discordImg: {
    type: String,
    required: false
  },
  solWallets:[{
      type: String,
      required: false
  }]
});

mongoose.models = {};

var User = mongoose.model('User', user);

export default User;