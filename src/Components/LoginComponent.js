import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserDataContext, ComponentDataContext } from "../App";
import { useState } from "react";
import UserCover from "./UserCover";
import { Button } from '@cred/neopop-web/lib/components';

import 'react-toastify/dist/ReactToastify.css';





const LoginComponent = () => {

    const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    
    

    const { setSelectedComponent, successAlert, failAlert } = useContext(ComponentDataContext);

    useEffect(() => {
        setSelectedComponent("");
    }, []);



    useEffect(() => {
        console.log(isLoggedIn + " Frontend!")
        console.log(userObject)
        console.log(isLoggedIn + " Frontend!")
    }, [userObject]);



    



    return (
        <div>


            {
                isLoggedIn ? <UserCover /> :
                    <div className="w-full h-[90vh]  flex justify-center items-center mx-auto bg-black p-10">
                        <div className="w-[450px] min-h-full bg-gradient-to-b to-slate-950 border-2 border-white from-slate-800 ">
                            <div className="w-full h-full flex flex-col p-5">


                                <span className="w-full text-center text-4xl text-white font-bold" onClick={() => successAlert("LOGIN", "top-right")}>LOGIN</span>
                                <div className="mt-10 flex flex-col gap-5">
                                    <input className="w-full text-2xl p-3  " placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                    <input className="w-full text-2xl p-3 " placeholder="Password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                                    <span className="w-full text-end text-white font-bold cursor-pointer">Forgot Password?</span>
                                    <div className=" bg-black text-white w-full ">
                                        <Button

                                            textStyle={{ fontWeight: 'bold', fontSize: '25', fontType: 'Josefin Sans' }}
                                            fullWidth={true}
                                            colorConfig={{ color: 'white', backgroundColor: 'black', edgeColors: { left: "black", top: 'black', right: '#D2D2D2', bottom: '#8A8A8A' } }}
                                            variant="primary"
                                            kind="elevated"
                                            size="big"
                                            colorMode="dark"

                                            className="text-3xl font-bold text-center w-full " >Login</Button>
                                    </div>
                                </div>

                                <span className="text-white w-full text-center text-xl my-5">Dont Have Account?
                                    <Link to="/signup">
                                        <span className="font-bold cursor-pointer"> Sign Up</span>
                                    </Link>
                                </span>

                                <hr className="my-5"></hr>
                            </div>
                        </div>
                    </div>
            }

        </div>
    )
}

export default LoginComponent;