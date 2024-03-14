import { useState } from "react"
import { Link, redirect } from "react-router-dom"

export default function () {
   const [show, setShow] = useState(false)
   const [target, setTarget] = useState(1)

   const nextPevBg = "bg-[#2d62ff]"
   const cToPageBg = "bg-[#8da9fb]"
   const textC = "text-white"
   const classB = 'rounded-md border px-4 py-2 ml-2'  
   return (
      <div className="hidden sm:block">
         <div className="flex justify-end">
            {/* Prev page */}
            <button type="button" className={`${classB} ${textC} ${nextPevBg}`}>
               {"< Prev"}
            </button>

            {/* To page */}
            <Link to="#1" className={`${classB} ${textC} ${cToPageBg}`}>1</Link>
            {show ? 
               <div className={`border rounded-md flex ml-2 ${cToPageBg}`}>
                  <p className={`text-xl py-1 px-3 ${textC} `}>To</p>
                  <input 
                     type="number" 
                     className="w-8 text-xl outline-none px-1 text-center"
                     onChange={(e)=>setTarget(parseInt(e.target.value))}
                     onKeyDown={(e)=>{
                        if (e.key === "Enter") window.location.href = window.origin+`#${target}`
                     }}
                     value={target} />
               </div>
               :
               <button 
                  type="button" 
                  className={`${cToPageBg} ${textC} tracking-widest font-semibold text-xl py-1 px-3 shadow-md ml-2 rounded-md`}
                  onClick={()=>setShow(true)}>
                     ...
               </button>
            }

            {/* Next page */}
            <button type="button" className={`${classB} ${textC} ${nextPevBg}`}>
               {"Next >"}
            </button>
         </div>
      </div>
   )
}