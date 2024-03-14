import React, { useContext, useEffect, useReducer, useState } from "react"
import { API, sendJSON, headerUser, addInput, makeArray, ICON, Product, makeToken, uploadFile } from "../init/func"
import NavbarMain from "../nav/NavbarMain"
import FormContrainer from "./FormContrainer"
import { Constants } from "./init"
import { LoadingContext } from "../App"

type TCheck = any|undefined
type ChangeE<T> = React.ChangeEvent<T>
type Error = {[key: number]: {[key:string]:string}}

namespace Reducer {
   export const 
      reduceInit = function<T, E extends {name:string}>(state: T[],e:ChangeE<E>, newS : T) {
         const key = parseInt(e.target.name)
         return key + 1 >= state.length ? 
            makeArray(key+1).map(i=>i === key ? newS : state[i]) :
            state.map((i,k)=>k === key ? newS:i)
      },

      reduce = function<T>(state:T[],e:ChangeE<HTMLInputElement>) { 
         return reduceInit(state,e, e.target.value as T)
      },

      reduceNum = (state:number[], e:ChangeE<HTMLInputElement>) => {
         return reduceInit(state, e, parseInt(e.target.value))
      },
      
      reduceFile = (state:File[],e:ChangeE<HTMLInputElement>) => {
         const files = e.target.files![0]

         return reduceInit(state,e,files)
      }
}
 
namespace Script {
   export const 
      rowHaveError = (state: Error, formName:string) => {
         return Object.values(state).some(i=>!!i[formName]) ? 
            `bg-[#ff2d03]` : 
            "bg-black"
      },
      
      borderErr = (state: TCheck) => {
         return state ? `bg-[#ffd2d2]` : "bg-white"
      },
      
      updateErrBox = (target:string,state:"hidden"|"visible") => {
         const elm = document.getElementById("err-"+target)!
         elm.style.visibility = state
      },

      autoResize = (target:string) => {
         const elm = document.getElementById(target)! as HTMLTextAreaElement
         elm.style.height = "auto"
         elm.style.height = elm.scrollHeight + "px"
      },

      onEnter = function<T extends {code:string}>(locationInput:string, e:T) {
         const 
            indexTarget = locationInput.replace(/\D/g, ""),
            nameLocationNow = locationInput.replace(/[^a-z]/g, ""),
            targetLocation = 
               nameLocationNow === "name" ? 
                  "qty" : 
               nameLocationNow === "qty" ? 
                  "price" : 
               nameLocationNow === "price" ? 
                  "file" : 
               nameLocationNow === "file" ?
                  "desc" :
                  "name",
            elm = document.getElementById(`input-${targetLocation}[${indexTarget}]`)
         if (e.code === "Enter" && elm ) {
            elm.click()
            elm.focus()
         }
      }
   
}  

namespace MiniComp {
   export const 
      ErrContainer = (props:{index:number,err:Error,name:string,children?:React.ReactNode}) => {
         return <div className="top-full z-[1] w-full absolute bg-[#ff8989] invisible" id={`err-${props.name}[${props.index}]`}>
            {!!props.err[props.index]?.[props.name] &&
               <div className="p-1 flex items-center">
                  <span className={ICON + "mr-1"}>error</span>
                  <p className="font-medium -tracking-tighter">{props.err[props.index][props.name]}</p>
               </div> }
            {props.children}
         </div>
      }

}

