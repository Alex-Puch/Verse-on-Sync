
import { Account } from "@metaplex-foundation/mpl-core";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import * as web3 from "@solana/web3.js";
import { MongoClient } from "mongodb";
var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://cdn.tatsu.gg/mklnpfp/3729.json',
  headers: { }
};

const connection = new web3.Connection(
  "https://small-patient-fire.solana-mainnet.quiknode.pro/43bac0f5500322cb0dc584d31556decd94630c95/",
  'confirmed'
);

const getMetadata = async (tokenAddress) => {
  const metadataPDA = await Metadata.getPDA(tokenAddress);
  const mintAccInfo = await connection.getAccountInfo(metadataPDA);

  const {
    data: { data: metadata }
  } = Metadata.from(new Account(tokenAddress, mintAccInfo));
  return metadata;
};

function handleError(err){
    // Se necista un funcion que handle el error, como no queremos que haga nada la dejamos vacía
}

export default async function handler(req, res) {
    const client = await MongoClient.connect('mongodb://localhost:27017/holder-app?readPreference=primary&directConnection=true&ssl=false');
    const db = client.db();
    const verifiedNFTs = db.collection('VerifiedNFTs');
    try {
      let tokenAddress = req.query.tokenAdd;
      const result = await getMetadata(tokenAddress).catch((handleError));
      
      if (result === undefined){
        return res.status(400).json("Error at getting Token");
      }
      const isVerfied = await verifiedNFTs.findOne({mint: tokenAddress });
      if(isVerfied){
        var metaUri = result.uri;
        config.url = metaUri;
        var newResult;
        await axios(config).then(function (response) {
          newResult = {name: response.data.name, image:response.data.image};
        }).catch(function (error) {
        });
        return res.status(200).json({newResult});
      }else{
    
      }
      



      return res.status(200).json({result});
    } catch (error) {
      
    }

}

