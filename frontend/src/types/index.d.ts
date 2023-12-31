import Web3, { Contract, ContractAbi } from "web3";

export interface GalleryLayoutContext {
    account: string;
    web3: Web3;
    NFTContract: Contract<ContractAbi>;
    SALEContract: Contract<ContractAbi>;
}

export interface NftMetadata {
    tokenId: number;
    name: string;
    image: string;
    description: string,
    attributes: {
        trait_type: string;
        value: string;
    }[];
}