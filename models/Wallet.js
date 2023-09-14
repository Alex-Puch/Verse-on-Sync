import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var wallet = new Schema({
  publicKey: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, ref:'User',
    required: true
  },
});

mongoose.models = {};

var Wallet = mongoose.model('Wallet', wallet);

export default Wallet