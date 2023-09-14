import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from "next-auth/providers/discord";
const nacl = require('tweetnacl');
const bs58 = require('bs58');

const nextAuthOptions = (req, res) => {
    return {
        providers: [
            DiscordProvider({
                clientId: process.env.DISCORD_CLIENT_ID,
                clientSecret: process.env.DISCORD_CLIENT_SECRET,

              }),
            CredentialsProvider({
                async authorize(credentials) {
                    const nonce = req.cookies["auth-nonce"];

                    const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
                    const messageBytes = new TextEncoder().encode(message);

                    const publicKeyBytes = bs58.decode(credentials.publicKey);
                    const signatureBytes = bs58.decode(credentials.signature);
                    
                    const result = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

                    if (!result) {
                        throw new Error("user can not be authenticated");
                    }

                    const user = { id: credentials.publicKey, name: credentials.publicKey}

                    return user;
                }
            }),
            
        ],
        callbacks: {
            async signIn({user, account, profile, email, credentials}){
                if(account.provider === 'discord'){
    
                    user.provider = 'discord';
                    user.name = profile.username +'#' +profile.discriminator;
                    const dataToSend ={
                      discordId: user.id,
                      discordUsername: profile.username +'#' +profile.discriminator,
                      discordEmail: user.email,
                      discordImg: user.image
                    }
                    try {
                        const loggedUser = await fetch(process.env.BASE_URL+'api/login/discord',{
                            body: JSON.stringify(dataToSend),
                            headers:{
                              'Content-Type': 'application/json'
                            },
                            method : 'POST'
                          })
                    } catch (error) {
                        console.log("Error");
                    }
                    

                }else if(credentials != undefined){
                    user.provider = 'solana'
                    const dataToSend ={
                        pk: user.id
                      }
                    try {
                        const loggedUser = await fetch(process.env.BASE_URL+'api/login/solana',{
                            body: JSON.stringify(dataToSend),
                            headers:{
                              'Content-Type': 'application/json'
                            },
                            method : 'POST'
                          })
                          //console.log(loggedUser);
                    } catch (error) {
                        console.log("Error");
                        //console.log(error);
                    }

                }
                return true
            },
            jwt: async ({ token, user }) => {
                user && (token.user = user)
                return token
            },
            session: async ({ session, token }) => {
                session.user = token.user
                return session
            }
        }
    }
}

export default (req, res) => {
    return NextAuth(req, res, nextAuthOptions(req, res))
}