
const axios = require('axios');


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

async function getNFTlist (pk) {

    var myParams = [
      pk,
      {"programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},
      {"encoding": "jsonParsed"}]
    var tokensValue;

    var data = JSON.stringify({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getTokenAccountsByOwner",
      "params": myParams
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
      tokensValue = response.data.result.value;   
    });

    return tokensValue;
};

export default async function handler(req, res) {

    var pk = req.query.walletPK;
    var myNftList = [];
    var tokensValue = await getNFTlist(pk);
    for (const element of tokensValue){
        var myTokenData = element.account.data.parsed.info;
        if(myTokenData.tokenAmount.amount === '1' && myTokenData.tokenAmount.decimals === 0 && myTokenData.tokenAmount.uiAmount === 1 && myTokenData.tokenAmount.uiAmountString === '1' ){
            var condtion = await isNFT(myTokenData.mint.toString());
            if(condtion){
                myNftList.push(myTokenData.mint);
            }
        };
    };
    return res.status(200).json({myNftList});
  
}
