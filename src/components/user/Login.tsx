import { FormEvent, useState } from "react";
import * as init from "../init/func";
import {  Link } from "react-router-dom";
import Input from "./Input";
import PError from "../init/PError";

export default function () {
	const [form, setFrom] = useState<Partial<init.User>>({})
	const [err, setErr] = useState<string|undefined>()

	const login = (e:React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		init.sendJSON<string>("/login", form).then((res)=>{
			localStorage.setItem(init.USERKEY, JSON.stringify({
				expired: (new Date()).getTime() + 1440 * 60000,
				token :res.data
			}))
			init.redirect("/")
		}).catch(({response})=>{
			setErr(response.data.errors)
		})
	}
  	return <>
		<form onSubmit={login} className={`${init.HelperCss.gridC} bg-gray-200 form-container md:h-auto`}>
			<div className={`py-8 w-4/5 md:w-5/12`}>
				<h1 className="text-medium bg-white mb-2 rounded-lg p-2 text-center text-[1.35rem]">Sign in</h1>

				<div className="flex flex-col bg-white px-7 py-4 rounded-]">
					<Input 
						type="text" 
						label="Email :" 
						err={err}
						onChange={(email)=>setFrom({...form, email})}></Input>
					<Input
						type="password" 
						label="Password :" 
						err={err}
						onChange={(password)=>setFrom({...form, password})}></Input>
					{err && <PError msg={err}/>}
					<div className="mt-3">
						<button className="rounded-md bg-blue-500 w-full text-white text-lg py-1">Login</button>
						<p className="font-light m-2 text-center">Or</p>
						<p className="text-center text-lg">
							New here
							<Link 
								to="/register" 
								className="underline text-blue-700 ml-1 font-medium"
								>Sign up</Link>
						</p>
					</div>		
				</div>
			</div>
		</form>
	</>
}
