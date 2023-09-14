import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import VerifiedCollectionDisplay from '../components/layout/VerifiedColectionDisplay';
import { Box } from '@mui/material';



export default function Home(props) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (

    
    <div className={styles.main}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box sx={{p:3, backgroundColor: '#9e69ac',borderRadius: 5, minHeight: '95vh', boxShadow: 10}}>
          {session && 
              <Box>
                <h1>Your Holds:</h1>
                {props.data != null && 
                <VerifiedCollectionDisplay collectionList={props.data} ></VerifiedCollectionDisplay>}
              </Box>
              
          }
        </Box>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  var myData = {};
  if(session){
    const dataToSend ={
      session: session
    }
    const myResponse = await fetch(process.env.BASE_URL+'api/getVerifiedNFTsItem',{
      body: JSON.stringify(dataToSend),
      headers:{
        'Content-Type': 'application/json'
      },
      method : 'POST'
    })
    
    const myResData = await myResponse.json();
    if(myResData.verifiedNFTlist){
      console.log(myResData);
      myData = myResData.verifiedNFTlist;
    }
    console.log("My data");
    console.log(myData);
    
    
  }
  return {
    props: {
      data: myData,
    }, // will be passed to the page component as props
  }
}