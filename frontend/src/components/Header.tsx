import React from 'react';
import { Link} from 'react-router-dom';
import { useMetaMask } from './MetaMaskContext'

const Header = () => {
    const {account, setAccount} = useMetaMask();

    const connectMetaMask = async() => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAcocunts'}) as string[];
                setAccount(accounts[0]);
            } catch (error) {
                console.error(error);
            }

        } else {
            console.log("Err on MetaMask");
        }

    };

    return (
        <div className="mx-auto max-w-[1920px] flex flex-col justify-between items-left py-2">
            <h1 className="text-xl font-bold">
                Boutique of Modern Art
            </h1>
            <p>MetaMaskButton: </p>
            {account ? (
                <div>Connected: {account}</div>
            ) : (
                <button onClick={connectMetaMask}>Connect MetaMask</button>
            )}
              
            <nav>
                <ul className="flex space-x-4">
                <li><Link to="/">Auditorium</Link></li>
                <li><Link to="/art-and-artists">Art and artists</Link></li>
                <li><Link to="/store">Store</Link></li>
                </ul>
            </nav>
        </div>
      );
  }
  
  export default Header;