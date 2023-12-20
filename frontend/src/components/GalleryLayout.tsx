
import React, {FC} from 'react';
import {Outlet} from 'react-router-dom';  // Route 중첩 시, 자식 route의 위치 지정 

import Header from './Header';
import Footer from './Footer';


// FC: Function Component. 함수형 컴포넌트 정의에 사용
// TypeScript를 사용할 때 FC는 component가 받을 props의 타입을 지정하는데 유용하다
// GalleryLayout에서는 FC를 사용하지 않아도 큰 문제는 없을 것 같지만,
// TypeScript로 코딩 중이니 FC 선언
const GalleryLayout:FC = () => {

    // Outlet의 위치에, App.tsx에서 설정한 3개의 페이지가 렌더링됨.
    // 그리고 GalleryLayout에서 선언한 props를 자식 페이지에 전달 가능
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>

    );
}


export default GalleryLayout;

