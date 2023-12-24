import Web3, { Contract, ContractAbi } from "web3";

export interface GalleryLayoutContext {
    account: string;
    web3: Web3;
    NFTContract: Contract<ContractAbi>;
}

export interface NftMetadata {
    name: string,
    image: string;
    description: string,
    attributes: {
        trait_type: string;
        value: string;
    }[];
}