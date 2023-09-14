import * as web3 from "@solana/web3.js";


const axios = require('axios');



async function isNFT(mintAddy){
    
    var isAnNft;
    var data = JSON.stringify({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenSupply",
        "params": ["EueBZxvdj796X9NsdDEEFzmeyhx8w6YWdix4Pu54f4iU"]
      });
      
      var config = {
        method: 'post',
        url: 'https://small-patient-fire.solana-mainnet.quiknode.pro/43bac0f5500322cb0dc584d31556decd94630c95/',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
                
        isAnNft = (response.data.result.value.amount === "1");
        
      })
      .catch(function (error) {
       
      });
  
    return isAnNft;
}


const getNFTlist = async () =>{
    var tokensValue;
    var myResult;

    var data = JSON.stringify({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getTokenAccountsByOwner",
    "params": [
        "E2GxgbDMAKCHa7ZFWDHhyZAwNLm9tBDbujKpCgbfv4TT",
        {
        "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
        "encoding": "jsonParsed"
        }
    ]
    });

    var config = {
    method: 'post',
    url: 'https://small-patient-fire.solana-mainnet.quiknode.pro/43bac0f5500322cb0dc584d31556decd94630c95/',
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };

    axios(config).then(function (response) {
        myResult = JSON.stringify(response.data);
        var myNftList = [];
        tokensValue = response.data.result.value;
        
        return tokensValue;
    });
};

export default async function handler(req, res) {
    var pk = req.query.walletPK;
    let tokensValue = await getNFTlist();
   
    // tokensValue.forEach(element => {
    //     var myTokenData = element.account.data.parsed.info;
    //     console.log("");
    //     console.log("Nuevo elemento");
    //     console.log(myTokenData.tokenAmount);
    //     if(myTokenData.tokenAmount.amount === '1' && myTokenData.tokenAmount.decimals === 0 && myTokenData.tokenAmount.uiAmount === 1 && myTokenData.tokenAmount.uiAmountString === '1' ){
    //         console.log("El token parece un NFT");
    //         console.log(myTokenData.mint.toString());
    //         var condtion = await isNFT(myTokenData.mint.toString());
    //         console.log("Condition");
    //         console.log(condtion);
    //         if(condtion){
    //             console.log("El token es un NFT");
    //             myNftList.push(myTokenData.mint);
    //         }else{
    //             console.log("El token es SCAM");
    //         }  
    // };

    // console.log("Lista final:");
    // console.log(myNftList);
    var myResult="hola";
    return res.status(200).json({myResult});
  }