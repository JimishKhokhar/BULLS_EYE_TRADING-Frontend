import React, { useEffect, useState, useContext } from "react";
import { Line, ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'
import upTrend from "../Images/up-trend-svgrepo-com.svg";
import downTrend from "../Images/down-trend-round-svgrepo-com.svg";
import { StockReloaderContext } from "../App";

const PeerCard = ({ props }) => {


    let colourRedPeer = "#EF0107";
    let colourGreenPeer = "#008000";

    // const [stock, setStock] = useState(props.stockName);
    // const [profile, setProfile] = useState({});
    // const [data, setData] = useState({});
    // const [isDataAvailable, setIsDataAvailable] = useState(false);
    // const [startPrice, setStartPrice] = useState(0);
    // const [endPrice, setEndPrice] = useState(10);
    // const [currentColor, setCurrentColor] = useState(colourRedPeer);
    // const [isNeedToReloadThePeers,setIsNeedToReloadThePeers]=useContext(StockReloaderContext);

    // useEffect(() => {
    //     getTheStockProfile(stock);
    //     getStockData();
    // }, [isNeedToReloadThePeers]);

    // async function getStockData() {
    //     let endTime = Math.round(Date.now() / 1000);
    //     let startTime = endTime - 86400;

    //     console.log("Fetching API");
    //     let response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${stock}&resolution=${5}&from=${startTime}&to=${endTime}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);



    //     if (response.ok) {
    //         let pureData = await response.json();


    //         if (pureData['s'] == "no_data") {
    //             response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${stock}&resolution=${5}&from=${startTime- 86400}&to=${endTime}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    //             pureData=await response.json();

    //             if(pureData['s'] == "no_data")
    //             {
    //                 response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${stock}&resolution=${5}&from=${startTime- 86400- 86400}&to=${endTime}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    //               pureData=await response.json();
    //               if(pureData['s']=="no_data")
    //               {
    //                 setIsDataAvailable(false);
    //                 return;
    //               }
    //             }
    //           }

    //         let DATA = [];

    //         if(!pureData['c'])
    //         {
    //             return;
    //         }

    //         for (let i = 0; i < pureData['c'].length; i++) {
    //             let p = Number(pureData['c'][i]);
    //             DATA.push({

    //                 price: p,
    //                 time: new Date(pureData['t'][i] * 1000).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
    //             })
    //         }

    //         setData(DATA);
    //         setStartPrice(DATA[0].price);
    //         setEndPrice(DATA[DATA.length - 1].price);


    //         setIsDataAvailable(true);

    //         setCurrentColor(endPrice >= startPrice ? colourGreenPeer : colourRedPeer);
    //         console.log(currentColor + " " + stock);

    //     }

    // }



    // async function getTheStockProfile(stock) {
    //     let response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${stock}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    //     if (response.ok) {
    //         let pureData = await response.json();
    //         setProfile(pureData);
    //     }

    // }

    if (props == undefined)
        return (<></>);

    let startPrice = props?.startPrice;
    let endPrice = props?.endPrice;
    let data = props?.data;
    let isDataAvailable = props?.isDataAvailable;
    let profile = props?.profile;
    let logo = profile?.logo;
    let stock = profile?.name;






    return (

        <div>
            <div className=" overflow-hidden md:h-[230px] min-w-[80vw] max-w-[80vw]   md:min-w-[400px] p-3  relative mb-5 text-white bg-black rounded-lg ">



                <div className="flex gap-3 items-center">
                    <div className="flex flex-col ">
                        <h2 className="text-2xl truncate">{stock}</h2>
                        <div className="w-full flex gap-3 items-center">
                            <h2 className="text-lg mt-1 text-gray-600 font-bold  tracking-widest">{profile.ticker}</h2>
                            <div className="flex gap-2 items-center w-fit ">
                                <span className=" text-center text-xl"><span className="font-bold">$</span> {endPrice}</span>
                                {
                                    ((((endPrice - startPrice) / startPrice) * 100).toFixed(2) >= 0) ?
                                        <span className="px-2 bg-[#3eff3ea1] rounded-lg text-md font-bold flex justify-center items-center gap-1 "><img src={upTrend} width="25" /> {(((endPrice - startPrice) / startPrice) * 100).toFixed(2)}%</span> :
                                        <span className="px-2 bg-red-300 rounded-lg text-md font-bold flex justify-center items-center gap-1"><img src={downTrend} width="25" /> {(((endPrice - startPrice) / startPrice) * 100).toFixed(2)}%</span>
                                }
                            </div>
                        </div>
                    </div>
                    <img src={logo} className="w-[45px] absolute right-2 top-2 rounded-sm md:right-4 md:top-3" />
                </div>
                {isDataAvailable == false ? <div className="w-full h-full flex justify-center items-center"><span>Data Not Available</span></div> :
                    <ResponsiveContainer aspect={2.5} className="h-fit mt-1" width="100%" >

                        <AreaChart data={data} className='m-auto'>



                            <defs>
                                <linearGradient id="peerAreaGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colourGreenPeer} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={colourGreenPeer} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="peerAreaRed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colourRedPeer} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={colourRedPeer} stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <XAxis dataKey="time" />
                            <Tooltip />
                            <YAxis domain={[startPrice, endPrice]}
                                type="number"
                                tickFormatter={(value) => value.toFixed(2)}
                                hide={true}
                            />

                            <Area type="monotone" dataKey="price" stroke={endPrice >= startPrice ? colourGreenPeer : colourRedPeer} strokeWidth={3} fillOpacity={1} fill={endPrice >= startPrice ? "url(#peerAreaGreen)" : "url(#peerAreaRed)"} />

                        </AreaChart>
                    </ResponsiveContainer>}
            </div>
        </div>
    );

}

export default PeerCard;