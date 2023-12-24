
import React, { FC, useEffect, useState } from "react";

import { useOutletContext } from "react-router-dom";
import { NftMetadata, GalleryLayoutContext } from '../types'

// axios: JavaScript에서 널리 사용되는 HTTP client library (GET, POST, PUT, DELETE)
// 여기서는 Metadata의 URI에 대해 HTTP GET 요청을 보내기 위해 사용
// URI, Uniform Resource Identifier
import axios from 'axios';


const Artandartists = () => {

  const [ nftCollection, setNftCollection] = useState<NftMetadata[]>([]);
  const { NFTContract, account } = useOutletContext<GalleryLayoutContext>();  

  const getNFTs = async () => {
    try {
      //OutletContext를 통해 받아온 NFT contract의 web3 연결과 metamask연결 정보 확인
      if( !NFTContract || !account ){
        console.log("No info of NFTContract or account.");
        return;
      }

      //@ts-expect-error
      const balance = await NFTContract.methods.balanceOf(account).call();  // NFT 개수 확인

      console.log("balance: ", Number(balance));

      // NFT 정보를 받아올 배열 선언
      let tempNFTs: NftMetadata[] = [];

      for(let i=0; i < Number(balance); i++) {
        //@ts-expect-error
        const tokenId = await NFTContract.methods.tokenOfOwnerByIndex(account, i).call();

        //@ts-expect-error
        const metadataURI: string = await NFTContract.methods.tokenURI(Number(tokenId)).call();

        const response = await axios.get(metadataURI);
        console.log(response);
        tempNFTs.push(response.data);
      }
      
      setNftCollection(tempNFTs);


    } catch(error) {
      console.error(error);
    }

  }

  useEffect( () => {
    //OutletContext를 통해 NFT contract의 web3 연결과 metamask연결 정보가 들어왔으면 contract의 NFT 상세 정보 받아오기
    getNFTs();
    console.log("NFTContract: ", NFTContract);
  }, [NFTContract, account]);

  return (
    <div>
      Art and Artists
      <div>
        {nftCollection?.map( (nft: NftMetadata, index: number) => (
          <div key={index}>
            <img src={nft.image} alt={nft.name} />
            <h3>{nft.name}</h3>
            <p>{nft.description}</p>
          </div>
        ))}
      </div>
    </div>      
  );
}

export default Artandartists;


