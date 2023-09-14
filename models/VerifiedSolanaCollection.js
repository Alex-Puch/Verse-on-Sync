import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var collection = new Schema({
  unique_name: {
    type: String,
    required: true
  },
  display_name:{
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  size:{
    type: Number,
    required: true
  },
  maxPesoVoto:{
    type: Number,
    required: true
  },
  img:{
    type: String,
    required: false
  }
});

mongoose.models = {};

var VerifiedSolanaCollection = mongoose.model('VerifiedSolanaCollection', collection);

export default VerifiedSolanaCollection