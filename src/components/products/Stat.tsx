import { useEffect, useState } from "react"
import { API, GET, ICON, Month, Selling, makeArray } from "../init/func"
import NavbarProd from "../nav/NavbarProd"
import { Line } from "react-chartjs-2"

function Stat() {
   const 
      [datas, setDatas] = useState<Selling[]>([]),
      [k, setK]= useState<null|number>(null)

   
   GET<Selling[]>(`/auth/selling/${window.location.pathname.split("/")[2]}`)
      .then((i)=>setDatas(i.data.datas))   

      const 
         sellingList = makeArray(12).slice(0, new Date().getMonth() + 1).reduce((prev, i)=> {
            return [
               ...prev,
               datas
                  .filter(j=>j.date.split("/")[1] === String(i + 1))
                  .length]
         }, [] as number[]),
         provit = datas.reduce<number>((prev, i)=>prev+ i.provit, 0)
   

   return <>
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
   </>
}

export default () => <><NavbarProd title="Statictic" children={<Stat/>}/></>