import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";


const connection = new Connection(
    "https://small-patient-fire.solana-mainnet.quiknode.pro/43bac0f5500322cb0dc584d31556decd94630c95/",
    'confirmed'
  );
const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;
const MAX_CREATOR_LIMIT = 5;
const MAX_DATA_SIZE =
  4 +
  MAX_NAME_LENGTH +
  4 +
  MAX_SYMBOL_LENGTH +
  4 +
  MAX_URI_LENGTH +
  2 +
  1 +
  4 +
  MAX_CREATOR_LIMIT * MAX_CREATOR_LEN;
const MAX_METADATA_LEN = 1 + 32 + 32 + MAX_DATA_SIZE + 1 + 1 + 9 + 172;
const CREATOR_ARRAY_START =
  1 +
  32 +
  32 +
  4 +
  MAX_NAME_LENGTH +
  4 +
  MAX_URI_LENGTH +
  4 +
  MAX_SYMBOL_LENGTH +
  2 +
  1 +
  4;


const candyMachineId = "GdXab5GxaU23gpzdY7Zqzfm4t7b3LHkHnnCqsb21yLGY";


const TOKEN_METADATA_PROGRAM = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const getMintAddresses = async (candyMachineId: String) => {
  const firstCreatorAddress = new PublicKey(candyMachineId)
  const metadataAccounts = await connection.getProgramAccounts(
    TOKEN_METADATA_PROGRAM,
    {
      dataSlice: { offset: 33, length: 32 }, // The mint address is located at byte 33 and lasts for 32 bytes.
      filters: [
        { dataSize: MAX_METADATA_LEN }, // Only get Metadata accounts.
        {
          memcmp: { // Filter using the first creator.
            offset: CREATOR_ARRAY_START,
            bytes: firstCreatorAddress.toBase58(),
          },
        },
      ],
    }
  );
    
  return metadataAccounts.map((metadataAccountInfo) =>
    bs58.encode(metadataAccountInfo.account.data)
  );
};












// const getMintAddresses = async (firstCreatorAddress: PublicKey) => {
//     const metadataAccounts = await connection.getProgramAccounts(
//       TOKEN_METADATA_PROGRAM,
//       {
//         dataSlice: { offset: 33, length: 32 }, // The mint address is located at byte 33 and lasts for 32 bytes.
//         filters: [
//           { dataSize: MAX_METADATA_LEN }, // Only get Metadata accounts.
//           {
//             memcmp: { // Filter using the first creator.
//               offset: CREATOR_ARRAY_START,
//               bytes: firstCreatorAddress.toBase58(),
//             },
//           },
//         ],
//       }
//     );
      
//     return metadataAccounts.map((metadataAccountInfo) =>
//       bs58.encode(metadataAccountInfo.account.data)
//     );
//   };
  
  export default async function handler(req, res) {
    const myPK = new PublicKey('GdXab5GxaU23gpzdY7Zqzfm4t7b3LHkHnnCqsb21yLGY');
    const myResult = await getMintAddresses(myPK);
    return res.status(200).json({myResult});

}