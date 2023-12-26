
import React, { FC, useEffect, useState } from "react";

import { useOutletContext } from "react-router-dom";
import { NftMetadata, GalleryLayoutContext } from '../types';

import MintModal from '../components/MintModal';
import { SALE_NFT_CONTRACT } from "../abis/contractAddress";

// axios: JavaScript에서 널리 사용되는 HTTP client library (GET, POST, PUT, DELETE)
// 여기서는 Metadata의 URI에 대해 HTTP GET 요청을 보내기 위해 사용
// URI, Uniform Resource Identifier
import axios from 'axios';
import MyNftCard from "../components/MyNftCard";


const Artandartists = () => {

  // Modal
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const [ saleStatus, setSaleStatus ] = useState<boolean>(false);

  const [ nftCollection, setNftCollection] = useState<NftMetadata[]>([]);
  const { NFTContract, account } = useOutletContext<GalleryLayoutContext>();  

  const onClickMintModal = () => {
    if( !account ) return;

    setIsOpen(true);
  }

  const onClickSaleStatus = async () => {
    try {
      //@ts-expect-error
      await NFTContract.methods.setApprovalForAll(SALE_NFT_CONTRACT, !saleStatus).send({from:account,});

    } catch (error) {
      console.error(error);
    }
  }

  const getSaleStatus = async () => {
    try {
      // @ts-expect-error
      const isApproved: boolean = await NFTContract.methods.isApprovedForAll(account, SALE_NFT_CONTRACT).call();
      setSaleStatus(isApproved);
    } catch (error) {
      console.error(error);
    }

  };

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

        console.log("URI:", metadataURI);

        const response = await axios.get(metadataURI);
        console.log(response);
        tempNFTs.push(response.data);
      }
      
      setNftCollection(tempNFTs);


    } catch(error) {
      console.error(error);
    }

  }

  // IPFS 호환성 문제 해결
  const formatImageURL = (url:string) => {
    return url.startsWith("ipfs://")
      ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
      : url;
  };

  useEffect( () => {
    //OutletContext를 통해 NFT contract의 web3 연결과 metamask연결 정보가 들어왔으면 contract의 NFT 상세 정보 받아오기
    getNFTs();
    console.log("NFTContract: ", NFTContract);
  }, [NFTContract, account]);

  useEffect( () => {
    if (!account) return;

    getSaleStatus();

  }, [account]);

  return (
    <div>
      Art and Artists
      <div>
        <div className="flex justify-between p-2">
          <button onClick={onClickMintModal}> Mint </button>
          <button onClick={onClickSaleStatus}>Sale Approved: {saleStatus? "TRUE":"FALSE"}</button>
        </div>
        {isOpen && (
          <MintModal
            setIsOpen={setIsOpen}
            nftCollection={nftCollection}
            setNftCollection={setNftCollection}          
          />
        )}
        <ul>
          {nftCollection?.map( (nft: NftMetadata, index: number) => (
            <MyNftCard
              key={index}
              image={formatImageURL(nft.image)}
              name={nft.name}
              tokenId={nft.tokenId!}
              saleStatus={saleStatus}
            />
          ))}
        </ul>        
      </div>      
    </div>      
  );
}

export default Artandartists;


