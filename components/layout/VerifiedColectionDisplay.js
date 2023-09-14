import classes from './MainNavigation.module.css';
import Link from 'next/link'
import MetadataDisplay from './MetadataDisplay';
import styles from '../../styles/Home.module.css';
import { Stack, Typography, Box, Avatar} from '@mui/material';
import { Collection } from 'mongoose';



function VerifiedCollectionDisplay(collectionList) {
  console.log(collectionList.collectionList)
  return (
    <Box>
      {
        collectionList.collectionList.map(function(coleccion, index){
          return (
              <Box sx={{mt:5,mb:2}}>
              <Stack direction="row" justifyContent="start" sx={{p:1}}>
                {coleccion?.img && 
                <Avatar src={coleccion?.img} sx={{alignSelf:"center", mr:1}} />}
                <Typography component="div" variant="h5" sx={{alignSelf:"center", mr:3,fontWeight:600}}>
                  {coleccion?.coleccionName}
                </Typography>
                {coleccion?.size && 
                <Stack direction="row" justifyContent="start" sx={{p:1}}>
                  <Box sx={{mr:2, borderRadius:100, p:1, backgroundColor:"#5D4E6B",alignItems:"center"}}>
                    <Typography component="div" variant="subtitle1" sx={{alignSelf:"center", mr:1,color:"white"}}>
                      Holds: {coleccion?.metadata.length}/{coleccion?.size}
                    </Typography>
                  </Box>
                  <Box sx={{mr:2, borderRadius:100, p:1, backgroundColor:"#5D4E6B"}}>
                    <Typography component="div" variant="subtitle1" sx={{alignSelf:"center", mr:1, color:"white"}}>
                      VoteWeight: {coleccion?.myPesoVoto}/{coleccion?.maxPesoVoto}
                    </Typography>
                  </Box>
                </Stack>}
              </Stack>   
              {coleccion != undefined &&             
              <MetadataDisplay metadataList={coleccion?.metadata}></MetadataDisplay>}
            </Box>
            
          )
          
        })
      }
    </Box>
  );
}

export default VerifiedCollectionDisplay




