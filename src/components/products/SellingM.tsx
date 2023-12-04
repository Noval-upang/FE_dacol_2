import { useEffect, useReducer, useState } from "react";
import {API, Datas, Product, addInput, getUser, headerUser, sendJSON} from '../init/func';
import FormContrainer from "./FormContrainer";
import { makeArray } from "../init/func";
import NavbarMain from "../nav/NavbarMain";
import { Constants, Func, MiniComp, Types } from "./init";

const 
   formS = "w-[100vw] flex md:w-full",
   outlineN = "outline-none",
   padding = "px-2x",
   borderI = "border-r-2 border-b-2 border-black",
   smallW = "w-[10%]",
   mediumW = "w-[40%]",
   larghW = "w-[50%]"

function reduce<T>(state:T[], props:{value:T, index:number}) {
   return props.index +1 >= state.length ? 
      makeArray(props.index + 1).map(i=> i === props.index ? props.value : state[i]) :
      state.map((i,k)=>k === props.index ? props.value : i)
}



export default function () {
   const
      // form data 
      [productList, setProductList] = useReducer(reduce<{name:string, id?:number}>,[]),
      [qty, setQty] = useReducer(reduce<number>,[]),

      // 
      [prod, setProd] = useState<Product[]>([]),
      [length, setLength] = useState(5),
      [idClicked, setIdClicked] = useState<[string, string]>(["", ""]),

      onEnter = (e:React.KeyboardEvent<HTMLInputElement>, index:number) => {
         const topProd = Func.productSorter(productList[index]?.name, prod)[0]
         if (topProd && e.code === "Enter") {
            setProductList({index:index, value: {name:topProd.name, id:topProd.id}})
            setIdClicked([idClicked[1], ""])
         }
      },

      submit = () => {
         const 
            productArr = makeArray(length).
               reduce<{id:number, qty:number}[]>((prev, i)=> {
                  const id = productList[i]?.id
                  return !id 
                     ? prev  
                     : [...prev, {id, qty: qty[i]}]    
               }, []),
            provit = productArr.
               reduce((prev, i)=> 
                  prod.find(j=>j.id === i.id)!.price * i.qty + prev
               , 0 ),
            date = new Date()

         
         sendJSON(`/auth/selling_add`,
         {
               product_list: JSON.stringify(productArr),
               provit,
               date:`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
            })
      }


   API
      .get<Datas<Product[]>>("/auth/product", {headers: {...headerUser()}})
      .then(res=>setProd(res.data.datas))

   useEffect(()=>{
      addInput(setLength, length, productList, qty)
      
      Func.formScript(idClicked)
   }, [JSON.stringify([productList,qty, idClicked])])

   return <>
      <NavbarMain title="Selling Mode">
         <FormContrainer onClick={submit}>
            
            <div className="h-full" id="table">         
               <div className={`${formS} bg-black text-white text-center font-medium`}>
                  <p className={`${smallW} ${padding} bg-white text-black`}>N</p>
                  <p className={`${larghW} ${padding}`}>Name</p>
                  <p className={`${mediumW} ${padding}`}>Quantity</p>
               </div>
               
               {makeArray(length).map(i=>
                  <div className={`${formS} text-center`}>
                     {/* Number */}
                     <p className={`${smallW} ${padding} border-b-2 border-black bg-black text-white`}>{i + 1}</p>
            
                     {/* Name */}
                     <div className={`relative ${borderI} ${larghW} text-black`}>
                        <input
                           // event
                           onChange={e=>
                              setProductList({
                                 index:i, 
                                 value:{name:e.target.value, id:prod.find(i=>i.name === e.target.value)?.id}
                              }
                           )}
                           onClick={()=>setIdClicked([idClicked[1], `name[${i}]`])}
                           onKeyDown={e=>onEnter(e, i)}

                           // class property
                           type="text" 
                           key={"name"+i}
                           id={`input-name[${i}]`}

                           value={productList[i]?.name}
                           className={`${outlineN} ${padding} ${(!productList[i]?.id && productList[i]?.name) && "border-red-500"} text-left w-full bg-white`} />

                        <MiniComp.ProductPopup 
                           index={i} 
                           name={productList.map(i=>i?.name)} 
                           onClick={(prod)=>
                              setProductList({
                                 index:i, 
                                 value:{name: prod.name, id:prod.id}
                              })
                           } 
                           key={i}
                           product={prod}/>
                     </div>
            
                     {/* qty */}
                     <input
                        type="number" 
                        key={"qty"+i}
                        id={`input-qty[${i}]`}
                        value={qty[i]}
                        onClick={()=>setIdClicked([idClicked[1], `qty[${i}]`])}
                        onChange={(e)=>setQty({index:i, value:parseInt(e.target.value)})}
                        className={`${mediumW} ${borderI} ${outlineN} ${padding} ${(productList[i]?.name && !qty[i]) && "border-red-500"} bg-white`} />
                  </div>   
               )}
            </div>
         </FormContrainer>
      </NavbarMain>
   </> 
}