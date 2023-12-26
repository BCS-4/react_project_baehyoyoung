import { FC, Dispatch, SetStateAction, useState } from 'react';
import { NftMetadata, GalleryLayoutContext } from '../types';

import { useOutletContext  } from 'react-router-dom';
import axios from 'axios';

interface MintModalProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    nftCollection: NftMetadata[];
    setNftCollection: Dispatch<SetStateAction<NftMetadata[]>>;
}

const MintModal = ({setIsOpen, nftCollection, setNftCollection}:MintModalProps) => {

    const [ metadata, setMetadata ] = useState<NftMetadata>();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    
    const { NFTContract, account } = useOutletContext<GalleryLayoutContext>();  

    const onClickMint = async () => {
        try {
            //OutletContext를 통해 받아온 NFT contract의 web3 연결과 metamask연결 정보 확인
            if( !NFTContract || !account ){
                console.log("No info of NFTContract or account.");
                return;
            }

            setIsLoading(true);

            // Ethereum smart contract와 frontend 간 상호작용
            await NFTContract.methods.mintNFT().send( {from:account} );
            // .send( {from:account} )는 Ether network에 mintNFT() 호출 트랜잭션을 전송(send)하는 것이 account 주소임을 알림
            // 필요 시, Ether network는 account 주소에 가스 비용을 요청

            // @ts-expect-error
            const balance = await NFTContract.methods.balanceOf(account).call();
            // .send()와 .call()의 차이
            // .send는 transaction을 생성하고, 네트워크에 전송. send는 가스비용을 발생 시키고, 블록체인에 상태 변경 초래
            // .call은 상태 변경 없는 조회용 함수로 가스비용을 발생 시키지 않음
            // 즉 .send()는 contract의 전역변수나 상태변수를 변경하는 function을 호출할 때 사용하고,
            // call()은 public view나 public pure 같은 함수를 호출할 때 사용

            // @ts-expect-error
            const tokenId = await NFTContract.methods.tokenOfOwnerByIndex(account, Number(balance)-1).call();

            // @ts-expect-error
            const metadataURI: string = await NFTContract.methods.tokenURI(Number(tokenId)).call();

            const response = await axios.get(metadataURI);

            setMetadata(response.data);
            setNftCollection([response.data, ...nftCollection]);

            setIsLoading(false);
            
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-gray-200 bg-opacity-50 flex justify-center items-center">
            <div>
                <div>
                    <button onClick={() => setIsOpen(false)}>X</button>
                </div>
                {metadata? (
                    <div>
                        <div>{metadata.name}</div>
                        <div>{metadata.description}</div>
                        <div className="text-center mt-4">
                            <button onClick={()=>setIsOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                ):(
                    <div>
                        <div>
                            {isLoading? "로딩 중...":"NFT를 민팅하시겠습니까?"}
                        </div>
                        <div className="text-center mt-4">
                            <button onClick={onClickMint}>
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      );
  }
  
  export default MintModal;