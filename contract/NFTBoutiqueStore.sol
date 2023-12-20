// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import './MintNFT.sol';
// 구현 목적
// MintNFT.sol을 통해 등록한 contract로 minting된 NFT의 marketplace(Boutique)
// setForSaleNFT: 배포 완료된 NFT 컬래션 컨트랙트의 NFT id를 판매가격과 함께 판매목록에 등록하는 함수
// purchaseNFT: ETH와 NFT를 교환하고, NFT를 판매목록에서 제거
// 판매완료된 NFT의 경우, 최종 거래가와 Sold 표시할 수 있도록 구초제 사용


contract NFTBoutiqueStore {

    struct NFTSaleData {
        uint price;
        bool onSale;
        address owner;
    }

    // NFT 판매 목록
    mapping(uint => NFTSaleData) public nftSaleData;

    // 판매 중인 NFT id list
    uint[] public onSaleNFTs;

    // NFT 판매 등록
    function setForSaleNFT(address _mintNftAddress, uint _tokenId, uint _price) public {
        ERC721 mintNftContract = ERC721(_mintNftAddress);
        address nftOwner = mintNftContract.ownerOf(_tokenId);

        require(msg.sender == nftOwner, "You are not the owner of this NFT.");
        require(_price > 0, "The price must be greater than zero.");
        require(!nftSaleData[_tokenId].onSale,"This NFT is already listed for sale.");
        require(mintNftContract.isApprovedForAll(msg.sender, address(this)),"The NFT owner has not authorized this contract.");

        nftSaleData[_tokenId] = NFTSaleData(_price, true, nftOwner); 
        onSaleNFTs.push(_tokenId);
    }

    // NFT 판매
    // payalbe - 함수가 ETH를 전송 받을 수 있도록 허용
    function purchaseNFT(address _mintNftAddress, uint _tokenId) public payable{
        NFTSaleData storage saleData = nftSaleData[_tokenId];
        ERC721 mintNftContract = ERC721(_mintNftAddress);

        require(msg.sender != saleData.owner, "The caller could not be the owner of the NFT.");
        require(saleData.onSale, "This NFT is currently not available for sale.");
        require(saleData.price <= msg.value, "The amount sent is less than the NFT's price.");

        payable(saleData.owner).transfer(msg.value);
        mintNftContract.safeTransferFrom(saleData.owner, msg.sender, _tokenId);

        saleData.onSale = false;
        saleData.owner = msg.sender;

        checkSoldOut();
    }

    function checkSoldOut() private {
        for( uint i=0; i < onSaleNFTs.length; i++) {
            if(!nftSaleData[onSaleNFTs[i]].onSale) {
                onSaleNFTs[i] = onSaleNFTs[onSaleNFTs.length-1];
                onSaleNFTs.pop();
            }
        }
    }

    function getNFTSaleData(uint tokenId) public view returns (NFTSaleData memory){
        return nftSaleData[tokenId];
    }

    function getOnSaleNFTs() public view returns(uint[] memory){
        return onSaleNFTs;
    }

}