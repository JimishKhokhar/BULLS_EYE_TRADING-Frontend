import { useEffect, useState, input, useContext } from "react";
import { Line, ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'
import { getAllSearchResults } from "../Utility";
import { CurrStockContext, CurrentStockDataContext, UserDataContext } from "../App"
import upTrend from "../Images/up-trend-svgrepo-com.svg";
import downTrend from "../Images/down-trend-round-svgrepo-com.svg";
import addToWatchlistSVG from '../Images/add-to-queue-svgrepo-com.svg'
import Sidebar from "../Components/SideBar";
import { useNavigate } from "react-router-dom";
import Dialog from "./Dialog";
import { Button } from '@cred/neopop-web/lib/components';
import { formatMillisecondsToDateTime } from "../Utility";

import { ComponentDataContext } from "../App";

import { useAuth0 } from "@auth0/auth0-react";

import LiveNow from "../Images/live-now.gif"
import NotLive from "../Images/not-allowed-symbol-svgrepo-com.svg"
import ShortDialog from "./ShortDialog";


import useMarketTimeChecker from "./marketTimeChecker";


import { addToWatchlistUtils, getStockQuote, getStockProfileUtils } from "../utils";


const DashBoard = ({ successAlert, failAlert, infoAlert }) => {

  //Market Status Hook
  const isMarketLive = useMarketTimeChecker();


  //for showing appropriate message when user try to trade when fetching user details
  const { isAuthenticated } = useAuth0();
  const { totalUsers } = useContext(ComponentDataContext);


  //Loading DotENV File

  const NameFromDotENV = process.env.REACT_APP_NAME;

  //alert(NameFromDotENV)

  const [currentStock, setCurrentStock] = useContext(CurrStockContext);
  const [data, setData] = useContext(CurrentStockDataContext);

  const [stockProfile, setStockProfile] = useState({});

  const [stockQuote, setStockQuote] = useState({});
  let colourRed = "#EF0107";
  let colourGreen = "#008000";

  const [stockColor, setStockColor] = useState(colourGreen);
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(0);
  const [buttonSelected, setButtonSelected] = useState(0);
  const [endTime, setEndTime] = useState(Math.round(Date.now() / 1000));
  const [isDataAvailable, setIsDataAvailable] = useState(0);
  const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);
  const navigate = useNavigate();

  const [displayMessage, setDisplayMessage] = useState("");
  const [isStockPriceDull, setIsStockPriceDull] = useState(false);
  const [currentIntervalId, setCurrentIntervalId] = useState(null);

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    // Code to run when ComponentA mounts

    return () => {
      // Code to run when ComponentA unmounts
      console.log("Unmounting Dashboard", currentIntervalId);
      if (currentIntervalId)
        clearInterval(currentIntervalId);
      // Cleanup tasks if any
    };
  }, []); // Empty dependency array means effect runs only on mount and unmount


  // async function startTheProcess() {

  //   if(currentIntervalId)
  //   {
  //     clearInterval(currentIntervalId)
  //     setCurrentIntervalId(null);
  //   }

  //   let id= setInterval(async () => {

  //     setIsStockPriceDull(true);
  //     await delay(2000);
  //     setIsStockPriceDull(false);
  //     getStockQuoteLocal();
  //   }, 14000)
  //   return id;
  // }

  async function startTheProcess() {
    setIsStockPriceDull(true);
    await delay(2000);
    setIsStockPriceDull(false);
    getStockQuoteLocal();
  }


  useEffect(() => {
    // getAllStocks();
    getStockProfile();
    console.log("Stock Changed!")
    getTheData(endTime - 86400, endTime, "1min");
    getStockQuoteLocal();

    // if (currentIntervalId) {
    //   clearInterval(currentIntervalId);
    // }

    // // Start new interval for the currentStock
    // const intervalId = setInterval(startTheProcess, 14000);
    // setCurrentIntervalId(intervalId);



    // setButtonSelected(0);



  }, [currentStock]);

  useEffect(() => {
    console.error("New Interval ID is ", currentIntervalId)
  }, [currentIntervalId])

  useEffect(() => {
    console.log("Time Frame Changed!");

    setEndTime(Math.round(Date.now() / 1000));
    switch (buttonSelected) {
      case 0: getTheData(endTime - 106400, endTime, "1min"); break;//1 Day
      case 1: getTheData(endTime - 604800, endTime, "5min"); break;//1 Week
      case 2: getTheData(endTime - 2630000, endTime, "1h"); break;//1 Month
      case 3: getTheData(endTime - 31536000, endTime, "1day"); break;//1 Year
      case 4: getTheData(endTime - 157680000, endTime, "1week"); break;//5 Year
      case 5: getTheData(endTime - 315360000, endTime, "1week"); break;//15 Year
      case 6: getTheData(0, endTime, "1month"); break;//max
    }



  }, [buttonSelected]);


  async function getStockQuoteLocal() {


    const response = await getStockQuote(currentStock);

    if (response.c == Infinity)
      return;

    setStockQuote(response);
  }


  async function getTheData(startTime, endTime, res) {
    // console.log("Nathi Joto Data--------------")
    // return;

    // const url = `https://apistocks.p.rapidapi.com/daily?symbol=${currentStock}&dateStart=${formatMillisecondsToDateTime(startTime)}&dateEnd=${formatMillisecondsToDateTime(endTime)}&maxreturn=10&interval=1min`;
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     'X-RapidAPI-Key': '1b74a6b6d8msh8331971f486e465p1a81c0jsn4afeed00f963',
    //     'X-RapidAPI-Host': 'apistocks.p.rapidapi.com'
    //   }
    // };
    // if (data.length)
    //   return;

    // console.log("Nathi Joto Data--------------")
    // return;


    let queryString = `https://api.twelvedata.com/time_series?apikey=${process.env.REACT_APP_API_KEY_12_DATA}&interval=${res}&previous_close=true&start_date=${formatMillisecondsToDateTime(startTime, buttonSelected == 0, false)}&end_date=${formatMillisecondsToDateTime(endTime, false, false)}&symbol=${currentStock}&format=JSON`;
    let response = await fetch(queryString);
    // console.log(queryString)

    // let temp=await response.json();
    let pureData = await response.json();
    console.log("From 12 Data", pureData);
    if (pureData.code == 400) {
      console.warn("Errir")
      queryString = `https://api.twelvedata.com/time_series?apikey=${process.env.REACT_APP_API_KEY_12_DATA}&interval=${res}&previous_close=true&start_date=${formatMillisecondsToDateTime(startTime - 106400, buttonSelected == 0, true)}&end_date=${formatMillisecondsToDateTime(endTime, false, false)}&symbol=${currentStock}&format=JSON`;
      response = await fetch(queryString);
      pureData = await response.json();
      console.log("From 12 Data", pureData);
    }




    if (!response.ok)
      return;
    else if (!response)
      return;


    if (pureData.status == "ok") {
      setIsDataAvailable(true);
      setDisplayMessage("");
    }
    else if (pureData.code == 429) {
      failAlert('API Limit reached!Pleae Wait for 1 Minute!', "top-center");
      return;
    }
    else if (pureData.code == 400) {
      setDisplayMessage("No data is available on the specified dates. Try setting different start/end dates.");
      setIsDataAvailable(false)
      return;
    }








    const DATA = [];


    for (let i = pureData.values?.length - 1; i >= 0; i--) {
      let p = Number(pureData.values[i].close);
      DATA.push({

        price: p,
        time: (() => {
          const datetime = new Date(pureData.values[i].datetime);

          switch (buttonSelected) {
            case 0:
              return datetime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
            case 1:
              return datetime.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' });
            case 2:
              return datetime.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' });
            case 3:
              return datetime.toLocaleDateString('en-IN', { month: '2-digit', year: 'numeric' });
            case 4:
              return datetime.getFullYear().toString();
            case 5:
              return datetime.getFullYear().toString();
            case 6:
              return datetime.getFullYear().toString();
            default:
              return '';
          }
        })()
        // time: buttonSelected == 0 ? new Date(pureData.values[i].datetime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }) :
        //   new Date(pureData.values[i].datetime).getFullYear()
      })
    }


    console.log(DATA[DATA.length - 1]?.time);
    console.log(DATA[DATA.length - 1]?.price);

    setStartPrice(DATA[1]?.price);
    setEndPrice(DATA[DATA.length - 1]?.price)



    setData(DATA);
    console.log("DATA----------", DATA);
  }

  async function getStockProfile() {

    // const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${currentStock}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    const response = await getStockProfileUtils(currentStock);
    if (response == undefined)
      return;


    const pureData = response;

    console.log(pureData)
    setStockProfile(pureData);
  }

  const [isOpen, setIsOpen] = useState(0);
  function closeTheDialog() {
    setIsOpen(0);
  }

  //Add to Watchlist
  async function addToWatchlist() {
    const result = await addToWatchlistUtils(userObject._id, stockProfile?.name, stockProfile?.ticker)
    if (result == 1) {
      successAlert(`Successfully added ${currentStock} to WatchList`, 'top-center');
    }
    else {
      if (result == -1) {
        failAlert(`${currentStock} already exists in the WatchList`, 'top-center');
      }
      else if (result == -2) {
        failAlert(`Stock Limit Reached in WatchList`, 'top-center');
      }
      else
        failAlert(`Failed To Add ${currentStock} to WatchList`, 'top-center');
    }
  }


  return (

    <div>
      <div className="pt-[135px] md:pt-20  overflow-hidden  min-w-full max-w-full bg-gradient-to-b from-black to-slate-800 bg-[linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8520658263305322) 100%)] text-white">

        <div className="  flex justify-center  md:max-w-[90%] w-full   mx-auto md:max-h-[calc(100vh-61px)] md:min-h-[calc(100vh-61px)] md:p-5">

          <div className="hidden md:block ">
            <Sidebar />
          </div>

          {isOpen == 1 ?
            <div className=' w-[100vw]   md:w-fit  fixed z-30  bottomUp  md:right-[350px]  bottom-0 roll-out '>
              <Dialog stock={currentStock} closeTheDialog={() => { closeTheDialog() }} />
            </div>
            :
            isOpen == 2 ?
              <div className=' w-[100vw]   md:w-fit  fixed z-30  bottomUp  md:right-[350px]  bottom-0 roll-out '>
                <ShortDialog stockToShort={currentStock} closeTheDialog={() => { closeTheDialog() }} />

              </div>
              : <></>
          }


          {/* Main DashBoard */}
          <div className=" relative w-full flex flex-col  justify-center   min-h-full m-1  md:m-5 md:p-5 select-none">

            <div className="block md:hidden w-full">
              <div className=" md:w-fit md:mt-5 ">
                {isMarketLive == true ? (
                  <div className="items-center justify-center flex">
                    <div
                      onClick={() => {
                        infoAlert(
                          "Market is Active from 7:00 PM to 1:30 AM IST(Indian Standard Time) on Working days.",
                          "top-center",
                          5000
                        );
                      }}
                      className="w-fit px-5 bg-black mb-4 flex gap-2 rounded-2xl items-center"
                    >
                      <span className="text-xl font-bold text-white">LIVE NOW</span>
                      <img src={LiveNow} className="h-[25px]" />
                    </div>
                  </div>
                ) : (
                  <div className="items-center justify-center flex">
                    <div
                      onClick={() => {
                        infoAlert(
                          "Market is Active from 7:00 PM to 1:30 AM IST(Indian Standard Time) on Working days.",
                          "top-center",
                          5000
                        );
                      }}
                      className="w-fit px-5 bg-black mb-4 flex gap-2 rounded-2xl items-center"
                    >
                      <span className="text-xl font-bold text-white">NOT LIVE</span>
                      <img src={NotLive} className="h-[25px]" />
                    </div>
                  </div>
                )}
              </div>
            </div>





            <div className="flex  items-center gap-4 md:pl-0 pl-3  px-3">
              <h2 className="font-bold text-3xl " onClick={() => { successAlert(stockProfile?.name, "top-center") }}>{stockProfile?.name}</h2>
              <img className="w-[40px]" onClick={() => { setIsOpen(true) }} src={stockProfile?.logo} />
            </div>
            <h2 className="text-gray-400 font-bold pl-3 tracking-widest ">{stockProfile?.ticker}</h2>
            <div className="mt-2 bg-black  px-5 flex justify-center items-center w-fit md:pl-0 pl-3">
              <span className=" text-white  font-semibold">{stockProfile?.finnhubIndustry}</span>
            </div>


            {/* <div className="mt-3 flex gap-5 items-center w-fit ">
            <span className=" text-center text-4xl"><span className="font-bold">$</span> {stockQuote.c}</span>
            {
                ((((data[data.length-1]?.price-data[0]?.price)/data[0]?.price)*100).toFixed(2)>=0)?
                <span className="p-2 bg-[#3eff3ea1] rounded-lg text-lg font-bold flex justify-center items-center gap-1"><img src={upTrend} width="25"/>{(((data[data?.length-1]?.price-data[0]?.price)/data[0]?.price)*100).toFixed(2)} %</span>:
                <span className="p-2 bg-red-300 rounded-lg text-lg font-bold flex justify-center items-center gap-1"><img src={downTrend} width="25"/>{(((data[data?.length-1].price-data[0]?.price)/data[0]?.price)*100).toFixed(2)} %</span>
            }
          </div> */}

            <div className="mt-3 flex gap-2 md:gap-5 items-center md:w-fit md:pl-0 pl-3">



              <span className=" text-center text-4xl ">
                {isStockPriceDull ? (
                  // If isDullStockPrice is true, show dulled stock price
                  <div>
                    <span>$</span>
                    <span style={{ opacity: 0.5 }}>{Number(stockQuote.c).toFixed(2)}</span>
                  </div>
                ) : (
                  // If isDullStockPrice is false, show normal stock price
                  <div>
                    <span>$</span>
                    <span>{Number(stockQuote.c).toFixed(2)}</span>
                  </div>
                )}</span>
              <div className="flex justify-center mt-1 flex-1">
                {
                  ((((endPrice - startPrice) / startPrice) * 100).toFixed(2) >= 0) ?
                    <div className="flex gap-3  items-center flex-row-reverse">
                      <span className="md:p-2 p-1 bg-[#3eff3ea1] rounded-lg text-lg font-bold flex justify-center items-center gap-1 "><img src={upTrend} width="25" /> {(((endPrice - startPrice) / startPrice) * 100).toFixed(2)}%  </span>
                      <span className="text-2xl md:p-2 text-[#3eff3ea1] font-bold">{`+$${Number(endPrice - startPrice).toFixed(2)}`}</span>
                    </div> :

                    <div className="flex gap-3  items-center flex-row-reverse">
                      <span className="md:p-2 p-1 bg-red-500 rounded-lg text-lg font-bold flex justify-center items-center gap-1"><img src={downTrend} width="25" /> {(((endPrice - startPrice) / startPrice) * 100).toFixed(2)}%</span>
                      <span className="text-2xl p-2 text-red-500 font-bold">{`- $${Math.abs(Number(endPrice - startPrice)).toFixed(2)}`}</span>
                    </div>



                }
              </div>
            </div>
            <div className="flex sm:mx-auto md:mx-0  justify-center md:justify-start align-middle items-center">
              <div className="flex  mt-3 border-y-2 border-gray-700  w-fit ">
                <button onClick={() => { setButtonSelected(0) }} className={`font-extrabold text-md md:text-xl px-3 ${buttonSelected == 0 ? "text-black bg-white" : "text-white bg-black"}`}>
                  1D
                </button>
                <button onClick={() => { setButtonSelected(1) }} className={`font-extrabold text-md md:text-xl px-3 ${buttonSelected == 1 ? "text-black bg-white" : "text-white bg-black"}`}>
                  1W
                </button>
                <button onClick={() => { setButtonSelected(2) }} className={`font-extrabold text-md md:text-xl px-3 ${buttonSelected == 2 ? "text-black bg-white" : "text-white bg-black"}`}>
                  1M
                </button>
                <button onClick={() => { setButtonSelected(3) }} className={`font-extrabold text-md md:text-xl px-3 ${buttonSelected == 3 ? "text-black bg-white" : "text-white bg-black"}`}>
                  1Y
                </button>
                <button onClick={() => { setButtonSelected(4) }} className={`font-extrabold text-md md:text-xl px-3 ${buttonSelected == 4 ? "text-black bg-white" : "text-white bg-black"}`}>
                  5Y
                </button>
                <button onClick={() => { setButtonSelected(5) }} className={`font-extrabold text-md md:text-xl px-3 ${buttonSelected == 5 ? "text-black bg-white" : "text-white bg-black"}`}>
                  10Y
                </button>
                <button onClick={() => { setButtonSelected(6) }} className={`font-extrabold text-md md:text-xl px-3 ${buttonSelected == 6 ? "text-black bg-white" : "text-white bg-black"}`}>
                  MAX
                </button>

              </div>
            </div>

            {
              isDataAvailable ?

                <div>
                  {/* Block for PC */}
                  <div className="md:block hidden">
                    <div className="flex  justify-start  items-center mt-5 text-white">
                      <ResponsiveContainer aspect={2.5} className="h-fit text-white" width="100%">

                        <AreaChart data={data} className='m-auto'>

                          <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={endPrice >= startPrice ? colourGreen : colourRed} stopOpacity={0.8} />
                              <stop offset="95%" stopColor={endPrice >= startPrice ? colourGreen : colourRed} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="time" />
                          <Tooltip contentStyle={{ color: "#ffffff", background: "#000000" }} labelStyle={{ fontWeight: "bold" }} />
                          <YAxis domain={[startPrice, endPrice]}
                            type="number"
                            tickFormatter={(value) => value.toFixed(2)}
                          />

                          <Area type="monotone" dataKey="price" stroke={endPrice >= startPrice ? colourGreen : colourRed} strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />

                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>


                  {/* Block for Mobiles */}
                  <div className="md:hidden block">
                    <div className="flex  justify-start  items-center mt-5 text-white">
                      <ResponsiveContainer aspect={1.5} className="h-fit text-white" width="100%">

                        <AreaChart data={data} className='m-auto'>

                          <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={endPrice >= startPrice ? colourGreen : colourRed} stopOpacity={0.8} />
                              <stop offset="95%" stopColor={endPrice >= startPrice ? colourGreen : colourRed} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="time" />
                          <Tooltip contentStyle={{ color: "#ffffff", background: "#000000" }} labelStyle={{ fontWeight: "bold" }} />
                          <YAxis domain={[startPrice, endPrice]}
                            type="number"
                            tickFormatter={(value) => value.toFixed(2)}
                            hide={true}
                          />

                          <Area type="monotone" dataKey="price" stroke={endPrice >= startPrice ? colourGreen : colourRed} strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />

                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                : <div className="w-full h-[200px] md:h-full flex  justify-center items-center">{
                  displayMessage == "" ? "Data Not Available!" : displayMessage
                }</div>
            }

            <div className="relative w-full md:w-fit    md:absolute md:right-0 md:top-0 flex flex-col   items-end gap-3">
              <div className="flex gap-2 md:w-fit min-w-full">
                <div className="w-fit md:block hidden">
                  <Button
                    variant="primary"
                    kind="elevated"
                    size="big"
                    colorMode="dark"

                    onClick={() => {
                      addToWatchlist();
                    }}
                  >
                    <img src={addToWatchlistSVG} className="w-[40px] " />
                  </Button>
                </div>



                <div className="  grid grid-cols-2 w-full px-1 md:w-fit gap-2  md:gap-3">
                  <Button

                    fullWidth={true}
                    variant="secondary"
                    kind="elevated"
                    size="big"
                    colorMode="dark"

                    colorConfig={{ color: 'white', backgroundColor: '#008000', edgeColors: { left: "black", top: 'black', right: '#D2D2D2', bottom: '#8A8A8A' } }}
                    textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}
                    // className="  mr-2  bg-[#008000] px-5 py-2 text-2xl font-bold " 
                    onClick={() => {
                      if (!isLoggedIn) {
                        infoAlert("Please Login before Trading!", 'top-center')
                        return;
                      }
                      else if (isAuthenticated && totalUsers == -1) {
                        infoAlert("Please Wait while fetching user details", 'top-center')
                        return;
                      }

                      setIsOpen(1);
                    }}><span>BUY</span></Button>
                  <Button
                    variant="secondary"
                    kind="elevated"
                    size="big"
                    colorMode="dark"
                    fullWidth={true}

                    colorConfig={{ color: 'white', backgroundColor: '#EF0107', edgeColors: { left: "black", top: 'black', right: '#D2D2D2', bottom: '#8A8A8A' } }}
                    textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}


                    onClick={() => {
                      if (!isLoggedIn) {
                        infoAlert("Please Login before Trading!", 'top-center')
                        return;
                      }
                      else if (isAuthenticated && totalUsers == -1) {
                        infoAlert("Please Wait while fetching user details", 'top-center')
                        return;
                      }
                      setIsOpen(2)
                    }}><span>SELL</span></Button>
                </div>
              </div>

              <div className="hidden md:block  ">
                <div className=" md:w-fit md:mt-5 ">
                  {isMarketLive == true ? (
                    <div className="items-center justify-center flex">
                      <div
                        onClick={() => {
                          infoAlert(
                            "Market is Active from 7:00 PM to 1:30 AM IST(Indian Standard Time) on Working days.",
                            "top-center",
                            5000
                          );
                        }}
                        className="w-fit px-5 bg-black mb-4 flex gap-2 rounded-2xl items-center"
                      >
                        <span className="text-xl font-bold text-white">LIVE NOW</span>
                        <img src={LiveNow} className="h-[25px]" />
                      </div>
                    </div>
                  ) : (
                    <div className="items-center justify-center flex">
                      <div
                        onClick={() => {
                          infoAlert(
                            "Market is Active from 7:00 PM to 1:30 AM IST(Indian Standard Time) on Working days.",
                            "top-center",
                            5000
                          );
                        }}
                        className="w-fit px-5 bg-black mb-4 flex gap-2 rounded-2xl items-center"
                      >
                        <span className="text-xl font-bold text-white">NOT LIVE</span>
                        <img src={NotLive} className="h-[25px]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>





            </div>

            <div className="w-full my-2">
              <div className="w-full px-1 block md:hidden">
                <Button
                  variant="primary"
                  kind="elevated"
                  size="big"
                  colorMode="dark"
                  fullWidth={true}

                  onClick={() => {
                    addToWatchlist();
                  }}
                >
                  <span className="text-white text-2xl ">Add To WatchList</span>
                </Button>

              </div>
            </div>





          </div>




        </div>

      </div>
    </div>)
}

export default DashBoard;