import {  useState } from "react";
import * as init from "../init/func";
import { Link, redirect } from "react-router-dom";
import Input from "./Input";
import PError from "../init/PError";

type FormReg =  Partial<Omit<init.User, "id"> & {password2:string}>
type Err = FormReg & {
  err?: string;
};

export default function () {
  const [form, setFrom] = useState<FormReg>({})
  const [err, setErr] = useState<Err>({})
  
  const register = () => {
   	init.sendJSON<Err>("/register", form)
		.then(()=>window.location.href = "/login")
		.catch(res=>setErr(res.response?.data))
  	}
  
  return <>
		<div className={`${init.HelperCss.gridC} bg-gray-200 form-container py-8 `}>

  			<div className={`w-4/5 md:w-5/12`}>
				<h1 className="text-medium bg-white mb-2 rounded-lg p-2 text-center text-[1.35rem] ">Sign up</h1>

				<div className="flex flex-col bg-white px-7 py-4 rounded-lg">
					<Input 
						type="text" 
						label="Email :" 
						err={err?.email}
						onChange={(email)=>setFrom({...form, email})}></Input>
					{!!err?.email && <PError msg={err.email}/>}

					<Input
						type="password" 
						label="Password :" 
						err={err?.password}
						onChange={(password)=>setFrom({...form, password})}></Input>
					{!!err?.password && <PError msg={err.password}/>}
			
					<Input
						type="password" 
						label="Repert Password :" 
						err={err?.password}
						onChange={(password2)=>setFrom({...form, password2})}></Input>
					{!!err?.password && <PError msg={err.password}/>}

					<div className="mt-3">
						<button onClick={register} type="button" className="rounded-md bg-blue-500 w-full text-white text-lg py-1">Register</button>
						<p className="font-light m-2 text-center">Or</p>
						<p className="text-center text-lg">
							Click here to
							<Link 
								to="/login" 
								className="underline text-blue-700 ml-1 font-medium"
								>{"< Go back"}</Link>
						</p>
					</div>
					
				</div>
			</div>
		</div>
	</>
}
