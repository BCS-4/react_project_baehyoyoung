// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MintNFT is ERC721Enumerable {
// ERC721Enumerable은 ERC721 확장으로 token collection 전체에 대한 조회 기능 추가됨
// 추가된 함수는 totalSupply, tokenByIndex, tokenOfOwnerByIndex (가스비 발생 가능)
// 전체 NFT 컬렉션을 쉽게 탐색하고 관리할 수 있음

    // overflow, underflow 등 방지를 위해 Counter.sol 이용
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // Counter 이용하여 tokenIds를 선언할 경우, 초기값은 0으로 설정됨
    // _tokenIds.current(), _tokenIds.increment()

    uint maxSupply;
    string metadataURI;

    constructor(
        string memory _name, 
        string memory _symbol, 
        uint _maxSupply, 
        string memory _metadataURI) ERC721( _name, _symbol) {
            maxSupply = _maxSupply;
            metadataURI = _metadataURI;
            //https://ipfs.io/ipfs/QmepCkKeWM9v4MqFP9ymi2moQ22c4ineZbn6wZMX2k9wrE

    }

    function mintNFT() public {
        require(totalSupply() < maxSupply, "Max supply limit exceeded.");

        //minting 전에 tokenId를 먼저 증가 시킴
        //tokenId의 초기값은 0이므로, increment를 실행하여
        //최초 발행되는 tokenId의 값을 1로 지정하고, 
        //minting 후 totalSupply() 값도 1을 반환함
        _tokenIds.increment(); 
        uint tokenId = _tokenIds.current();
        _mint(msg.sender, tokenId);
    }

    //ERC721Enumerable의 tokenURI는 _setTokenURI로 설정된 URI만 반환,
    //해당 NFT프로젝트는 컬렉션을 serial number로 관리하므로 metadata URI 반환 방식을 변경
    // 주요 함수이며, contract 외부에서 호출 가능해야하며(public), 
    // ERC721 기본 함수인 tokenURI를 재정의하며(override),
    // contract를 통해 블록체인에 기록된 데이터를 조회만 하는 함수(view)
    function tokenURI(uint _tokenId) public override view returns(string memory) {
        //Solidity에서 문자열을 합치는 가장 효과적이고, 효율적인 방법은 abi.encodedPacked
        return string(abi.encodePacked(metadataURI, '/', Strings.toString(_tokenId), '.json'));
        //toString을 사용하지 않을 경우, _tokenId는 byte representation로 표현
        //이 경우, 숫자 123이 0x000...07b 등으로 반환되어 url이 생성될 수 있음
    }


}