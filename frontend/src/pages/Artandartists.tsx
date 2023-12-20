

import { useEffect, useState } from "react";
import { NftMetadata } from '../types'

// axios: JavaScript에서 널리 사용되는 HTTP client library (GET, POST, PUT, DELETE)
// 여기서는 Metadata의 URI에 대해 HTTP GET 요청을 보내기 위해 사용
// URI, Uniform Resource Identifier
import axios from 'axios';

const Artandartists = () => {

  const [nftCollection, setNftCollection] = useState<NftMetadata[]>([]);

  useEffect( () => {
    //NFT Collection을 조회하는 로직 구현

  }, []);

  useEffect( () => {
    //NFT Metadata를 조회하고, nftCollection에 저장하는 로직

  }, []);

  const fetchMetadata = async (tokenURI: string) => {
    try {
      const response = await axios.get(tokenURI);
      return response.data;

    } catch (error) {
      console.error(error);
      return null;
    }

  };

  return (
    <div>
      Art and Artists
      <div>
        {nftCollection.map( (nft: NftMetadata, index: number) => (
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


