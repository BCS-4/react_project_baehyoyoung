import { FC, Dispatch, SetStateAction, useState, useEffect } from 'react';

import { NftMetadata, GalleryLayoutContext } from '../types';
import NftCard, { NftCardProps } from './NftCard';
import { useOutletContext } from 'react-router-dom';
import { MINT_NFT_CONTRACT } from '../abis/contractAddress';

export interface SaleNftCardProps extends NftCardProps {
    metadataArray: NftMetadata[];
    setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}

const SaleNftCard = ({
    tokenId,
    image,
    name,
    metadataArray,
    setMetadataArray,

}:SaleNftCardProps) => {

    const [registedPrice, setRegistedPrice] = useState<number>(0);

    const { NFTContract, SALEContract, account, web3} = useOutletContext<GalleryLayoutContext>();

    const onClickPurchase = async() => {
        try {
            // @ts-expect-error
            const nftOwner:string = await NFTContract.methods.ownerOf(tokenId).call();

            if(!account || nftOwner.toLowerCase() === account.toLowerCase()) return;

            // @ts-expect-error
            await SALEContract.methods.purchaseNFT(MINT_NFT_CONTRACT, tokenId).send({
                from: account,
                value: web3.utils.toWei(registedPrice, "ether"),
                });

            // NFT 매매 처리 후, 매매 완료된 NFT를 화면에서 제외
            const temp = metadataArray.filter( 
                // 현재 처리한 tokenId와 다른 Id만 리턴하여 배열에 삽입
                (v) => {
                    if (v.tokenId !== tokenId) {
                        return v;
                    }
                }
            );

            setMetadataArray(temp);

        } catch(error) {
            console.error(error);
        }

    };

    const getRegistedPrice = async() => {
        try {
            // @ts-expect-error
            const response = await SALEContract.methods.getNFTSaleData(tokenId).call();
            // @ts-expect-error
            const price = Number(web3.utils.fromWei(Number(response.price), "ether"));
            setRegistedPrice(price);            

        } catch (error) {
            console.error(error);
        }

    };

    useEffect( ()=> {
        if(SALEContract) {
            getRegistedPrice();
        };       

    }, [SALEContract]);

    return (
        <div>
            <NftCard tokenId={tokenId} image={image} name={name} />    
            <div>
                {registedPrice} ETH
                <button onClick={onClickPurchase}>구매</button>
                
            </div>

        </div>

    );

};

export default SaleNftCard;