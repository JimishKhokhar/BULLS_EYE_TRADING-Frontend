import React from "react";
import DashBoard from "./Dashboard";
import Peers from "./Peers";
import { Context, createContext, useContext, useState,useEffect } from 'react';
import { ComponentDataContext } from "../App";
import Sidebar from "./SideBar";

const Stocks=()=>{

    const {selectedComponent, setSelectedComponent,successAlert,failAlert,infoAlert}=useContext(ComponentDataContext);

    // setSelectedComponent("Stocks")
    useEffect(()=>{
        document.title="Stocks"
        setSelectedComponent("Stocks");
    },[]);


    return (
        <div className="">
            <DashBoard successAlert={successAlert} failAlert={failAlert} infoAlert={infoAlert}/>
            <Peers/>
        </div>
    );
}

export default Stocks;
