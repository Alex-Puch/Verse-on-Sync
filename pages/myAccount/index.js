import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link';
import { Avatar, Button, Card, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { theme } from '../../styles/loginTheme';
import { Box } from '@mui/material';
import { CardContent} from '@mui/material';
import { useRouter } from 'next/router';

export default function Home(props) {
  const [phantom, setPhantom] = useState();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect( () => {
    if(window.solana) {
      setPhantom(window.solana);
      
    }
  }, []);

  async function fetchNonce() {
    
    const response = await fetch('../api/login');
  
    if(response.status != 200)
      throw new Error("nonce could not be retrieved");

    const { nonce } = await response.json();
    
    return nonce;
  }

  async function loginPanthom() {

    await window.solana.connect();

    const nonce = await fetchNonce();

    const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await solana.request({
      method: "signMessage",
      params: {
        message: encodedMessage,
      },
    });

    signIn('credentials',
      {
        publicKey: signedMessage.publicKey,
        signature: signedMessage.signature,
        callbackUrl: `${window.location.origin}/myAccount`,
      }
    )
  }

  async function addWallet() {


    if(!loading && session && phantom){
      await window.solana.connect();

    const nonce = await fetchNonce();

    const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await solana.request({
      method: "signMessage",
      params: {
        message: encodedMessage,
      },
    });

    const dataToSend ={
      signedMessage: signedMessage,
      session: session
    }

    const valid = await fetch('../api/addWallet',{
      body: JSON.stringify(dataToSend),
      headers:{
        'Content-Type': 'application/json'
      },
      method : 'POST'
    })

    }
    refreshData();
    
  }
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }
  async function importAcc() {


    if(!loading && session && phantom){
      await window.solana.connect();

    const nonce = await fetchNonce();

    const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await solana.request({
      method: "signMessage",
      params: {
        message: encodedMessage,
      },
    });

    const dataToSend ={
      signedMessage: signedMessage,
      session: session
    }

    const valid = await fetch('../api/addWallet/importAcc',{
      body: JSON.stringify(dataToSend),
      headers:{
        'Content-Type': 'application/json'
      },
      method : 'POST'
    })

    }
    
  }

  async function loginDiscord() {
    await signIn('discord');
  }

  async function DeleteWallet(pk){
    
    const dataToSend ={
      pk: pk,
      session: session
    }

    const valid = await fetch('../api/deleteWallet',{
      body: JSON.stringify(dataToSend),
      headers:{
        'Content-Type': 'application/json'
      },
      method : 'POST'
    })
    if(pk === session.user.id){
      signOut;
    }
    refreshData();

  }

   

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>VerseOnSync</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{p:3, backgroundColor: '#9e69ac',borderRadius: 5, minHeight: '95vh', boxShadow: 10}}>          
              {status === 'unauthenticated' &&
                  <Stack direction="row" justifyContent="end">
                    {!phantom && <Button sx={{p:1, m:1}} variant="contained" disabled>Phantom is required in order to login with wallet</Button>}
                    {phantom && <Button sx={{p:1, m:1}} variant="contained" onClick={loginPanthom}>Login with Phantom</Button>}
                    <Button sx={{p:1, m:1}} color="discord" variant="contained" onClick={loginDiscord}>Login with Discord</Button>
                  </Stack>
              }
              {status === 'authenticated' &&
                  <Stack direction="row" justifyContent="end" sx={{p:1}}>
                    <Avatar alt={session?.user?.name} sx={{mt:1}} src={session.user?.image}></Avatar>
                    <Typography sx={{p:1, m:1}}>{session?.user?.name}</Typography>
                    <Button sx={{p:1, m:1, minWidth:"180px"}} variant="contained" onClick={signOut}>Logout</Button>
                  </Stack>
              }              

        {!loading && session?.user?.id && 
          <Box>
            <Stack direction="row" justifyContent="start" sx={{p:1}}>
              <h1>My Wallets</h1>
              <Button sx={{p:1, m:1,ml:3, minWidth:"180px", maxHeight: "40px", alignSelf:"center"}} variant="contained" onClick={addWallet}>Add Wallet</Button>
              {session.user.provider === 'solana' && <Button sx={{p:1, m:1}} variant="contained" disabled>Login with Discord to import Accs</Button>}
              {session.user.provider === 'discord' && <Button sx={{p:1, m:1, maxHeight: "40px", alignSelf:"center"}} variant="contained" onClick={importAcc}>Import multiple wallets from incomplete acc</Button>}


            </Stack>
            {props.walletList[0] && 
              props.walletList.map(function(pk,index){
                return (
                  <Stack direction="row" justifyContent="start" sx={{p:1}}>
                        <Typography component="div" variant="h5" sx={{alignSelf:"center"}}>
                          Wallet {index} : {pk}
                        </Typography>
                        <Button sx={{p:1, m:1,ml:3, alignSelf:"center"}} variant="contained" onClick={() => DeleteWallet(pk)}>Delete Wallet</Button>
                  </Stack>
                )
              })}
          </Box> 
        }
        </Box>

      </main>

      <footer className={styles.footer}>

      </footer>
      </ThemeProvider>
  )  
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  var myData = {};
  if(session){
    const dataToSend ={
      session: session
    }
    const myResponse = await fetch(process.env.BASE_URL+'api/getWallets',{
      body: JSON.stringify(dataToSend),
      headers:{
        'Content-Type': 'application/json'
      },
      method : 'POST'
    })
    
    const myResData = await myResponse.json();
    if(myResData.walletList){
      myData = myResData.walletList;
    }
    
    
  }
  return {
    props: {
      walletList: myData,
    }, // will be passed to the page component as props
  }
}