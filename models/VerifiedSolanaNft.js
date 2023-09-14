import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var nft = new Schema({
  mint: {
    type: String,
    required: true
  },
  metadataName: {
    type: String,
    required: true
  },
  metadataImg:{
    type: String,
    required: true
  },
  collectionId:{
    type: mongoose.Schema.Types.ObjectId, ref:'VerifiedSolanaCollection',
    required: true
  },
  pesoVoto:{
    type: Number,
    default: 1
  }
});

mongoose.models = {};

var VerifiedSolanaNft = mongoose.model('VerifiedSolanaNft', nft);

export default VerifiedSolanaNft