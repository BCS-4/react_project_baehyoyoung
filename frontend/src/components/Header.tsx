import React, {Dispatch, SetStateAction} from 'react';
import { Link } from 'react-router-dom';

// import { useSDK } from '@metamask/sdk-react';
declare let ethereum: any;

// interface: a way to define the shape of an object or a contract

interface HeaderProps {
    account: string;
    setAccount: Dispatch<SetStateAction<string>>;

    // Dispatch: a type tha represents a function
    // SetStateAction: generic type that represents the type of value that can be passed to the state updater function
}

// const Header:FC<HeaderProps> = ({account, setAccount}) => { 
// 아래는 FC를 삭제하고 선언하는 방법
const Header = ({account, setAccount}: HeaderProps) => {
    // receive state and its updater function from a parent component

    // const { sdk } = useSDK();

    const connectMetaMask = async() => {
        try {
            // const accounts: any = await sdk?.connect();
            const accounts: any = await ethereum.request({method: 'eth_accounts'});
            // sdk가 null인 경우, await sdk?.connect()는 undefined를 반환하여 accounts는 undefined로 설정
            setAccount(accounts[0]);
            // accounts가 undefined인 경우, accounts[0]의 접근 로직에서 error가 발생하고 catch 구문으로 넘어감
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="mx-auto max-w-[1920px] flex-col items-left py-2">
            <div className="flex justify-between m-5">
                <h1 className="text-4xl font-bold">
                    Boutique of Modern Art
                </h1>
                <div className="text-green-500">
                    <p className="text-xl font-bold">Metamask </p>
                    {account ? (
                        <div className="flex-col">
                            <div>
                                <span>
                                    {account.substring(0, 7)}...
                                    {account.substring(account.length - 5)}
                                </span>                            
                            </div>
                            <button className="font-bold" onClick={ ()=>setAccount("")}>Logout</button>                
                        </div>
                        
                    ) : (
                        <button className="font-bold" onClick={connectMetaMask}>Connect Wallet</button>
                    )}
                </div>
            </div>
            <nav className="m-5">
                <ul className="text-2xl font-bold flex space-x-8">
                <li><Link to="/">Auditorium</Link></li>
                <li><Link to="/art-and-artists">Art and artists</Link></li>
                <li><Link to="/store">Store</Link></li>
                </ul>
            </nav>
        </div>
      );
  }
  
  export default Header;