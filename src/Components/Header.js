import Logo from "../Images/logo-no-background.png"
import { CurrStockContext, PeersDataContext, UserDataContext, ComponentDataContext } from "../App"
import { useContext, useEffect, useState } from "react";
import { CurrentStockDataContext } from "../App";
import { StockReloaderContext } from "../App";
import { Link, Router, RouterProvider, useNavigate } from "react-router-dom";
import { Button } from '@cred/neopop-web/lib/components';


//Auth 0 Imports
import { useAuth0 } from "@auth0/auth0-react";


import stockData from '../csvjson.json'
import NYSE from '../csvjson (1).json'
import LogoHeader from "./LogoHeader";


const Header = () => {

    // console.log(stockData);

    const [peers, setPeers] = useContext(PeersDataContext);
    //All Contexts
    const [currentStock, setCurrentStock] = useContext(CurrStockContext);
    const [data, setData] = useContext(CurrentStockDataContext);
    const [isNeedToReloadPeers, setIsNeedToReloadPeers] = useContext(StockReloaderContext);

    const [tempStock, setTempStock] = useState("AAPL");

    const [searchResults, setSearchResults] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const navigate = useNavigate();

    const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);

    //which Component is Selected
    const { selectedComponent, setSelectedComponent } = useContext(ComponentDataContext);

    const { loginWithRedirect, user, logout } = useAuth0();


    useEffect(() => {
        // alert(window.location.pathname.toString().substring(1));

        setSelectedComponent(window.location.pathname.toString().substring(1));
    }, []);


    useEffect(() => {
        console.log("Current Stock is " + currentStock);
    }, [currentStock]);

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

    const [isShowNumberOfResults, setIsShowNumberOfResults] = useState(false);


    return (
        <div className="w-full    bg-black  select-none  transition-all duration-500 flex flex-col" >
            <LogoHeader className="md:hidden" selectedComponent={selectedComponent} />
            <div className="w-full  fixed top-0 z-30  bg-black  select-none  ">
                {/* <LogoHeader/> */}
                <div className="container md:flex hidden  md:max-w-[95%] mx-auto  justify-between  h-fit  text-white p-1 ">
                    <Link to="/">
                        <img src={Logo} className="h-[50px] " onClick={() => {
                            console.log(userObject, isLoggedIn, user)
                        }} />
                    </Link>

                    <div className="  flex   w-fit text-xl md:flex justify-center h-full   mt-3 gap-10 text-white p-1" >

                        <Link to="/" >
                            <div className="" onClick={() => { setSelectedComponent('Home') }}>
                                {
                                    selectedComponent == 'Home' ? <span className=" text-white text-xl font-bold border-b-4 border-indigo-500">Home</span> : <span className=" text-white text-xl ">Home</span>
                                }
                            </div>
                        </Link>
                        <Link to="/Stocks" >
                            <div className="" onClick={() => { setSelectedComponent('Stocks') }}>
                                {
                                    selectedComponent == 'Stocks' ? <span className=" text-white text-xl font-bold border-b-4 border-indigo-500">Stocks</span> : <span className=" text-white text-xl  ">Stocks</span>
                                }
                            </div>
                        </Link>
                        <Link to="/Watchlist" >
                            <div className="" onClick={() => { setSelectedComponent('Watchlist') }}>
                                {
                                    selectedComponent == 'Watchlist' ? <span className=" text-white text-xl font-bold border-b-4 border-indigo-500">Watchlist</span> : <span className=" text-white text-xl  ">Watchlist</span>
                                }
                            </div>
                        </Link>
                        <Link to="/Portfolio" >
                            <div className="" onClick={() => { setSelectedComponent('Portfolio') }}>
                                {
                                    selectedComponent == 'Portfolio' ? <span className=" text-white text-xl font-bold border-b-4 border-indigo-500">Portfolio</span> : <span className=" text-white text-xl  ">Portfolio</span>
                                }
                            </div>
                        </Link>
                        <Link to="/Rankings" >
                            <div className="" onClick={() => { setSelectedComponent('Rankings') }}>
                                {
                                    selectedComponent == 'Rankings' ? <span className=" text-white text-xl font-bold border-b-4 border-indigo-500">Rankings</span> : <span className=" text-white text-xl  ">Rankings</span>
                                }
                            </div>
                        </Link>

                        <Link to="/Profile" >
                            <div className="" onClick={() => { setSelectedComponent('profile') }}>
                                {
                                    selectedComponent == 'profile' ? <span className=" text-white text-xl font-bold border-b-4 border-indigo-500">Profile</span> : <span className=" text-white text-xl  ">Profile</span>
                                }
                            </div>
                        </Link>

                    </div>

                    <div className="flex w-fit self-center gap-3 mt-3">
                        <div className="relative flex  gap-3 justify-start items-start flex-col max-w-[250px] min-w-[250px]">
                            <input onChange={(e) => {
                                if (e.target.value == "") {
                                    setIsShowNumberOfResults(false);
                                }
                                else
                                    setIsShowNumberOfResults(true)

                                getAllSearchResults(e.target.value);
                                setInputValue(e.target.value)
                            }} className="text-black w-full px-3 py-[1px] mt-2" placeholder="Enter Stock " value={inputValue} />


                            <div className='m-0 absolute  min-w-[300px] max-w-[300px]  top-[50px] bg-black text-white w-full max-h-[350px] overflow-y-auto z-10'>
                                {
                                    <div>
                                        <div className="relative max-h-[300px] overflow-y-auto">
                                            {
                                                searchResults.map((r, index) => {
                                                    return (
                                                        <div className='relative ' onClick={() => {
                                                            setIsShowNumberOfResults(false);
                                                            console.log(r.Symbol + " From div")
                                                            setTempStock(r.Symbol);
                                                            //setCurrentStock(r.symbol);
                                                            setInputValue(r.Name);
                                                            setSearchResults([]);

                                                            // onButtonClick();
                                                        }}>
                                                            <div className="px-3 group flex gap-2 border-y border-gray-700 border-1  rounded-md hover:bg-indigo-700  transition-all duration-100 cursor-pointer">
                                                                <span className="text-indigo-700 font-bold text-xl group-hover:text-black min-w-[25%] max-w-[25%]">{r.Symbol}</span>
                                                                <span className="text-white min-w-[70%] max-w-[70%]">{r.Name}</span>




                                                            </div>

                                                        </div>
                                                    );
                                                })
                                            }



                                        </div>
                                        <div>
                                            {
                                                isShowNumberOfResults &&
                                                <div className="w-full flex justify-between px-4 pt-4 ">

                                                    <span className="text-white text-lg font-bold ">{`Total Results: ${searchResults?.length}`}</span>

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

                                    </div>


                                }


                            </div>




                        </div>
                        <div className="pt-1">
                            <Button

                                textStyle={{ fontWeight: 'bold', fontSize: '14', fontType: 'Josefin Sans' }}

                                variant="secondary"
                                kind="elevated"
                                size="small"
                                colorMode="dark"


                                className="text-white font-bold  py-1 mt-[3px] " onClick={() => {
                                    setIsShowNumberOfResults(false);
                                    setPeers([]);
                                    setCurrentStock(tempStock);
                                    console.log(tempStock + " From callback")
                                    setSearchResults([]);
                                    onButtonClick();
                                    navigate("/stocks");
                                }}>Search</Button>
                        </div>

                        {
                            isLoggedIn ? <div className="pt-1">
                                <Button

                                    variant="primary"
                                    kind="elevated"
                                    size="small"
                                    colorMode="dark"
                                    textStyle={{ fontWeight: 'bold', fontSize: '14', fontType: 'Josefin Sans' }}

                                    onClick={() => {
                                        setIsLoggedIn(false);
                                        setUserObject({});
                                        logout();
                                    }}
                                //  className="text-black  bg-white font-bold px-2 py-1 mt-[2px] ml-4 " 
                                >Log Out</Button>
                            </div> :
                                <div className="pt-1">
                                    <Button

                                        textStyle={{ fontWeight: 'bold', fontSize: '14', fontType: 'Josefin Sans' }}

                                        variant="primary"
                                        kind="elevated"
                                        size="small"
                                        colorMode="dark"

                                        onClick={() => { loginWithRedirect() }}
                                        className="text-white font-bold px-2 py-1 mt-[2px] ml-4 "
                                    >Log In</Button>
                                </div>
                        }
                    </div>



                    {/* <label className="mx-auto">
                    Your first name:
                    <input name="firstName" onChange={(e) => { getAllSearchResults(e.target.value); setInputValue(e.target.value) }} placeholder='Enter Stock' className='px-3 text-black' value={inputValue} />
                    <div className='w-fit max-h-[300px] overflow-y-scroll'>
                        {
                            searchResults.map((r) => {
                                return (
                                    <div className='flex justify-between' onClick={() => {
                                        setCurrentStock(r.symbol);
                                        setInputValue(r.description);
                                        setSearchResults([]);
                                    }}>
                                        <span>{r.description}</span>
                                        <span>{r.symbol}</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <button className='m-10' onClick={() => {
                        getTheData();
                        console.log(currentStock)
                    }}>Search</button>
                </label> */}



                </div>

            </div>



        </div>
    )

}

export default Header;