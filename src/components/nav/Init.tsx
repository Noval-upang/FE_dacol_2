import { ICON, redirect } from "../init/func"
import NavLink from "./NavLink"

const 
   menu = () => (document.getElementById("menu")!),
   menuContainer = () => (document.getElementById("menu-cont")!)

function openMenu() {
   menuContainer().style.visibility = "visible"
   menu().style.left = "0"
}

function closeMenu() {
   menu().style.left = "-100%"
   menuContainer().style.visibility = "hidden"

}


export default function (props: {children:React.ReactNode, title:string, content:React.ReactNode}) {
   return <div className="lg:flex">
      <nav className="w-screen transition-all lg:w-[20%] lg:flex lg:flex-col" id="navbar">
         <div className="flex bg-black p-3 justify-between items-center">
            <h1 className="text-white text-lg font-medium">
               {props.title}
            </h1>
            <button type="button" className={ICON+"px-1 text-xl bg-white rounded-md border lg:hidden"} onClick={openMenu}>
               menu
            </button>
         </div>
         <menu className="absolute top-0 left-0 bg-[rgb(0,0,0,0.5)] invisible w-screen h-screen z-10 lg:visible lg:w-full lg:h-full lg:static" id="menu-cont">
            <div 
               className="absolute -left-full bg-white w-3/4 h-full transition-all duration-500 flex flex-col lg:w-full lg:static" id="menu">
               <button type="button" onClick={closeMenu} className={`${ICON} text-2xl text-left w-fit m-3 rounded-full lg:hidden`}>
                  cancel
               </button>

               <div className="flex flex-col">
                  <NavLink to="/" icon="home" name="Home"/>
                  {props.children}
               </div>

               <button 
                  className="mt-auto flex justify-center items-center font-semibold text-[#fa0000] text-lg p-2 border-t-2 border-[#cccccc] lg:p-1"
                  onClick={()=>{
                     localStorage.clear()
                     redirect("/login")
                  }}>
                     <span className={ICON}>logout</span> 
                     <p>Logout</p>
               </button>
               
            </div>
            
         </menu>
      </nav>

      <div className="overflow-auto bg-gray-200 form-container w-full">
         {props.content}
      </div>
   </div> 
}