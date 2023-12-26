import { FC, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { NftMetadata, GalleryLayoutContext } from '../types';
import axios from 'axios';
import SaleNftCard from '../components/SaleNftCard';

const Store = () => {
  // NFTBoutiqueStore.sol 배포
  // 0x3BD8354560066C70Be1CD54092C420Ae7583720B

  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);
  //NftMetadata[]의 초기값은 빈 배열임을 ([])로 정의

  const {NFTContract, BoutiqueContract } = useOutletContext<GalleryLayoutContext>();
  // useOutletContext() 함수를 호출하고, 반환하는 값의 타입은 GalleryLayoutContext이다. 
  // 이는 NFTContract와 BoutiqueContract를 반환하고, 이는 GalleryLayoutContext에 정의되어 있을 것이다.

  const getBoutiqueNFTs = async () => {
    try {
      // Solidity의 uint형 array를 받아와야함. 
      // 보통 uint는 JavaScript의 number타입(64비트 부동소수점 형식)보다 큰 수를 다룸
      // 따라서 자바스크립트에서 크기 제한 없는 bigint를 사용하여 uint 값을 받아오는 것이 정확한 데이터 처리
      const onSaleNFTs:bigint[] = await BoutiqueContract.methods.getOnSaleNFTs().call();

      let temp: NftMetadata[] = [];

      for (let i=0; i < onSaleNFTs.length; i++) {
        // @ts-expect-error
        const metadataURI:string = await NFTContract.methods.tokenURI(Number(onSaleNFTs[i])).call();

        const response = await axios.get(metadataURI);

        // response.data는 name, description, image, dna, date 등등의 요소를 가지고 있으나 tokenId는 없다
        // 따라서 response.data와 tokenId를 묶어 NftMetadata 형태로 만들어 배열에 추가할 필요가 있다
        // ...response.data로 객체 분해 할당(spread syntax)을 이용, response.data의 모든 속성을 새 객체로 복사,
        // tokenId:~ 구문으로 tokenId 정보도 복사
        // 그 정보들을 {} 구문을 이용하여 하나의 struct로 정리
        // 그후 temp에 삽입
        temp.push({ ...response.data, tokenId:Number(onSaleNFTs[i]) });
        // 이 코드를 풀어쓰면
        // let newNftMetadata: NftMetadata = {tokenId:Number(onSaleNFTs[i]), name: metadata.name, image: ~~  };
        // temp.push(newNftMetadata);
        // 로 이해하면 됨
      }

      setMetadataArray(temp);

    } catch(error) {
      console.error(error);
    }

  };

  // IPFS 호환성 문제 해결
  const formatImageURL = (url:string) => {
    return url.startsWith("ipfs://")
      ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
      : url;
  };

  useEffect( () => {
    if(!BoutiqueContract) return;

    //BoutiqueContract 정보가 있다면 Boutique에 등록된 NFT 정보 가져오기
    getBoutiqueNFTs();

  }, [BoutiqueContract]);

  return (
      <div>
        <div>
          Store
        </div>
        <ul>
          {metadataArray?.map( (v, i)=> (
            <SaleNftCard 
              key={i}
              image={formatImageURL(v.image)}
              name={v.name}
              tokenId={v.tokenId!}
              metadataArray={metadataArray}
              setMetadataArray={setMetadataArray}
            />

          ))
          }

        </ul>
      </div>      
    );
  }
  
  export default Store;