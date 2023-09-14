import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Box } from '@mui/material';



function MetadataDisplay(metadataList) {
  return (
    <ImageList cols={10} gap={8}>
      {
        metadataList.metadataList.map((metadata=>(
          <Box >
            <ImageListItem key={metadata.image} sx={{maxWidth:"250px", minWidth:"250px", mr:2, borderRadius:2, p:1, backgroundColor:"#5D4E6B"}}>
              <ImageListItemBar sx={{color:"white"}}
                title={metadata.name}
                position="below"
              />
              
              <img
                src={metadata.image}
                alt={metadata.name}
                loading="lazy"
                style={{borderRadius:"5px"}}
              />
             
              
              
            </ImageListItem>
          </Box>
          )))
        }
    </ImageList>
  );
}

export default MetadataDisplay;