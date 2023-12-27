import React, { useContext, useEffect } from "react";
import LandingPage from "../Images/landingPage.png"
import LandingPage2 from "../Images/landingPage-2.jpg"
import { Link, Navigate } from "react-router-dom";
import { ComponentDataContext } from "../App";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from '@cred/neopop-web/lib/components';
import { useNavigate } from 'react-router-dom';


const LandingComponent = () => {
    const { selectedComponent, setSelectedComponent } = useContext(ComponentDataContext);
    const navigate = useNavigate();

    const { loginWithRedirect, isAuthenticated } = useAuth0();

    useEffect(() => {
        document.title="Home"
        setSelectedComponent("Home");
    }, []);




    return (
        <div className="bg-black w-full h-[100vh] select-none ">
            <div className="flex md:flex-row flex-col-reverse  max-w-[90%] min-w-[90%] mx-auto h-full">
                {/* Left Side */}
                <div className="w-full h-full flex justify-center md:items-center max-w-[100%] md:max-w-[50%]">
                    <div className="flex flex-col  gap-10 ">
                        <span className="text-white font-bold text-4xl md:text-8xl ">Trading Begins Here</span>
                        <div className="flex gap-5 justify-center md:justify-start">
                            {!isAuthenticated && <Button

                                textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}

                                variant="secondary"
                                kind="elevated"
                                size="big"
                                colorMode="dark"
                                onClick={loginWithRedirect}>Login</Button>
                            }

                            <Button

                                GoTo={"stocks"}
                                textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}

                                variant="secondary"
                                kind="elevated"
                                size="big"
                                colorMode="dark"
                                onClick={() => { navigate('/stocks') }}>Stocks</Button>


                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full h-full flex justify-center items-center">
                    <img className=" select-none" src={LandingPage2} />
                </div>
            </div>
        </div>
    )
}

export default LandingComponent;