function Add () {
   const 
      // form
      [name, setName] = useReducer(Reducer.reduce<string>,[]),
      [qty, setQty] = useReducer(Reducer.reduceNum,[]),
      [price, setPrice] = useReducer(Reducer.reduceNum,[]),

      // nullable
      [desc, setDesc] = useReducer( 
         (prev:string[], e:ChangeE<HTMLTextAreaElement>)=> Reducer.reduceInit(prev, e, e.target.value),
         []),
      [file, setFile] = useReducer(Reducer.reduceFile,[]),

      //
      [length, setLength] = useState(10),
      [idClicked, setIdClicked] = useReducer((prev:[string,string],newStatre:string)=> [prev[1], newStatre] as [string,string] ,["", ""]),

      // capture index where value is error
      [err, setErr] = useState<Error>({}),

      create = (imgToken:string[]) =>
         makeArray(length).reduce((prev, i)=>{
            const 
               fileByIndex = file[i],
               productForm = {
                  name: name[i], 
                  qty: qty[i],
                  price: price[i],
                  descript:desc[i],
                  img:  !fileByIndex ? null : JSON.stringify({name : imgToken[i] + fileByIndex.name, size: fileByIndex.size}),
                  id: i
               } 
            
            /**
             * checking if all data undefined
             * if id === "key" this will skip
             * if not is gone check undefined or not
             */
            if (
               Object.
                  entries(productForm).
                  every(([key, val])=> key === "id" || !val))
               return prev
            
            return [...prev, productForm] 
         },[] as Product[]),


      submit = () => {
         const imgToken = makeToken(length)
         sendJSON(
            "/auth/product_add", 
            create(imgToken)
         )
         .then(()=>
            file.length > 0 && uploadFile(file,imgToken)
         )
         .catch((err)=>
            setErr(err.response.data.errors)
         )

         return Object.keys(err).length < 1
      },

      sliceName = (name:string) => {
         if (name.length > 10) {
            const arrName = name.split(".")
            return <>{arrName[0].slice(0, 5)}..<b>.</b>{arrName.slice(-1)[0]}</>
         }
         return name
      }

      useEffect(()=>{
         addInput(setLength, length, name, qty, price)

         const descIdClicked = (target:number) => /desc\[\d\]/.test(idClicked[target])

         if (!!idClicked[0] && !descIdClicked(0))Script.updateErrBox(idClicked[0], "hidden")
         if (!!idClicked[1] && !descIdClicked(1)) Script.updateErrBox(idClicked[1], "visible")
      }, [JSON.stringify([name, qty,price,file,desc, idClicked,err])])

   return <>
      <FormContrainer onClick={()=>submit()} >         
         <div className="w-[200vw] h-full md:w-screen lg:w-full">         
            <div className={`w-full flex  text-white text-center font-medium`}>
               <p className={`
                  bg-white text-black border-black 
                  ${Constants.Vs_INPUT} break_word  break_word  ${Constants.PADDING_INPUT} ${Constants.INPUT_BORDER} ${Constants.BORDER_LEFT} 
                  md:rounded-tl-md`}>N</p>
               <p className={`${Constants.L_INPUT} ${Constants.PADDING_INPUT} ${Constants.INPUT_BORDER} border-black ${Script.rowHaveError(err,"name")}`}>Name</p>
               <p className={`${Constants.M_INPUT} ${Constants.PADDING_INPUT} ${Constants.INPUT_BORDER} border-black ${Script.rowHaveError(err,"qty")}`}>Quantity</p>
               <p className={`${Constants.M_INPUT} ${Constants.PADDING_INPUT} ${Constants.INPUT_BORDER} border-black ${Script.rowHaveError(err,"price")}`}>Price</p>
               <p className={`${Constants.L_INPUT} ${Constants.PADDING_INPUT} ${Constants.INPUT_BORDER} border-black ${Script.rowHaveError(err,"file")}`}>File</p>
               <p className={`${Constants.L_INPUT} ${Constants.PADDING_INPUT} ${Constants.INPUT_BORDER} border-black bg-black md:rounded-tr-md`}>Desc</p>
            </div>
            
            {makeArray(length).map(i=>
               <div className="w-full flex text-center">
                  {/* Number */}
                  <p 
                     className={`
                        ${Constants.Vs_INPUT} break_word  break_word  px-1
                        grid items-center bg-black text-white 
                        ${i + 1 === length && "md:rounded-bl-md"}`}>{i + 1}</p>
         
                  {/* Name */}
                  <div className={`relative border-b-2 border-r-2 border-black  ${Constants.L_INPUT} text-black`}>
                     <input
                        // event
                        onChange={setName}
                        onClick={()=>setIdClicked(`name[${i}]`)}
                        onKeyDown={e=>Script.onEnter(idClicked[1], e)}

                        // class property
                        autoComplete="off"
                        type="text" 
                        key={"name"+i}
                        id={`input-name[${i}]`}
                        name={`${i}`}
                        value={name[i] ?? ""}
                        className={`outline-none px-1 text-left w-full h-full ${Script.borderErr(err[i]?.["name"])}`} />

                     <MiniComp.ErrContainer index={i} name="name" err={err}/>
                  </div>
         
                  {/* Qty */}
               <div  
                  className={`relative ${Constants.M_INPUT} border-b-2 border-r-2 border-black `} 
                  onClick={()=>setIdClicked(`qty[${i}]`)}>
                  <input 
                     type="number"
                     name={`${i}`} 
                     key={`qty${i}`}
                     value={qty[i] ?? null}
                     id={`input-qty[${i}]`} 
                     className={ `h-full w-full outline-black border-black  text-center ${Script.borderErr(err[i]?.["qty"])}`}

                     onChange={setQty}
                     onKeyDown={e=>Script.onEnter(idClicked[1], e)} />
                  <MiniComp.ErrContainer index={i} name="qty" err={err}/>
               </div>

               {/* Price */}
               <div 
                  className={`relative ${Constants.M_INPUT} border-b-2 border-r-2 border-black`} 
                  onClick={()=>setIdClicked(`price[${i}]`)}>
                  <input 
                     autoComplete="off"
                     type="number" 
                     name={`${i}`} 
                     key={`price${i}`}
                     id={`input-price[${i}]`} 
                     value={price[i] ?? null}
                     className={ `h-full w-full outline-black  border-black  text-center ${Script.borderErr(err[i]?.["price"])}`} 
                     onChange={setPrice}
                     onKeyDown={e=>Script.onEnter(idClicked[1], e)}/>
                  <MiniComp.ErrContainer index={i} name="price" err={err}/>
               </div>

               {/* file */}
               <div 
                  id={`input-file[${i}]`} 
                  className={`${Constants.L_INPUT} ${Constants.INPUT_BORDER} cursor-pointer border-b-2 border-r-2 border-black flex justify-center items-center relative ${Script.borderErr(err[i]?.["file"])}`} 
                  onClick={()=>{
                     document.getElementById(`file[${i}]`)!.click()
                     setIdClicked(`file[${i}]`)
                  }}>
                  <>
                     <span className={ICON}>upload</span>
                     <p className="font-medium ml-2">{
                        !file[i] ? 
                           "Choose file" : 
                           sliceName(file[i].name) }
                     </p>
                     <MiniComp.ErrContainer index={i} name="file" err={err}/>
                  </>

                  <input 
                     id={`file[${i}]`}
                     type="file"
                     name={`${i}`} 
                     key={`file${i}`}
                     accept="image/png|img|jpg"
                     className={`hidden`} 
                     onChange={setFile} />
               </div>

               {/* descript */}
               <textarea  
                  name={`${i}`} 
                  key={`desc${i}`}
                  value={desc[i] ?? ""}
                  id={`input-desc[${i}]`}
                  className={`${Constants.L_INPUT} border-r-2 border-b-2 border-black ${i + 1 === length && "md:rounded-br-md"} bg-white px-1 outline-black text-left resize-none`} 
                  onFocus={()=>setIdClicked(`desc[${i}]`)}
                  onChange={setDesc}
                  onKeyDown={e=>Script.onEnter(idClicked[1], e)} />
               </div>   
            )}
         </div>
      </FormContrainer>
   </> 
}

export default () => <><NavbarMain title="Add Product" children={<Add />}/></>