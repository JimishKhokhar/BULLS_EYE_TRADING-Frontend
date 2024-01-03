import react, { useContext } from "react";
import { ComponentDataContext } from "../App";


import Logo from "../Images/brand-name.png"
import React from "../Images/react-svgrepo-com.svg"
import Mongo from "../Images/mongo-svgrepo-com.svg"
import Express from "../Images/express-svgrepo-com.svg"
import Node from "../Images/node-js-svgrepo-com.svg"
import Auth0 from "../Images/auth0-svgrepo-com.svg"
import Tailwind from "../Images/tailwind-svgrepo-com.svg"

import Gmail from "../Images/gmail-svgrepo-com.svg"
import Linkedin from "../Images/linkedin-svgrepo-com.svg"
import Github from "../Images/github-svgrepo-com.svg"
import indianFlag from "../Images/india-svgrepo-com.svg"

import { findMarketStatusUtils } from "../utils";


const Footer = () => {

    const { totalUsers, setTotalUsers } = useContext(ComponentDataContext)

    return (



        <div className=" relative w-full  min-h-[350px] md:pb-0  flex flex-col    bg-black  md:pt-0">
            <div className="flex flex-col  w-full items-center justify-center absolute bottom-14  md:bottom-2">
            <span className=" flex w-full  gap-1 justify-center items-center self-start  ">
                        <span className="text-white ">Made In INDIA</span>
                        <img className="min-w-[20px] max-w-[20px]" src={indianFlag} />
                    </span>
                <img src={Logo} className="h-[15px] md:h-[30px] mx-auto " onClick={() => {
                    // console.log(userObject, isLoggedIn, user)
                    findMarketStatusUtils()
                }} />

                <span className="self-end text-white mx-auto text-center text-md">Copyright © 2024 BULL'SEYE TRADING Inc.</span>

            </div>

            {
                <div className="text-white w-full pb-3 flex justify-center mt-5 md:mt-10">
                    <span className="text-2xl font-bold  ">{`Total Users: ${totalUsers == -1 ? "Loading.." : totalUsers}`}</span>

                </div>
            }




            <div className="text-white md:pt-5 md:text-xl mx-auto grid  grid-rows-2 gap-4 min-w-[60%] max-w-[60%] pb-14 md:grid-cols-2 ">
                <div className="w-full h-full flex flex-col md:gap-4 gap-2">
                    <div className="mx-auto text-center text-xl md:text-2xl font-bold">Technologies Used</div>
                    <div className="w-full  mx-auto flex  justify-center items-center gap-3 ">
                        <img src={Mongo} className="h-[35px] md:h-[55px]" alt="Mongo DB Atlas" title="Mongo DB Atlas" />
                        <img src={Express} className="h-[35px] md:h-[55px]" alt="Express JS" title="Express JS" />
                        <img src={React} className="h-[35px] md:h-[55px]" alt="React" title="React" />
                        <img src={Node} className="h-[35px] md:h-[55px]" alt="Node JS" title="Node JS" />
                        <img src={Auth0} className="h-[35px] md:h-[55px]" alt="Auth0" title="Auth0" />
                        <img src={Tailwind} className="h-[35px] md:h-[55px]" alt="Tailwind CSS" title="Tailwind CSS" />
                    </div>

                </div>

                <div className="w-full h-full flex flex-col md:gap-4 gap-2">
                    <div className="mx-auto text-center text-xl md:text-2xl font-bold">Developer Contact</div>
                    <div className="w-full mx-auto flex justify-center items-center gap-3 ">
                        <a href='https://www.linkedin.com/in/jimish-khokhar-188121255/' target="_blank" rel="noopener noreferrer">
                            <img src={Linkedin} className="h-[35px] md:h-[55px]" alt="LinkedIn" title="LinkedIn" />
                        </a>
                        <a href='https://github.com/JimishKhokhar' target="_blank" rel="noopener noreferrer">
                            <img src={Github} className="h-[35px] md:h-[55px]" alt="GitHub" title="GitHub" />
                        </a>
                        <a href="mailto: jimishkhokhar811@gmail.com" target="_blank" rel="noopener noreferrer">
                            <img src={Gmail} className="h-[30px] md:h-[50px]" alt="Gmail" title="Gmail" />
                        </a>
                    </div>

                </div>

                

            </div>








        </div>
    );
}
export default Footer;