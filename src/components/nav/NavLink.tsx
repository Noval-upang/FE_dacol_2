import { Link } from "react-router-dom"
import { ICON } from "../init/func"


const
   // slices url (GET /location user/:parameter)
   getPathname = () => window.location.pathname.split("/"),
   getLocation = () => "/" + (getPathname().at(3) ?? getPathname().at(1)  ?? "")

export default function (props:{icon:string, name:string, to:string}) {  
   const linkClass = "p-2 my-2"
   const activeC = "ml-2 bg-[#3296df] rounded-l-full text-white "

   const icon = (active:boolean) => (
      <div className={`${linkClass} ${active && activeC} flex`}>
         <span className={ICON}>{props.icon}</span>
         <p className="ml-3">{props.name}</p>
      </div>
   )

   return getLocation() === props.to ? 
      icon(true):
      <Link to={props.to === "home" ? "/" : props.to}>{icon(false)}</Link> 
}
