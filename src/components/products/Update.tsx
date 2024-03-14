import React, { useEffect, useReducer, useState } from "react"
import { API, sendJSON, headerUser, addInput, makeArray, ICON, GET, Product, HelperCss, uploadFile, makeToken } from "../init/func"
import NavbarMain from "../nav/NavbarMain"
import FormContrainer from "./FormContrainer"
import { Constants, Func, MiniComp } from "./init"

namespace Reducer {
   export const 
      reducer = function<T>(state:T[], props: {key:number, setter:T}) {
         const index = props.key + 1
         return index >= state.length ? 
            makeArray(index).map(i=>i === props.key ? props.setter : state[i]) :
            state.map((i,k)=>k === props.key ? props.setter:i)
          
      } 
}

const padding = "px-2 py-1"

function Update () {

   const 
      // form
      [name, setName] = useReducer(Reducer.reducer<string>,[]),
      [qty, setQty] = useReducer(Reducer.reducer<number>,[]),
      [price, setPrice] = useReducer(Reducer.reducer<number>,[]),

      // nullable
      [desc, setDesc] = useReducer(Reducer.reducer<string>,[]),
      [file, setFile] = useReducer(Reducer.reducer<File | string>,[]),

      //
      [length, setLength] = useState(10),
      [prod,setProd] = useState<Product[]>([]),
      [idClicked, setIdClicked] = useState<[string, string]>(["", ""]),


      create = (imgToken:string[]) =>
         makeArray(length).map(i=>{
            const fileByIndex = file[i]

            return {
               name: name[i], 
               qty: qty[i],
               price: price[i],
               desc:desc[i],
               img:  !fileByIndex ? null :
                  typeof fileByIndex === "string" ? fileByIndex : 
                  JSON.stringify({name : imgToken[i] + fileByIndex.name, size: fileByIndex.size})
            }
         }),
      setAllForm = (key:number,product:Product) => {
         setName({key: key, setter:product.name})
         setQty({key: key, setter:product.qty})
         setPrice({key: key, setter:product.price})
         setDesc({key: key, setter:product.descript})
         setFile({key: key, setter:product.img!})
      },

      submit = () => {
         const imgToken = makeToken(length)
         
         sendJSON(
            "/auth/product_update", 
            create(imgToken)
         ).then(()=>uploadFile(file.filter(i=>typeof i !== "string") as File[], imgToken))
         
         return true
      },
      onEnter = (index:number,e:React.KeyboardEvent<HTMLInputElement>) => {
         const val = Func.productSorter(name[index], prod)[0]
         if (e.key === "Enter" && !!val ) {
            setAllForm(index,val)
         }
      }

      GET<Product[]>("/auth/product_all").then(e=>setProd(e.data.datas))

      useEffect(()=>{
         addInput(setLength, length, name, qty, price)
      
         Func.formScript(idClicked)
      }, [JSON.stringify([name,qty, price, idClicked])])

   return <>
      <FormContrainer onClick={submit}>
         <div className="w-[200vw] h-full md:w-screen lg:w-full">         
            <div className={`w-full flex  text-white text-center font-medium`}>
               <p className={`${Constants.Vs_INPUT} break_word  break_word  ${padding} bg-white text-black md:rounded-tl-md `}>N</p>
               <p className={`${Constants.L_INPUT} ${padding} bg-black`}>Name</p>
               <p className={`${Constants.M_INPUT} ${padding} bg-black`}>Quantity</p>
               <p className={`${Constants.M_INPUT} ${padding} bg-black`}>Price</p>
               <p className={`${Constants.L_INPUT} ${padding} bg-black`}>File</p>
               <p className={`${Constants.L_INPUT} ${padding} bg-black md:rounded-tr-md`}>Desc</p>
            </div>
            
            {makeArray(length).map(i=>
               <div className={`w-full flex text-center`}>
                  {/* Number */}
                  <p className={`${Constants.Vs_INPUT} break_word  break_word  ${padding} ${HelperCss.gridC} bg-black text-white ${i + 1 === length && "md:rounded-bl-md"} lg:1/6`}>{i + 1}</p>
         
                  {/* Name */}
                  <div className={`relative ${Constants.L_INPUT} text-black`}>
                     <input
                        // event
                        onChange={e=>setName({key:i, setter:e.target.value})}
                        onClick={()=>setIdClicked([idClicked[1], `name[${i}]`])}
                        onKeyDown={(e)=>onEnter(i,e)}

                        // class property
                        type="text" 
                        key={"name"+i}
                        id={`input-name[${i}]`}
                        value={name[i]}
                        className={`outline-none ${Constants.INPUT_BORDER} ${padding} text-left w-full h-full bg-white`} />

                     <MiniComp.ProductPopup index={i} name={name} onClick={(prod:Product)=>setAllForm(i,prod)} product={prod} key={i}/>
                  </div>
         
                  {/* Qty */}
               <div className={`relative ${Constants.M_INPUT}`}>
                  <input 
                     type="number"
                     name={`${i}`} 
                     key={`qty${i}`}
                     value={qty[i] ?? null}
                     id={`input-qty[${i}]`}
                     className={ `h-full w-full ${Constants.INPUT_BORDER} outline-black border-black text-center bg-white`}

                     onClick={()=>setIdClicked([idClicked[1], `qty[${i}]`])}
                     onChange={(e)=>setQty({key:i,setter:parseInt(e.target.value)})} />
               </div>

               {/* Price */}
               <div className={`relative ${Constants.M_INPUT}`}>
                  <input 
                     type="number" 
                     name={`${i}`} 
                     key={`price${i}`}
                     id={`input-price[${i}]`}
                     value={price[i]}
                     className={ `h-full w-full ${Constants.INPUT_BORDER} outline-black border-black text-center bg-white`} 

                     onClick={()=>setIdClicked([idClicked[1], `price[${i}]`])}
                     onChange={(e)=>setPrice({key:i,setter:parseInt(e.target.value)})}/>
               </div>

               {/* file */}
               <label 
                  className={`${Constants.L_INPUT} flex justify-center items-center ${Constants.INPUT_BORDER} relative bg-white`} 
                  onClick={()=>setIdClicked([idClicked[1], ""])}>
                  <>
                     <span className={ICON}>upload</span>
                     <p className="font-medium ml-2">{
                        !file[i] ? 
                           "Choose file" : 
                        typeof file[i] === "string" ? 
                           (file[i] as string) : 
                           (file[i] as File).name}
                     </p>
                  </>

                  <input 
                     id={`file[${i}]`}
                     type="file" 
                     name={`${i}`} 
                     key={`file${i}`}
                     accept="image/png|img|jpg"
                     className={`hidden`} 
                     onChange={(e)=>setFile({key:i,setter:e.target.files![0]})} />
               </label>

               {/* descript */}
               <textarea  
                  name={`${i}`} 
                  key={`desc${i}`}
                  value={desc[i]}
                  id={`input-desc[${i}]`}
                  className={`${Constants.L_INPUT} ${Constants.INPUT_BORDER} outline-black text-left resize-none bg-white ${i + 1 === length && "md:rounded-br-md"}`} 

                  onClick={()=>setIdClicked([idClicked[1], `desc[${i}]`])}
                  onChange={(e)=>setDesc({key:i, setter:e.target.value})} />
               </div>   
            )}
         </div>
      </FormContrainer> 
   </> 
}

export default () => <><NavbarMain title="Update Product" children={<Update />}/></>