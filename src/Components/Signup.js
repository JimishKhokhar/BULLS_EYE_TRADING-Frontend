import React, { useContext, useState,useEffect } from "react";
import LoginComponent from "./LoginComponent";
import { Link } from "react-router-dom";
import UserCover from "./UserCover";
import { UserDataContext,ComponentDataContext } from "../App";
import { Button } from '@cred/neopop-web/lib/components';

import e from "cors";


const Signup = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);

    const { setSelectedComponent,successAlert,failAlert}=useContext(ComponentDataContext);

    useEffect(()=>{
        setSelectedComponent("");
    },[]);


    


    async function registerUser(data,e) {
        
       

        if ((username == "" || email == "" || password == "" || confirmPassword == "")) {
            // alert("Please Fill all the fields!");
            failAlert("Please Fill All the Fields","top-right")
            return;
        }
        else if (confirmPassword != password) {
            // alert("Password and confirm password are not same!");
            failAlert("Password and Confirm password are not same!","top-right")
            return;
        }

        const response = await fetch("http://localhost:4000/BullsEYETrading/createUser", {
            method: "POST",
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }

        })

        if (response.status == false) {
            // alert("Error in Signing");
            failAlert("Oops!..Error in Signing!");
            return;
        }
        if(response.status==409)
        {
            failAlert("Email Already Exists!");
            return;
        }

        // alert("Successfully Signed In :) \nLogin to Start the Journey!");
       
        alert(username + '\n' + email + '\n' + password + '\n' + confirmPassword);
        setConfirmPassword("");
        setEmail("");
        setUsername("");
        setPassword("");
        // successAlert("Successfully Signed In :) ");
        successAlert("Successfully Signed In :) \nLogin to Start the Journey!","top-right");
    }


    return (
        <div>
            {
                isLoggedIn ? <UserCover /> : <div className="w-full h-[90vh]  flex justify-center items-center mx-auto bg-black p-10">
                    <div className="w-[450px] min-h-full bg-gradient-to-b to-slate-950 border-2 border-white from-slate-800 ">
                        <div className="w-full h-full flex justify-center p-5 flex-col ">
                            <span className=" font-bold w-full text-center text-4xl text-white " onClick={()=>successAlert("SIGNUP","top-right")} >SIGN UP</span>
                            
                                <div className="w-full flex flex-col gap-5 mt-10">
                                    <input className="w-full text-2xl p-3  " placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                                    <input className="w-full text-2xl p-3  " placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                    <input className="w-full text-2xl p-3  " placeholder="Password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                                    <input className="w-full text-2xl p-3  " placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                                </div>
                                <div className="mt-10 bg-black text-white w-full  ">
                                    <Button className="text-3xl font-bold text-center w-full "
                                    
                                    textStyle={{ fontWeight: 'bold', fontSize: '25', fontType: 'Josefin Sans' }}
                                    fullWidth={true}
                                    colorConfig={{ color: 'white', backgroundColor: 'black', edgeColors: { left: "black", top: 'black', right: '#D2D2D2', bottom: '#8A8A8A' } }}
                                    variant="primary"
                                    kind="elevated"
                                    size="big"
                                    colorMode="dark"
                                    
                                     onClick={registerUser}>Sign Up</Button>
                                </div>



                            <span className="text-white w-full text-center text-xl my-5">Already Have an Account?
                                <Link to="/login">
                                    <span className="font-bold cursor-pointer"> Log In</span>
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Signup;