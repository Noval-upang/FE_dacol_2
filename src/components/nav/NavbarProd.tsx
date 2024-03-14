import Init from "./Init"
import NavLink from "./NavLink"

export default function (props:{title:string, children:React.ReactNode}) {
   const param = window.location.pathname.split("/").at(2)
   return <>
      <Init title={props.title} content={props.children}>
         <NavLink to={`/product/${param}`} icon="info" name="Detail"/>
         <NavLink to={`/product/${param}/stat`} icon="bar_chart" name="Statistic"/> 
      </Init>
   </> 
}