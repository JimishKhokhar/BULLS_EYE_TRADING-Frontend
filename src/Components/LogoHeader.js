import Logo from "../Images/logo-name.png"

import React, { useState, useContext, useEffect } from 'react'
import { Button } from '@cred/neopop-web/lib/components';
import stockData from '../csvjson.json'
import NYSE from '../csvjson (1).json'
import { PeersDataContext, ComponentDataContext, CurrStockContext, StockReloaderContext } from "../App";
import { Link } from "react-router-dom";


const LogoHeader = ({ selectedComponent }) => {


    //For Searching 
    const [tempStock, setTempStock] = useState("AAPL");
    const [currentStock, setCurrentStock] = useContext(CurrStockContext);
    const [peers, setPeers] = useContext(PeersDataContext);
    const [searchResults, setSearchResults] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isNeedToReloadPeers, setIsNeedToReloadPeers] = useContext(StockReloaderContext);
    const [isShowNumberOfResults, setIsShowNumberOfResults] = useState(false);

    //All Functions for it
    function onButtonClick() {
        console.log(tempStock + " From OnButon")
        setPeers([]);
        setCurrentStock(tempStock);
        setIsNeedToReloadPeers(!isNeedToReloadPeers);
        //getTheData();
    }
    async function getAllSearchResults(query) {

        if (query.toString().length == 0) {
            setSearchResults([]);
            return;
        }

        const loweredQuery = query.toLowerCase();

        const filteredStocks = stockData.filter(stock =>
            (stock.Symbol.toLowerCase().includes(loweredQuery) || stock.Name.toLowerCase().includes(loweredQuery)) &&
            (!stock.Name.includes("Warrants") && !stock.Name.includes("Warrant"))
        );

        const filteredStocks2 = NYSE.filter(stock =>
            /^[A-Z]+$/.test(stock.Symbol) && (stock.Symbol.toLowerCase().includes(loweredQuery) || stock.Name.toLowerCase().includes(loweredQuery)) &&
            (!stock.Name.includes("Warrants") && !stock.Name.includes("Warrant"))
        );

        const finalFilteredStocks = [...filteredStocks, ...filteredStocks2];


        // console.log(commonStocks);
        console.log(finalFilteredStocks)
        setSearchResults(finalFilteredStocks);

    }


    // const searchResults = [{ symbol: "AAPL", name: "AAPLE INC" }
    //     , { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" },
    // { symbol: "AAPL", name: "AAPLE INC" }]

    useEffect(() => {
        // This function will be called when the component is mounted
        // Return a cleanup function to be called when the component is unmounted
        return () => {
            console.log("LOGO Component will unmount");
            // Call your function here
            setSearchResults([]);
            setInputValue("");
        };
    }, []);


    useEffect(() => {
        console.log(searchResults);
    }, [searchResults])

    return (

        <div className={`flex flex-col w-full md:hidden  md:max-w-[0px] ${searchResults?.length > 0 ? " rounded-b-3xl " : ""}   ${selectedComponent == "Stocks" ? "fixed top-0 rounded-b-md   z-10 bg-black" : ""}`}>
            <div className=" md:hidden block fixed top-0 w-[100vw] -mt-2  z-40 bg-black px-1  pl-3 py-1 pt-3">
                <Link to="/">

                    <img src={Logo} className="h-[50px] mx-auto " onClick={() => {
                        // console.log(userObject, isLoggedIn, user)
                    }} />
                </Link>
            </div>

            {
                selectedComponent == 'Stocks' &&

                <div className="  w-full flex flex-col md:hidden   pb-3  ">
                    <div className=" relative  flex items-center  pt-[65px] md:pt-0 gap-3  justify-center  w-[95vw]  mx-auto  ">
                        <input onChange={(e) => {

                            if (e.target.value == "") {
                                setIsShowNumberOfResults(false);
                            }
                            else
                                setIsShowNumberOfResults(true)
                            getAllSearchResults(e.target.value);
                            setInputValue(e.target.value)
                        }}
                            value={inputValue} className=" md:hidden text-black flex-1 px-3 py-[1px] mt-2" placeholder="Enter Stock " />


                        <div className="max-w-[30%] md:hidden  pt-1 mt-[5px]">
                            <Button

                                textStyle={{ fontWeight: 'bold', fontSize: '14', fontType: 'Josefin Sans' }}

                                variant="primary"
                                kind="elevated"
                                size="small"
                                colorMode="dark"


                                className="text-white  font-bold  py-1  " onClick={() => {

                                    setIsShowNumberOfResults(false);
                                    setPeers([]);
                                    setCurrentStock(tempStock);
                                    // console.log(tempStock + " From callback")
                                    setSearchResults([]);
                                    onButtonClick();
                                    // navigate("/stocks");
                                }}>Search</Button>
                        </div>

                    </div>

                    <div className="w-full  ">
                        <div className={` ${searchResults?.length > 0 ? "block" : "hidden"} text-xl   p-3 text-white max-h-[300px] ounded-b-3xl  overflow-y-auto`}>
                            {
                                searchResults.map((r) => {
                                    return (
                                        <div className='flex justify-between' onClick={() => {
                                            setIsShowNumberOfResults(false);
                                            console.log(r.Symbol + " From div")
                                            setTempStock(r.Symbol);
                                            //setCurrentStock(r.symbol);
                                            setInputValue(r.Name);
                                            setSearchResults([]);
                                            // onButtonClick();
                                        }}>
                                            <div className="px-3 group flex gap-2 border-y border-gray-700 border-1  rounded-md hover:bg-indigo-700  transition-all duration-300 cursor-pointer">
                                                <span className="text-indigo-700 min-w-[25%] max-w-[25%] font-bold text-md group-hover:text-black">{r.Symbol}</span>
                                                <span className="text-white text-md min-w-[70%] max-w-[70%]">{r.Name}</span>
                                            </div>

                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>

                    {isShowNumberOfResults &&
                        <div className="w-full flex justify-between px-4 pt-4 rounded-b-2xl ">

                            <span className="text-white text-lg font-bold">{`Total Results: ${searchResults?.length}`}</span>

                            <Button
                                variant="primary"
                                kind="elevated"
                                size="small"
                                colorMode="dark"
                                onClick={() => {
                                    setInputValue("");
                                    setSearchResults([]);
                                    setIsShowNumberOfResults(false)
                                }}

                            ><span className="text-lg font-bold">Cancel</span></Button>
                        </div>
                    }

                </div>


            }

        </div>



    )
}

export default LogoHeader