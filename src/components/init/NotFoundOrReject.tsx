export default function () {
   const location = window.location.href
   return <>
      {location === "/login" || "register" ? 
         <Status403/> :
         <Status404 />
      }
   </> 
}

function Init(props:{status:number, children: React.ReactElement}) {
   return <>
      <div className="m-4">
         <p className="text-xl font-bold">{props.status}</p>
         {props.children}
      </div>
   </>
}

function Status403() {
   return <>
      <Init status={403}>
         <p>This side was blocked</p>
      </Init>
   </>
}



function Status404() {
   return <Init status={404}>
      <p>Not found</p>
   </Init>
}
