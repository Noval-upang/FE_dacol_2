type Props = {
   label:string
   onChange: (e:string) => void
   children?:React.ReactElement
   type : "text" | "password"
   err?:string
}

export default function (props: Props) {
   return <>
      {/* form input */}
      <label className="flex flex-col mt-2">
         <h1 className={"text-lg " + (!props.err || "text-red-500")}>{props.label}</h1>
         <input 
            type={props.type}  
            className={"bg-white px-4 py-2 text-lg rounded-md border border-black outline-none " + (!props.err || "border-2 border-red-500")} 
            onChange={(e) => props.onChange(e.target.value)} />
         {props.children}
      </label>
   </> 
}