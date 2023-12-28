
import React, {FC, useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';  // Route 중첩 시, 자식 route의 위치 지정 

import Header from './Header';
import Footer from './Footer';

import Web3, { Contract, ContractAbi } from 'web3';
// import { useSDK } from "@metamask/sdk-react";

import mintNftAbi from '../abis/mintNftAbi.json';
import saleNftAbi from '../abis/saleNftAbi.json';

import { MINT_NFT_CONTRACT, SALE_NFT_CONTRACT } from '../abis/contractAddress';

// FC: Function Component. 함수형 컴포넌트 정의에 사용
// TypeScript를 사용할 때 FC는 component가 받을 props의 타입을 지정하는데 유용하다
// GalleryLayout에서는 FC를 사용하지 않아도 큰 문제는 없을 것 같지만,
// TypeScript로 코딩 중이니 FC 선언
const GalleryLayout = () => {

    // React Hooks(introduced in React 16.8)
    // useState: component가 rendering 될 때, 동일한 상태값을 유지할 수 있도록 한다
    // Hooks: useState, useEffect, useContext, useReducer, useRef, useMemo, useCallback
    const [account, setAccount] = useState<string>(""); // account의 초기값을 ""로 설정
    
    // NFT contract와 연결. 연결을 위해 NFT contract의 address와 ABI 정보가 필요.
    // 좀 더 원시적인 접근을 구현해야 Metamask가 어떤 작업을 대신해주는지 정확히 알 수 있을 듯
    const [web3, setWeb3] = useState<Web3>();
    const [NFTContract, setNFTContract] = useState<Contract<ContractAbi>>();
    const [SALEContract, setSALEContract] = useState<Contract<ContractAbi>>();
    

    // 브라우저에 MetaMask가 설치되어 있지 않다면, useSDK는 undefined 반환
    // Ethereum Provider: Ethereum blockchain과 상호작용하기 위한 interface 또는 연결 매커니즘
    // - 정의: 일반적으로 웹 어플리케이션과 Ethereum blockchain 간의 통신을 가능하게 하는 소프트웨어 구성요소
    // - 역할: 블록체인 상의 데이터를 읽거나, 트랜잭션을 보내는 등의 작업을 할 때 필요한 모든 네트워크 통신을 처리
    // - 종류: HTTP provider(Infura or Alchemy), WebSocket provider, Web3 provider(Metamask)
    
    //const { provider } = useSDK();

    const connectMetamask = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'}) as string[];
                if( accounts ) {
                    setAccount(accounts[0]);
                    setWeb3(new Web3(window.ethereum));
                }                
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("You need Metamask extension.")
        }
    }

    /*
    // Metamask 지갑 연결 시, useEffect
    useEffect( ()=> {
        if(!provider) return;  // 메타마스크 지갑 연결 확인
        setWeb3(new Web3(provider));    //메타마스크 지갑 계정 정보로 Web3 인스턴스 생성
        console.log("set provider:", provider)
    }, [provider]);
    */

    // Metamask 커넥팅 시 SDK 말고, window.ethereum을 통해 접근
    useEffect( () => {
        connectMetamask();
    }, []);

    // Web3 인스턴스 생성 시, useEffect
    useEffect( () => {
        if(web3) {
            setNFTContract( new web3.eth.Contract(mintNftAbi, MINT_NFT_CONTRACT));
            setSALEContract( new web3.eth.Contract(saleNftAbi, SALE_NFT_CONTRACT));
        }
    }, [web3]);

    // const { provider } = useSDK();
    // const [web3, setWeb3] = useState<Web3>();
    // provider와 web3은 어떤 작업을 하고, 어떻게 상호작용하는가?
    // provider:: socket 개념에 가깝다. 웹 어플리케이션과 이더리움 네트워크 간 연결점 역할. 
    // provider는 Ethereum JSON RPC를 통해 구조화된 데이터를 송수신할 수 있는 기능을 제공한다
    // Web3:: web3 라이브러리는 Ethereum blockchain과 상호작용하는데 필요한 API 기능 제공. 
    // Web3: HTTP client library와 비슷한 개념

    // Outlet의 위치에, App.tsx에서 설정한 3개의 페이지가 렌더링됨.
    // 그리고 GalleryLayout에서 선언한 props를 자식 페이지에 전달 가능
    return (
        <div>
            <Header account={account} setAccount={setAccount}/>
            <Outlet context={ { account, web3, NFTContract, SALEContract } }/>
            <Footer />
        </div>

    );
}


export default GalleryLayout;


