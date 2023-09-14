import connectDB from '../../../middleware/mongodb';
import User from '../../../models/User';
import Wallet from '../../../models/Wallet';
import VerifiedSolanaNft from '../../../models/VerifiedSolanaNft'
import VerifiedSolanaCollection from '../../../models/VerifiedSolanaCollection';
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import {Connection} from "@solana/web3.js";
import { ObjectId } from 'mongodb';
import { Account } from "@metaplex-foundation/mpl-core";

var axios = require('axios');

const validIp1 = "https://arweave.net";
const validIp2 = "https://cdn.tatsu.gg";

interface metadata{
    name: string;
    image: string;
}

const connection = new Connection(
    "https://small-patient-fire.solana-mainnet.quiknode.pro/43bac0f5500322cb0dc584d31556decd94630c95/",
    'confirmed'
  );


interface coleccion {
    coleccionName: string,
    descripcion: string,
    size?: number,
    maxPesoVoto?: number,
    myPesoVoto?: number,
    metadata: [{
        name: string,
        image: string
    }],
    img?: string
}

async function isNFT(mintAddy){
    var myList = [mintAddy];
    var isAnNft;
    var data = JSON.stringify({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenSupply",
        "params": myList
      });
      
    var config = {
      method: 'post',
      url: 'https://small-patient-fire.solana-mainnet.quiknode.pro/43bac0f5500322cb0dc584d31556decd94630c95/',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
      
    await axios(config).then(function (response) {
        isAnNft = (response.data.result.value.amount === "1");
      })
      .catch(function (error) {
      });

    return isAnNft;
}

const getMetadata = async (tokenAddress) => {
    const metadataPDA = await Metadata.getPDA(tokenAddress);
    const mintAccInfo = await connection.getAccountInfo(metadataPDA);
  
    const {
      data: { data: metadata }
    } = Metadata.from(new Account(tokenAddress, mintAccInfo));
    return metadata;
  };

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

    var inputList = [];

    for(const pk of myUser.solWallets){
        const metResponse = await fetch(process.env.BASE_URL+'api/getNftList/'+pk);
        const resData = await metResponse.json();
        console.log(resData);
        if(resData){
            resData.myNftList.forEach(elem =>{
                inputList.push(elem);
            })
        }   
        
    }
    
    var verfiedNFTdict: {[key: string]: coleccion} = {};
    var verifiedNFTlist = [];
    for(const input of inputList){

        var verifiedNft = await VerifiedSolanaNft.findOne({mint: input});
        
        if(verifiedNft){
            
            var foundColection = verifiedNft.collectionId.toString();
            if(verfiedNFTdict[foundColection]){
                verfiedNFTdict[foundColection].metadata.push({name: verifiedNft.metadataName, image: verifiedNft.metadataImg});
                verfiedNFTdict[foundColection].myPesoVoto+=verifiedNft.pesoVoto;
            }else{
                var dbColection = await VerifiedSolanaCollection.findOne({_id : ObjectId(foundColection)});
                var myMetadata = {name: verifiedNft.metadataName, image: verifiedNft.metadataImg };
                var newCollection: coleccion = {
                    coleccionName: dbColection.unique_name,
                    descripcion: dbColection.description,
                    size: dbColection.size,
                    maxPesoVoto: dbColection.maxPesoVoto,
                    myPesoVoto: verifiedNft.pesoVoto,
                    metadata:[myMetadata],
                    img: dbColection.img
                }
                verfiedNFTdict[dbColection.id] = newCollection;
            }   
            
        }else if(isNFT(input)){
            const result = await getMetadata(input);
            console.log("uri");
            console.log(result.uri);
            
            if(result.uri.includes(validIp1) || result.uri.includes(validIp2)){
                console.log("Pasa dentro");
                var newResult;
                await axios({method: 'get',url: result.uri,headers: {}}).then(function (response) {
                    newResult = {name: response.data.name, image:response.data.image};
                }).catch(function (error) {});
                if(verfiedNFTdict["Unverified NFTs"]){
                    verfiedNFTdict["Unverified NFTs"].metadata.push({name: newResult.name, image: newResult.image});
                }else{
                    var myMetadata = {name: newResult.name, image: newResult.image};
                    var newCollection: coleccion = {
                        coleccionName: "Unverfied NFTs",
                        descripcion: "This is the list of NFTs that hasn't been verified by the platform. Contact support if you want to verify your collection with us",
                        metadata:[myMetadata]
                    }
                    verfiedNFTdict["Unverified NFTs"] = newCollection;
                }
            }
        }
        
    }
    for(var key in verfiedNFTdict) {
        if(key != "Unverified NFTs"){
            verifiedNFTlist.push(verfiedNFTdict[key]);
        }
        
    }
    verifiedNFTlist.push(verfiedNFTdict["Unverified NFTs"]);
    console.log("Result");
    console.log(verifiedNFTlist);
    
    return res.status(200).json({verifiedNFTlist});
}

export default connectDB(handler);



