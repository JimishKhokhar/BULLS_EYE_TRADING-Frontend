import React, { useEffect, useState } from 'react'
import Logo from "../Images/square-dollar-chart-svgrepo-com.svg"
import { UserDataContext, ComponentDataContext } from '../App'
import { useContext } from 'react'
import { Button } from '@cred/neopop-web/lib/components';

//AUTH0 Imports
import { useAuth0 } from "@auth0/auth0-react";


const UserCover = () => {

    const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);

    const { setSelectedComponent, successAlert, failAlert } = useContext(ComponentDataContext);
    const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();


    setSelectedComponent("profile")
    useEffect(() => {
        document.title="Profile"
        setSelectedComponent("profile");
    }, []);

    return (

        <div>
            <div className=" md:pt-20  overflow-hidden w-full h-[100vh]   flex justify-center items-center mx-auto bg-black pt-[62px]  p-0 md:p-10">
                <div className='relative w-full md:w-[450px] min-h-full bg-gradient-to-b to-slate-950 md:border-2 md:border-white from-slate-800  '>
                    <div className='w-full flex  align-middle pt-5 md:p-10 flex-col content-center gap-10'>

                        {isAuthenticated ? <div>
                            <img width={100} className=' rounded m-auto' src={user.picture}></img>
                            <div className='flex flex-col gap-5 m-auto text-white'>
                                <span className='md:text-3xl text-lg font-bold mt-3 mx-auto'>{user.name}</span>
                            </div>
                        </div>
                            :
                            <div>
                                <h1 className='text-3xl text-white text-center font-bold '>Login To Start Your Trading Journey!</h1>
                            </div>

                        }
                        



                    </div>

                    {
                        isAuthenticated ? <div className='absolute min-w-full flex justify-center  bottom-20'>
                            <div >
                                <Button

                                    variant="primary"
                                    kind="elevated"
                                    size="big"
                                    colorMode="light"
                                    onClickCapture={() => {
                                        setIsLoggedIn(false);
                                        setUserObject({});
                                    }} className="text-black  bg-white font-bold px-4 py-2 mt-[2px] ml-4 " onClick={() => {
                                        logout();
                                    }}>Log Out</Button>
                            </div>
                        </div> : <div className='absolute min-w-full flex justify-center   bottom-10'>
                            <div >
                                <Button

                                    variant="primary"
                                    kind="elevated"
                                    size="big"
                                    colorMode="light"
                                    onClickCapture={() => {
                                        setIsLoggedIn(false);
                                        setUserObject({});
                                        loginWithRedirect();
                                    }} className="text-black  bg-white font-bold px-4 py-2 mt-[2px] ml-4 " onClick={() => {

                                    }}>Log In</Button>
                            </div>
                        </div>
                    }


                </div>
            </div>
        </div>


    )
}

export default UserCover