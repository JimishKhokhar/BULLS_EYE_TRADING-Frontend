import React, { useEffect, useState, useContext } from "react";
import { Line, ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'
import upTrend from "../Images/up-trend-svgrepo-com.svg";
import downTrend from "../Images/down-trend-round-svgrepo-com.svg";
import { StockReloaderContext } from "../App";

const PeerCard = ({ props }) => {


    let colourRedPeer = "#EF0107";
    let colourGreenPeer = "#008000";



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
            <div className=" overflow-hidden md:h-[250px] min-w-[80vw] max-w-[80vw]   md:min-w-[400px] p-2 md:p-3  relative mb-5 text-white bg-black rounded-lg ">



                <div className="flex gap-3 items-center">
                    <div className="flex flex-col ">
                        <span className="text-xl md:text-2xl truncate ">{stock}</span>
                        <div className="w-full flex gap-3 items-center">
                            <span className="text-lg  text-gray-600 font-bold  tracking-widest ">{profile.ticker}</span>
                        </div>
                        <div className="flex gap-2 items-center w-fit ">
                                <span className=" text-center text-xl"><span className="font-bold">$</span> {endPrice}</span>
                                {
                                    ((((endPrice - startPrice) / startPrice) * 100).toFixed(2) >= 0) ?
                                        <span className="px-2 bg-[#3eff3ea1] rounded-lg text-md font-bold flex justify-center items-center gap-1 "><img src={upTrend} width="25" /> {(((endPrice - startPrice) / startPrice) * 100).toFixed(2)}%</span> :
                                        <span className="px-2 bg-red-300 rounded-lg text-md font-bold flex justify-center items-center gap-1"><img src={downTrend} width="25" /> {(((endPrice - startPrice) / startPrice) * 100).toFixed(2)}%</span>
                                }
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

                            <XAxis dataKey="time"  />
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