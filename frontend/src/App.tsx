import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

//components
import GalleryLayout from './components/GalleryLayout';
//import { MetaMaskProvider } from './components/MetaMaskContext';

//pages
import Auditorium from './pages/Auditorium';
import Artandartists from './pages/Artandartists';
import Store from './pages/Store';


const App = () => {
  // 하위 페이지에서 MetaMask 로그인 정보와 Contract 정보를 공유해서 사용할 수 있도록 Layout 선언
  // Outlet 기능 사용
  return (
    <BrowserRouter>
      <Routes>      
        <Route path="/" element={<GalleryLayout />}>
          <Route index element={<Auditorium />} />
          <Route path="/art-and-artists" element={<Artandartists />} />
          <Route path="/store" element={<Store />} />
        </Route>
      </Routes>
    </BrowserRouter>    
  );
}

export default App;
