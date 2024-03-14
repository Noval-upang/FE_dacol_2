import './css/App.css';
import './css/init.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Login from './user/Login';
import Register from './user/Register';
import { createContext, useReducer, useState } from 'react';
import { LoadingCtx, Type, getUser, parseToken } from './init/func';
import NotFoundOrReject from './init/NotFoundOrReject';

// Product
import ProdAdd from "./products/Add"
import ProdAll from "./products/All"
import ProdDetail from "./products/Detail"
import ProdStat from "./products/Stat"
import SellingM from './products/SellingM';
import ProdUpdate from './products/Update';

export const LoadingContext = createContext<null | LoadingCtx>(null)

export default function () {
  const JSONData = parseToken()
  if (!!JSONData && ((new Date()).getTime() > JSONData.expired)) {
    localStorage.clear()
  }
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <BrowserRouter>
      {!JSONData ? 
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='*' element={<Navigate to="/login"/>}/>
        </Routes>
        : 
        <>
          <LoadingContext.Provider value={[loading, setLoading]}>
            <Routes>
              <>
                <Route path='/' element={<ProdAll/>}/>
                <Route path='/add' element={<ProdAdd />}/>
                <Route path='/update-product' element={<ProdUpdate />}/>
                <Route path='/selling-mode' element={<SellingM />}/>
              </>

              <Route path='/product/:id'>
                <Route index element={<ProdDetail/>}/>
                <Route path='stat' element={<ProdStat/>}/>
              </Route>

              <Route path='*' element={<NotFoundOrReject/>}/>
            </Routes>
          </LoadingContext.Provider>
        </>}
    </BrowserRouter>
  );
}