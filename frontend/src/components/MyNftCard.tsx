import { FC, useState, useEffect, FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';

import NftCard, {NftCardProps} from './NftCard';
import { GalleryLayoutContext } from '../types';
import { MINT_NFT_CONTRACT } from '../abis/contractAddress';

interface MyNftCardProps extends NftCardProps {
    saleStatus: boolean;
}

const MyNftCard = ({
    tokenId,
    image,
    name,
    saleStatus,
}:MyNftCardProps) => {

    const [price, setPrice] = useState<string>("");
    const [registedPrice, setRegistedPrice] = useState<number>(0);
    const { BoutiqueContract, account, web3 } = useOutletContext<GalleryLayoutContext>();

    const onSubmitForSale = async (e: FormEvent) => {
        try {
            e.preventDefault();
            console.log('Form submitted');

            // price 값의 유효성 확인
            // + 연산자를 이용하여 문자열 123을 숫자 123으로 변환
            // price가 "abc" 등의 문자인데 + 연산자를 적용하게 되면 NaN이 리턴됨
            if(isNaN(+price)) return;
            
            await BoutiqueContract.methods
            // @ts-expect-error
            .setForSaleNFT(MINT_NFT_CONTRACT, tokenId, web3.utils.toWei(Number(price),"ether"))
            .send({from:account});

            setRegistedPrice(+price);
            setPrice("");

        } catch(error) {
            console.error(error);
        }

    };

    const getRegistedPrice = async () => {
        try {
            // @ts-expect-error
            const response = await BoutiqueContract.methods.getNFTSaleData(tokenId).call();
            // @ts-expect-error
            const price = Number(web3.utils.fromWei(Number(response.price), "ether"));
            setRegistedPrice(price);

        } catch(error) {
            console.error(error);
        }

    };

    useEffect(()=>{
        if(!BoutiqueContract) return;
        getRegistedPrice();
    },[BoutiqueContract]);


    return (
      <div>
        MyNftCard
        <NftCard tokenId={tokenId} image={image} name={name} />
        {registedPrice? (
            <div>{registedPrice} ETH</div>
        ):(
            saleStatus && (
                <form onSubmit={onSubmitForSale}>
                    <input type="text" value={price} onChange={(e)=> setPrice(e.target.value)} />
                    <input type="submit" value="등 록" />
                </form>
            )
        )}
      </div>      
    );
  }
  
  export default MyNftCard;