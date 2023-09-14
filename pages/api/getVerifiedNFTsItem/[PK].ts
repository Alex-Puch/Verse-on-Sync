import {MongoClient} from 'mongodb';

interface coleccion {
    coleccionID: string,
    coleccionName: string,
    descripcion: string,
    metadata: [{
        name: string,
        image: string
    }]
}

export default async function handler(req, res) {

    const inputListRes = await fetch('http://localhost:3000/api/getNftList/'+req.query.PK);
    const inputList = await inputListRes.json();
    const verfiedNFTlist: coleccion[] = [];
    const client = await MongoClient.connect('mongodb://localhost:27017/holder-app?readPreference=primary&directConnection=true&ssl=false');
    const db = client.db();
    const verifiedNFTs = db.collection('VerifiedNFTs');
    const verifiedCollections = db.collection('VerifiedCollections');
    
    
    for(const input of inputList.myNftList){
        var verfifiedNFT = await verifiedNFTs.findOne({mint: input});
        
        if(verfifiedNFT){
            
            const metResponse = await fetch('http://localhost:3000/api/getMetadata/'+input);
            const resData = await metResponse.json();
            var foundColection = verfifiedNFT.collectionId;
            var alreadyAddedColection = verfiedNFTlist.find(col => col.coleccionID === foundColection);
            if (alreadyAddedColection){
                var oldIndex = verfiedNFTlist.indexOf(alreadyAddedColection);
                alreadyAddedColection.metadata.push({name: resData.newResult.name, image: resData.newResult.image });
                verfiedNFTlist.splice(oldIndex,1,alreadyAddedColection);
            }else{
                var dbColection = await verifiedCollections.findOne({id : verfifiedNFT.collectionId});
                var myMetadata = {name: resData.newResult.name, image: resData.newResult.image };
                var newCollection: coleccion = {
                    coleccionID: dbColection.id,
                    coleccionName: dbColection.name,
                    descripcion: dbColection.description,
                    metadata:[myMetadata]

                }
                verfiedNFTlist.push(newCollection);
            }   
        }
    }
    
    return res.status(200).json({verfiedNFTlist});
}
