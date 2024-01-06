import { React, useContext, useEffect, useState } from "react";
import { CurrentStockDataContext, PeersDataContext } from "../App";
import PeerCard from "./PeerCard";
import { CurrStockContext } from "../App";
import { Link } from "react-router-dom";
import { StockReloaderContext } from "../App";
import { ShimmerThumbnail } from "react-shimmer-effects";
import Sidebar from "../Components/SideBar";

const Peers = () => {
    //Contexts
    const [stock, setStock] = useContext(CurrStockContext);
    const [isNeedToReloadThePeers, setIsNeedToReloadThePeers] = useContext(StockReloaderContext);

    const [peers, setPeers] = useContext(PeersDataContext);

    const [isDataLoding, setIsDataLoading] = useState(false);


    //colors
    let colourRedPeer = "#EF0107";
    let colourGreenPeer = "#008000";

    useEffect(() => {

        if (peers?.length > 1) {
            console.log("Jimishi");
        }
        else {
            console.log("Reloading All Peers");
            setPeers([]);
            getAllPeers();
        }
    }, [isNeedToReloadThePeers]);


    async function getAllPeers() {


        setIsDataLoading(true);


        const response = await fetch(`https://finnhub.io/api/v1/stock/peers?symbol=${stock}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
        if (response.ok) {
            console.log("Stock Changed To " + stock);
            let pureData = await response.json();
            pureData = pureData?.splice(0, 6);
            pureData = pureData?.filter((peer) => !peer?.includes('.'))
            console.log(pureData)

            const temp = [];

            for (let i = 0; i < pureData?.length; i++) {
                temp.push(await getStockData(pureData[i]));
            }
            setPeers(temp);

            console.log(temp);

        }
        setIsDataLoading(false)
    }

    async function getStockData(givenStock) {
        let endTime = Math.round(Date.now() / 1000);
        let startTime = endTime - 86400;

        const ans = { stockName: givenStock };

        ans.profile = await getTheStockProfile(givenStock);

        console.log("Fetching API");


        const url = `https://apistocks.p.rapidapi.com/intraday?symbol=${ans.stockName}&interval=5min&maxreturn=100`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': `1b74a6b6d8msh8331971f486e465p1a81c0jsn4afeed00f963`,
                'X-RapidAPI-Host': 'apistocks.p.rapidapi.com'
            }
        };

        let response = await fetch(url, options);
        if (response.status != 200) {
            return;
        }


        if (response?.ok) {
            let pureData = await response.json();
            console.log(pureData)


            let DATA = [];

            const myDay = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',')[0].split('/')[1].padStart(2, '0');

            console.log("My Day", myDay, typeof myDay)

            for (let i = 0; i < pureData.Results.length; i++) {
                let p = Number(pureData.Results[i].Close);

                let givenDate = String(new Date(pureData.Results[i].Date).getDate()).padStart(2, '0');
                DATA.push({

                    price: p,
                    time: new Date(pureData.Results[i].Date).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
                })

            }

            if (!ans)
                return;
            // setData(DATA);
            ans.data = DATA;
            // setStartPrice(DATA[0].price);
            let startPrice = DATA[0]?.price;
            ans.startPrice = startPrice;
            // setEndPrice(DATA[DATA.length - 1].price);
            let endPrice = DATA[DATA.length - 1]?.price;
            ans.endPrice = endPrice;


            // setIsDataAvailable(true);
            ans.isDataAvailable = true;

            // setCurrentColor(endPrice >= startPrice ? colourGreenPeer : colourRedPeer);
            ans.currentColor = endPrice >= startPrice ? colourGreenPeer : colourRedPeer;
            // console.log(currentColor + " " + stock);

            // console.log(ans);

            console.log("peer Data", DATA);

            return ans;

        }

    }



    async function getTheStockProfile(stock) {
        let response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${stock}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
        if (response.ok) {
            let pureData = await response.json();
            // setProfile(pureData);
            return pureData;
        }

    }





    return (
        <div className="w-full h-fit bg-slate-800  select-none pt-4">
            <div className="md:max-w-[90%] md:min-w-[90%] max-w-[95%] min-w-[95%] mx-auto   md:px-6">
                <div className="md:hidden block pb-4">
                    <Sidebar />
                </div>
                <h1 className="font-bold text-3xl text-white shadow-custom text-center ">PEERS</h1>


                

                <div className="flex overflow-x-auto mt-3 gap-3 overflow-y-hidden">
                    {
                        //Rendering all the Peer Card for each of its peers

                        isDataLoding ?
                            <div className="flex gap-3">
                                {
                                    [1, 2, 3, 4, 5].map((item) => {
                                        return <div className=" flex justify-center items-center md:h-[250px] min-w-[80vw] max-w-[80vw] min-h-[215px] mb-5   md:min-w-[400px] bg-black rounded-lg">
                                            <span className="text-white ">Loading...</span>
                                        </div>
                                    })
                                }
                            </div>
                            : peers?.map((peer, index) => (
                                peer?.stockName != stock ?
                                    <div onClick={() => { setStock(peer?.stockName) }} className="hover:cursor-pointer">
                                        <PeerCard props={peer} />
                                    </div>
                                    : <></>
                            ))
                    }
                </div>
                

            </div>
        </div>
    )
}

export default Peers;