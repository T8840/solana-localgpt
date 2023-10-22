import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { createMint, getMint, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, getAccount, mintTo, AccountLayout } from '@solana/spl-token';

import 'dotenv/config';
require('dotenv').config()
const secret = JSON.parse(process.env.PRIVATE_KEY2 ?? "") as number[]
const secretKey = Uint8Array.from(secret)
const payer = Keypair.fromSecretKey(secretKey)


console.log("process.env", payer.publicKey)

const connection = new Connection(
  clusterApiUrl('devnet'),
  'confirmed'
);

async function airdrop() {
  try {
    const airdropSignature = await connection.requestAirdrop(
      // payer.publicKey,
      new PublicKey("HxJHFKt8nFxmXL8HVnD84YJFrsZmHC1ux9fgwm2awkS8"),


      2 * LAMPORTS_PER_SOL,
    );
    const latestBlockHash = await connection.getLatestBlockhash();

    // await connection.confirmTransaction(airdropSignature);
    // await connection.confirmTransaction(signature, 'confirmed');

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });
  } catch (error) {
    console.error("Airdrop failed:", error);

  }
}

async function create() {
  //创建token // 可以使用spl-token命令直接创建
  // const mint = await createMint(
  //   connection,
  //   payer,
  //   payer.publicKey,
  //   payer.publicKey,
  //   9 // We are using 9 to match the CLI decimal default exactly
  // );

  // console.log(mint.toBase58());
  

  //加载mint账号合约  // spl-token create-token 与 spl-token create-account Rw3i9KfTgpg2J8orGhmVBVGMKonZJQnoHJiyrjWUHDM 获得的account
  // const tokenAddress = "33hnrSWmU9wiRk3s75PbR7sZ9Lg8Vy4x1iCqSYmfEeyH"
  const tokenAddress = "2gvPhqaFPap7tDoXaKfWs2TZcRXkmooFBghmAf77Zf4x"
  
  const mint = new PublicKey(tokenAddress);
  // const token = new Token(connection, mint, splToken.TOKEN_PROGRAM_ID);
  // const tokenPublicKey = token.publicKey;
  const mintInfo = await getMint(
    connection,
    mint
  )

  console.log(mintInfo.supply);



  //产生关联地址
  // const tokenAccount = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   payer,
  //   mint,
  //   payer.publicKey
  // )

  // console.log(tokenAccount.address.toBase58());

  //6ciq34LobTP9LUQAsaJcFYhjgayZvbwCr2NuPRV9zL7x 钱包地址
  //96NqqSswtcX6gtGdKXe3HAA1kgykYLiHNXmSiszu9dwq 关联地址
  // const tokenAccountAddress = "96NqqSswtcX6gtGdKXe3HAA1kgykYLiHNXmSiszu9dwq"
  const tokenAccountAddress = "HbnY7oywCYsyqeQ5cAjTxJQSGmsLfeQkpJyfwBTGs1F"
  const tokenAccount2 = new PublicKey(tokenAccountAddress);

  //查询余额
  const tokenAccountInfo = await getAccount(
    connection,
    tokenAccount2
  )

  console.log("余额", tokenAccountInfo.amount);

  //minto地址 mint数量  // 这里是mint给创建token的owner地址转了100个
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount2,
    payer,
    1000000000000000 // because decimals for the mint are set to 9 
  )
/* 如果.env的私钥与tokenAccount2不匹配，报以下错：
 logs: [
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]',
    'Program log: Instruction: MintTo',
    'Program log: Error: owner does not match',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4252 of 200000 compute units',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA failed: custom program error: 0x4'
  ]
*/
  //查询token概述
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    // owner address: 6ciq34LobTP9LUQAsaJcFYhjgayZvbwCr2NuPRV9zL7x
    new PublicKey('BBJvVBsEgq5Nht52xCyb2BUDD9zkgYGgfpaNptyi27Lh'), 
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  console.log("Token                                         Balance");
  console.log("------------------------------------------------------------");
  tokenAccounts.value.forEach((tokenAccount) => {
    const accountData = AccountLayout.decode(tokenAccount.account.data);
    console.log(`${new PublicKey(accountData.mint)}   ${accountData.amount}`);
  })
}
//https://explorer.solana.com/
//airdrop()
// airdrop().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


// create()
create().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
