import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Station from './components/pages/Station'
import PRoute from './components/pages/Route'

function App() {
  return (
    <div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/station/*" element={<Station />}></Route>
					<Route path="/route/*/*" element={<PRoute />}></Route>
					{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					{/* <Route path="*" element={<NotFound />}></Route> */}
				</Routes>
			</BrowserRouter>
    </div>
  );
}

export default App;
