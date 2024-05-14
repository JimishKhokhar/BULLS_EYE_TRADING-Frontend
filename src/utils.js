import e from "cors";




export async function findAllHoldings(id) {
    if (!id)
        return 0;
    // alert(id);

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/findHoldings`, {
            method: "POST",
            body: JSON.stringify({
                user_id: id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        if (!response || response.status == 500)
            return 0;
        const finalResponse = await response.json();
        // console.log("UTILS")
        // console.log(finalResponse.data)
        // console.log("UTILS")
        return finalResponse.data;

    }
    catch (e) {
        return 0;
    }
}

export async function findTheBalance(id) {
    if (!id)
        return -1;
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/findBalance`, {
            method: "POST",
            body: JSON.stringify({
                user_id: id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        if (!response || response.status == 500)
            return -1;
        const finalResponse = await response.json();
        // console.log("UTILS")
        // console.log(finalResponse.data)
        // console.log("UTILS")
        // alert(finalResponse.data[0].currentBalance)
        return finalResponse.data[0].currentBalance;

    }
    catch (e) {
        return -1;
    }
}



export async function getStockQuote(stock) {


    console.log(`API CALL for ${stock} --------------------`)
    if (!stock) {
        return undefined;
    }


    // const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);

    // if (!response.ok) {
    //     return { c: Infinity };
    // }

    // const pureData = await response.json();

    // return pureData;

    const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/getStockQuote`,
        {
            method: "POST",
            body: JSON.stringify({
                stock
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
    )

    
    

    if(response.status==500)
    {
        return {c:Infinity};
    }
    const pureData=await response.json();
    console.error("From Utils"+pureData)
    return pureData;
}


export async function getStockPeersUtils(stock)
{
    console.log(`API CALL for ${stock} --------------------`)
    if (!stock) {
        return undefined;
    }

    try{
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/getPeers`,
        {
            method: "POST",
            body: JSON.stringify({
                stock
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        if(response.status==500)
            return [];
        const pureData=await response.json();
        console.error("PEERS From Utils",pureData)
        return pureData;

    }
    catch(e)
    {
        return [];
    }
}

export async function getStockMetricUtils(stock)
{
    console.log(`METRIC CALL for ${stock} --------------------`)
    if (!stock) {
        return undefined;
    }

    try{
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/getMetric`,
        {
            method: "POST",
            body: JSON.stringify({
                stock
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        if(response.status==500)
            return undefined;
        const pureData=await response.json();
        console.error("METRIC From Utils",pureData)
        return pureData;

    }
    catch(e)
    {
        return undefined;
    }
}

export async function getStockProfileUtils(stock)
{
    console.log(`METRIC CALL for ${stock} --------------------`)
    if (!stock) {
        return undefined;
    }
    try{
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/getStockProfile`,
        {
            method: "POST",
            body: JSON.stringify({
                stock
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        if(response.status==500)
            return undefined;
        const pureData=await response.json();
        console.error("STOCK PROFILE From Utils",pureData)
        return pureData;

    }
    catch(e)
    {
        return undefined;
    }
}


export async function buyStock(user_id, stock, price, quantity, time, type = "B") {
    // console.log(userObject)
    // alert(`Buying ${stock} for ${price} \n Quantity:${quantity}\n Total Value:${Number(price*quantity).toFixed(2)}`);
    // return 0;
    if (!user_id || !stock || !price || !quantity || !time)
        return 0;
    else {

        console.error(arguments)
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/buyStock`, {
            method: "POST",
            body: JSON.stringify({
                user_id, stock, quantity, price, time, type
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        if (!response)
            return 0;
        else if (response.status == 500)
            return 0;
        else if (response.status == 406)
            return -1;
        else if (response.status == 200)
            return 1;
    }
}



export async function sellTheStock(holdingIdToSell, sellingPrice, quantityToSell, time, tradeTypeToExit)//returns 0 or 1 as per the status of completion of selling the stock
{

    //id means _id of holding
    console.log(holdingIdToSell, sellingPrice, quantityToSell, tradeTypeToExit);
    // return;

    if (!holdingIdToSell || !sellingPrice || !quantityToSell || !tradeTypeToExit)
        return -3;
    else {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/sellStock`, {
                method: "POST",
                body: JSON.stringify({
                    holdingIdToSell, sellingPrice, quantityToSell, time, tradeTypeToExit
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            if (response.status == 404 || response.status == 500)
                return 0;

            const data = await response.json();
            console.log("return to utils", data);

            return 1;

        } catch (error) {
            return 0;
        }

    }

}

export async function findTradeHistory(user_id) {
    if (!user_id)
        return [];
    else {

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/getAllTrades`, {
                method: "POST",
                body: JSON.stringify({
                    user_id
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            if (response.status == 404 || response.status == 500)
                return [];

            const data = await response.json();
            //console.log("return to utils got trade History", data.data);

            return data.data;

        } catch (error) {
            return [];
        }
    }

}

export async function getTopTen() {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/getTopTen`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        // console.log("From Utils",response)

        if (response.status == 200) {
            const data = await response.json();
            //console.log("From Utils", data)
            return data;
        }
        else return [];
    } catch (error) {
        return [];
    }
}

export async function updateNetWorth(user_id, netWorth) {

    if (!user_id || !netWorth)
        return 0;

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/updateNetworth`, {
            method: "POST",
            body: JSON.stringify({
                user_id, netWorth
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        const pureData = await response.json();
        console.log("Updated Net Worth", pureData)

        if (response.status == 200) {
            return 1;
        }
        else return 0;
    } catch (error) {
        return 0;
    }
}


export async function findOrCreateUser(username, email, sub) {
    if (!username || !email || !sub) {
        return undefined;
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/findUser`, {
            method: "POST",
            body: JSON.stringify({
                username, email, sub
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });



        const pureData = await response.json();
        console.log("Utils", pureData.message, pureData)

        if (response.status == 200) {
            return pureData.data;
        }
        else return undefined;
    } catch (error) {
        return undefined;
    }

}



export async function addToWatchlistUtils(user_id, stockName, stockSymbol) {
    if (!user_id || !stockName || !stockSymbol) {
        return 0;
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/addToWatchlist`, {
            method: "POST",
            body: JSON.stringify({
                user_id, stockName, stockSymbol
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });



        const pureData = await response.json();
        console.log("Utils add To Watchlist", pureData.message, pureData)

        if (response.status == 400) {
            return -1;
        }
        else if (response.status == 401) {
            return -2;
        } else if (response.status == 200) {
            return 1;
        }
        else return 0;
    } catch (error) {
        return 0;
    }
}


export async function getWatchlistUtils(user_id) {
    if (!user_id) {
        return 0;
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/getWatchlist`, {
            method: "POST",
            body: JSON.stringify({
                user_id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const pureData = await response.json();
        console.log("Utils get Watchlist", pureData.message, pureData)

        if (response.status == 200) {
            return pureData;
        }
        else return undefined;
    } catch (e) {
        return undefined;
    }


}



export async function deleteFromWatchlistUtils(user_id, stockSymbol) {
    if (!user_id || !stockSymbol) {
        return 0;
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/deleteFromWatchlist`, {
            method: "DELETE",
            body: JSON.stringify({
                user_id, stockSymbol
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });



        const pureData = await response.json();
        console.log("Utils DELETED From Watchlist", pureData.message, pureData)

        if (response.status == 404) {
            return -1;
        }
        else if (response.status == 405) {
            return -2;
        } else if (response.status == 200) {
            return 1;
        }
        else return 0;
    } catch (error) {
        return 0;
    }
}

export async function getTotalUsersUtils() {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/getTotalUsers`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });


        console.log("GETTNG ", process.env.REACT_APP_BACKEND_API)


        const pureData = await response.json();
        console.log("From Utils ----------------------", pureData)

        if (response.status == 200) {
            return pureData.count;
        }
        else return -1
    } catch (error) {
        return -1;
    }
}

export async function findMarketStatusUtils() {
    // try {
    //     const response = await fetch(`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
    //     if (response.status == 200) {
    //         const pureData = await response.json();
    //         if (pureData.isOpen)
    //             return 1;
    //         else return 0;
    //     }
    //     return -1;
    // }
    // catch (e) {
    //     return -1;
    // }
    console.error("MARKET STATUS from Utils ----------------------")

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}BullsEYETrading/getMarketStatus`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        

        const pureData =await response.json();
        console.error("MARKET STATUS from Utils ----------------------", pureData)
        
        return pureData?.marketStatus;
        
    } catch (error) {
        return -1;
    }

}