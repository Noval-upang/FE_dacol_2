import { Link } from "react-router-dom";
import Init from "./Init";
import NavLink from "./NavLink";

export default function (props:{title:string, children:React.ReactNode}) {
   return (
      <Init title={props.title} content={props.children}>
         <NavLink to="/add" icon="playlist_add" name="Add Product" />
         <NavLink to="/update-product" icon="edit_note" name="Update Product"/>
         <NavLink to="/selling-mode" icon="add_shopping_cart" name="Selling Mode"/>
      </Init>
   )
}