import { useEffect, useReducer, useState } from "react"
import {   GET, HelperCss, ICON, Month, Product, Selling, makeArray } from "../init/func"



import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js";
import { Line } from "react-chartjs-2";

import NavbarMain from "../nav/NavbarMain"
import { Func } from "./init"
import PageNav from "../init/PageNav";


const layer = "p-2 rounded-md bg-white mt-4 "

Chart.register(CategoryScale)

function Grap() {
   const [data, setData] = useState<Selling[]>([])

   GET<Selling[]>("/auth/selling").
      then(({data})=>setData(data.datas ?? []))

  
   const 
      sellingList = makeArray(12).slice(0, new Date().getMonth() + 1).reduce((prev, i)=> {
         return [
            ...prev,
            data
               .filter(j=>j.date.split("/")[1] === String(i + 1))
               .length]
      }, [] as number[]),
      provit = data.reduce((prev, i) => prev + i.provit, 0)
   
   

   return <div className={layer + "p-3"}>
      <Line 
         data={{
            labels: Month as string[],
            datasets:[{
               label: "Selling monthly",
               data: sellingList,
               fill: false,
            }],
         }} 

         options={{
            borderColor: 'rgb(100, 192, 192)',
            backgroundColor:"rgb(100, 192, 192)",
            
         }}>
      </Line>

      <div className="mt-4 flex items-center justify-end" title="Provit">
         <span className={ICON + "rounded-full p-1 bg-yellow-400 text-white"}>attach_money</span>
         <p className="ml-[0.35rem] text-xl font-medium">{provit}</p>
      </div>
   </div>
}

function reducer(prevS:[string, string], newS:string) {
   return [prevS[1], newS] as [string,string]
}
function Table() {
   const 
      [search, setSearch] = useState<string>(""),
      [datas, setDatas] = useState([] as Product[]),
      [idClicked, setIdClicked] = useReducer(reducer, ["", ""]),

      hash = window.location.hash.slice(-1)[0],
      pageNm = !hash ? 0 : parseInt(hash)
      
   if (datas.length < 1) { 
      GET<Product[]>("/auth/product_all").
         then(({data})=>setDatas(data.datas == undefined ? [] : data.datas))
   }
   
   useEffect(() => {
      setDatas(Func.productSorter(search, datas))
      // open detail product

      if (!!idClicked[1]) {
         document.getElementById(`detail-${idClicked[1]}`)!.style.visibility = "visible"
      }
      if (!!idClicked[0]) {
         document.getElementById(`detail-${idClicked[0]}`)!.style.visibility = "hidden"
      }
   }, [search, idClicked])
   
   return <div className={layer}>
      {datas.length !== 0 ? 
      <>    
         <div className="flex m-2">
            <div className={`${HelperCss.gridC} px-2 bg-slate-200 rounded-l-md`}>
               <span className={`${ICON}`}>search</span>
            </div>
            <input 
               type="text" 
               onChange={(e)=>setSearch(e.target.value)} 
               value={search} 
               className="outline-none px-2 w-full py-1 text-lg border border-[rgb(0,0,0,0.35)] rounded-r-md" />
         </div>
         <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {datas.slice(pageNm * 20, pageNm * 20 + 20).map((i, k)=>
               <div key={k}>
                  <div className="m-2 hover:cursor-pointer" onClick={()=>setIdClicked(`${i.id}`)}>
                     <img 
                        src={!i.img ? "" : `${process.env.REACT_APP_ORIGIN}/public/${i.img}`} 
                        alt="gambar" 
                        className="w-full  min-h-[5rem] max-h-[7rem] bg-black rounded-t-md" />
                     <p className="text-sm p-2 bg-slate-200 rounded-b-md">{i.name}</p>
                  </div>

                  <div className={`${HelperCss.gridC} z-10 top-0 left-0 invisible absolute h-screen w-screen bg-[rgb(0,0,0,0.75)]`} id={`detail-${i.id}`}>
                     <div className="w-4/5 bg-white rounded-md">
                        <div className="text-right border-b border-black">
                           <button className={`${ICON} font-bold m-2`} onClick={()=>setIdClicked("")}>close</button>
                        </div>

                        {/* Product content */}
                        <div className="p-3 pt-1">
                           <h1 className="text-xl">{i.name}</h1>
                           <p className={`${i.descript === "" && "font-light"} mt-2`}>{i.descript || "No Description"}</p>
                           <div className="flex mt-2">
                              <p className="w-1/2 break-words">Quantity : {i.qty}</p>
                              <p className="w-1/2 break-words">Price : {i.price}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>)
            }
         </div>
         {datas.length > 20 && <PageNav/>}
      </>
      :
      <div className={`h-40 ${HelperCss.flexC} flex-col`}>
         <span className={ICON + "text-red-600"}>close</span>
         <p className="text-2xl font-semibold">You dont have product</p>
      </div>
   }
   </div>
}


export default function () {
   return <> 
      <NavbarMain title="Home">
         <div className="mx-4 my-2">
            <Grap />
            <Table/>
         </div>
      </NavbarMain>
   </>
}
