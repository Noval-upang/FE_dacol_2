import { useEffect, useState } from "react"
import ChartJS from 'chart.js/auto';
import { GET, ICON, Product } from "../init/func";
import NavbarProd from "../nav/NavbarProd";

export default function () {

   const 
      spanS = "flex text-lg bg-gray-200 py-[0.35rem] px-4 mr-2 rounded-full bg-gray-200 ",
      [prod, setProd] = useState<Product>()

   useEffect(()=> {
      GET<Product>(`/auth/product/${window.location.pathname.split("/").at(2)}`) 
         .then(res=>setProd(res.data.datas))
   })
   
   return <>
      <NavbarProd title="Detail Product">
         <div className="bg-black h-[20rem]">
            img
         </div>
         <div className="flex justify-end mt-3">
            <div className={spanS}>
               <span className={ICON} title="Quantity"> </span>
               <p className="text-center ml-2 font-light">{prod?.qty}</p>
            </div>
            <div className={spanS}>
               <span className={ICON} title="Price">attach_money</span>
               <p className="text-center ml-2 font-light">{prod?.price}</p>
            </div>
         </div>
         <div className="my-1 mx-3">
            <h1 className="font-medium text-xl">{prod?.name}</h1>
            <p className="mt-2">{prod?.descript}</p>
         </div>
      </NavbarProd>
   </> 
}