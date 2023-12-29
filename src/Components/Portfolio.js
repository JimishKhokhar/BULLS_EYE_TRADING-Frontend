import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@cred/neopop-web/lib/components'
import { UserDataContext, ComponentDataContext } from '../App'
import { findAllHoldings } from '../utils'
import HoldingCard from './HoldingCard'
import { findTheBalance, getStockQuote } from '../utils'
import SellDialog from './sellDialog'
import { updateNetWorth } from '../utils'
import { useAuth0 } from '@auth0/auth0-react'
import TradeHistory from './TradeHistory'
import BuyDialog from './BuyDialog'




const Portfolio = () => {

  const [innerComponent, setInnerComponent] = useState(0);


  const { loginWithRedirect } = useAuth0();

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isPricesLoading, setIsPricesLoading] = useState(false);

  const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);
  const { successAlert, failAlert, infoAlert, livePricesGlobal, setLivePricesGlobal, livePrices, setLivePrices } = useContext(ComponentDataContext);

  const { setSelectedComponent } = useContext(ComponentDataContext);
  const [allHoldings, setAllHoldings] = useState([]);

  const [currentBalance, setCurrentBalance] = useState(0);
  const [uniqueStocks, setUniqueStocks] = useState([]);

  const [netWorth, setNetworth] = useState(0);
  const [optimisedHoldings, setOptimisedHoldings] = useState({});

  const [holdingsLoading, setHoldingLoading] = useState(true);


  function closeTheDialog() {
    setIsOpen(false);
  }

  function updateHoldingCard(id, quantityToSell) {


    console.log("Updating")
    // return;

    const holdingToUpdate = allHoldings.find(holding => holding._id === id);
    if (!holdingToUpdate)
      return;

    console.log("Holding to Update in frontend", holdingToUpdate);


    const quantity = holdingToUpdate.quantity.$numberDecimal;
    const totalPrice = holdingToUpdate.totalPrice.$numberDecimal;
    const avgPrice = totalPrice / quantity;
    const amountToDeductFromTotalPriceOfHolding = avgPrice * quantityToSell;

    //updating holding collection
    console.log(typeof holdingToUpdate.quantity.$numberDecimal)

    let finalQuantity = Number(holdingToUpdate.quantity.$numberDecimal);
    let finalTotalPrice = Number(holdingToUpdate.totalPrice.$numberDecimal);

    finalQuantity -= quantityToSell;
    finalTotalPrice -= amountToDeductFromTotalPriceOfHolding;


    holdingToUpdate.quantity.$numberDecimal = String(finalQuantity);
    holdingToUpdate.totalPrice.$numberDecimal = String(finalTotalPrice);

    console.log(holdingToUpdate)

    if (holdingToUpdate.quantity.$numberDecimal != '0') {
      // If the updated quantity is not zero, update the state with the modified holding
      const updatedHoldings = allHoldings.map(holding =>
        holding._id === id ? holdingToUpdate : holding
      );

      setAllHoldings(updatedHoldings);
    } else {
      // If the updated quantity is zero, filter out the holding from the state
      const updatedHoldings = allHoldings.filter(holding => holding._id !== id);

      setAllHoldings(updatedHoldings);
    }
  }

  async function find() {

    const { _id } = userObject;
    if (!_id)
      return;
    let balance = await findTheBalance(_id);
    if (balance == -1) {
      failAlert("Error in Fetching the Balance!", 'top-center');
      return;
    }

    setCurrentBalance(balance);
  }



  let intervalId;
  async function findIt() {
    const response = await findAllHoldings(userObject._id);
    setAllHoldings(response);
    setIsDataLoading(false);
  }

  useEffect(() => {


    document.title="Portfolio"
    setSelectedComponent("Portfolio");
    window.scrollTo(0, 0)
    if (!isLoggedIn)
      return;

    setIsDataLoading(true)

    
    findIt()


    intervalId = setInterval(async () => {



      setIsPricesLoading(true);
      setIsDataLoading(true);

      findIt()
      findLivePrices()

      setIsDataLoading(false)
      setIsPricesLoading(false)
    }, 60000); // 10 seconds in milliseconds

    return () => clearInterval(intervalId);

  }, []);

  async function findLivePrices() {
    const result = {};

    if (allHoldings.length == 0) {
      await find();

      console.log("PURU---------dfsd-----------------------------", currentBalance)

      setNetworth(currentBalance)
      setHoldingLoading(false);
      return;
    }

    for (let symbol of allHoldings) {


      const stockQuote = await getStockQuote(symbol.stock);

      if (stockQuote.c == Infinity) {
        console.log("PURU--------------------------------------")
        clearInterval(intervalId);
        return;
      }

      result[symbol.stock] = stockQuote.c;

      console.log(result);

    }



    console.log("Result Final")
    console.log(result)


    setLivePrices(result);

  }

  function findNetWorth() {
    let worth = 0;

    if(allHoldings?.length==0)
    {
      find();
      setNetworth(currentBalance);
      return;
    }


    for (let holding of allHoldings) {
      let quantity = Number(holding.quantity.$numberDecimal);
      let livePrice = Number(livePrices[holding.stock]);

      // console.log(livePrice)
      worth += Number(quantity * livePrice);
    }
    setNetworth(worth + currentBalance);
  }






  useEffect(() => {



    find();
    setIsDataLoading(false);
    if (allHoldings.length > 0)
      setHoldingLoading(false);



    findLivePrices();
    setIsPricesLoading(false);
    //findOptimisedHoldings();



  }, [allHoldings])

  useEffect(() => {
    console.log('Live Prices:', livePrices);

    findNetWorth();

  }, [livePrices])

  const [isShowProfit, setIsShowProfit] = useState(false);

  useEffect(() => {

    console.log(netWorth, "NET WORTH")


    const resultOfNetworthUpdation = updateNetWorth(userObject._id, netWorth);
    console.log("Updating NetWorth")
    if (resultOfNetworthUpdation == 1)
      console.log("Updated the Net Worth Successfully")

    if (netWorth > 0) {
      setIsShowProfit(true);
    }
    else setIsShowProfit(false);
    console.log("Net Worth:" + netWorth);
  }, [netWorth])


  const [isOpen, setIsOpen] = useState(0);

  function closeTheDialog() {
    setIsOpen(0);
  }

  const [stockToBuy, setStockToBuy] = useState("");
  useEffect(() => {
    console.log("Buying ", stockToBuy);
  }, [stockToBuy]);

  async function updateHoldingCardForBuying()
  {
    await findIt();
  }




  return (
    <div className=' transition-all duration-500 w-full md:pt-16 bg-gradient-to-b from-black to-slate-800 bg-[linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8520658263305322) 100%)] text-white'>
      {/* <button className='text-white' onClick={() => { setInnerComponent(1 ? innerComponent == 0 : 0) }}>Change Component</button> */}

      <div>
        <div className=" pt-12 md:pt-0  w-full bg-gradient-to-b from-black to-slate-800 bg-[linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8520658263305322) 100%)] text-white">

          <div className="flex justify-center w-full content-center min-h-[calc(100vh-61px)] p-3 md:p-5">
            {isOpen==1 ? <div className='w-[100vw]   md:w-fit fixed z-30  bottomUp  md:right-[350px]  bottom-0 roll-out '>
              <SellDialog closeTheDialog={closeTheDialog} updateHoldingCard={updateHoldingCard} />
            </div>
              :
              isOpen==2?
                <div className='w-[100vw]   md:w-fit fixed z-30  bottomUp  md:right-[350px]  bottom-0 roll-out '>
                  <BuyDialog stockToBuy={stockToBuy} closeTheDialog={closeTheDialog}  
                      updateHoldingCardForBuying={updateHoldingCardForBuying} />
                </div>
              :
              <></>

            }


            {/* <div className='min-h-4/5 max-h-4/5 w-full max-w-[70%] flex  '> */}
            <div className={`min-h-4/5   w-full md:max-w-[70%]  flex  ${isLoggedIn ? '' : 'justify-center items-center'}`}>


              {
                isDataLoading ?
                  <div className='flex self-center  mx-auto'>
                    <div className='flex align-center items-center  justify-center'>
                      <span className=' text-lg md:text-3xl text-center p-2 md:p-10'>Data Loading...</span>
                    </div>
                  </div> :


                  !isLoggedIn ?
                    <div className='flex self-center '>
                      <div className='flex flex-col items-center  justify-center'>
                        <span className='m-auto text-lg md:text-3xl text-center flex flex-col gap-3 justify-center items-center'>
                          <span className='m-auto text-lg md:text-3xl text-center'>Login To Trade</span>
                          <Button
                            variant="secondary"
                            kind="elevated"
                            size="big"
                            colorMode="dark"
                            textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}

                            onClick={loginWithRedirect} >Login</Button>
                        </span>
                      </div>
                    </div> :

                    <div className='w-full h-full'>

                      <div className='rounded-lg w-full md:w-[60%] mx-auto border-[2px] p-1 md:p-3 bg-slate-900 '>

                        <div>
                          <div className='w-[80%] mx-auto  grid grid-cols-2 md:gap-0 gap-8  pb-2'>
                            <div className='flex flex-col justify-center w-full  items-center  '>
                              <span className='text-md md:text-2xl text-white self-center  font-bold'>Balance</span>
                              <span className='text-2xl md:text-4xl font-bold text-green-600 self-center '> {"$" + Number(currentBalance).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                                currency: 'INR'
                              })}</span>
                            </div>
                            <div className='flex flex-col justify-center w-full  items-center '>
                              <span className='text-md md:text-2xl text-white self-center  font-bold'>Net Worth</span>

                              {
                                !isShowProfit ? <span className='text-2xl md:text-2xl font-bold'>Loading...</span> : <span className='text-2xl md:text-4xl font-bold text-green-600 self-center '> {"$" + Number(netWorth).toLocaleString('en-IN', {
                                  maximumFractionDigits: 2,
                                  currency: 'INR'
                                })}</span>
                              }






                            </div>


                          </div>
                        </div>
                        <div className=' pt-2 border-t-2 flex flex-col justify-center max-w-[100%] mx-auto'>
                          <span className='text-md md:text-2xl text-white self-center  font-bold'>P & L</span>
                          {
                            !isShowProfit ? <span className='text-2xl font-bold mx-auto'>Loading...</span> :
                              Number(netWorth) - 25000 >= 0 ?
                                <span className='text-2xl md:text-4xl font-bold text-green-600 self-center '> {"+ $" + (Number(netWorth) - 25000).toLocaleString('en-IN', {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                  currency: 'INR'
                                })}</span> :
                                <span className='text-2xl md:text-4xl font-bold text-red-500 self-center '>{"- $" + (25000 - Number(netWorth)).toLocaleString('en-IN', {
                                  maximumFractionDigits: 2,
                                  currency: 'INR'
                                })}</span>

                          }
                        </div>



                      </div>

                      <div className='dont-blink select-none mx-auto grid grid-cols-2 gap-3 w-full md:min-w-[50%] md:max-w-[50%] m-3 transition-all duration-500'>
                        <div className=''>
                          {
                            innerComponent == 0 ?
                              <div className='bg-black w-full rounded-lg border-2  box-border font-bold border-white h-fit flex justify-center cursor-pointer transition-all duration-500'>
                                <span className='text-2xl md:p-4 py-2 mx-auto'>ACTIVE</span>
                              </div> :
                              <div onClick={() => { setInnerComponent(0) }} className='bg-slate-800 w-full rounded-lg h-fit border-2 border-black  flex justify-center cursor-pointer transition-all duration-500'>
                                <span className='text-2xl md:p-4 py-2  mx-auto'>ACTIVE</span>
                              </div>

                          }
                        </div>

                        <div>
                          {
                            innerComponent == 1 ?
                              <div className='bg-black w-full rounded-lg border-2 box-border font-bold border-white h-fit flex justify-center cursor-pointer transition-all duration-500'>
                                <span className='text-2xl md:p-4 py-2  mx-auto'>HISTORY</span>
                              </div> :
                              <div onClick={() => { setInnerComponent(1) }} className='bg-slate-800 w-full rounded-lg h-fit border-2 border-black  flex justify-center cursor-pointer transition-all duration-500'>
                                <span className='text-2xl md:p-4 py-2  mx-auto'>HISTORY</span>
                              </div>

                          }

                        </div>


                      </div>






                      {
                        innerComponent == 0 ?
                          holdingsLoading ?
                            <div className='w-full h-[60%]  flex '>
                              <div className=' self-center   m-auto flex justify-center flex-col items-center'>
                                <span className=' text-2xl p-3 md:text-3xl text-center'>Loading...</span>
                              </div>
                            </div>
                            :
                            allHoldings.length == 0 ?
                              <div className='w-full h-[60%]  flex '>
                                <div className=' self-center   m-auto flex justify-center flex-col items-center'>
                                  <span className=' text-2xl p-3 md:text-3xl text-center'>Start Trading !</span>
                                  <Button
                                    variant="secondary"
                                    kind="elevated"
                                    size="big"
                                    colorMode="dark"
                                    textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}

                                  >Stocks</Button>
                                </div>
                              </div>

                              :

                              <div className='flex flex-col gap-2 mt-2 md:mt-5'>
                                {allHoldings?.map((holding, index) => (
                                  <HoldingCard
                                    isOpen={isOpen}
                                    setIsOpen={setIsOpen}
                                    holdingObject={holding}//click on buy more to check holding id
                                    id={holding._id}
                                    user_id={holding.user_id}
                                    stock={holding.stock}
                                    totalPrice={holding.totalPrice.$numberDecimal}
                                    quantity={holding.quantity.$numberDecimal}
                                    broughtAt={holding.broughtAt}
                                    livePrices={livePrices}
                                    isPricesLoading={!isShowProfit}
                                    setStockToBuy={setStockToBuy}

                                  />
                                ))}
                              </div>
                          :
                          <div className='w-full '>
                            <TradeHistory />
                          </div>

                      }



                      {/* <div className='text-white'>{userObject.username}</div> */}
                    </div>
              }

            </div>
          </div>
        </div>
      </div>

    </div>



  )
}

export default Portfolio