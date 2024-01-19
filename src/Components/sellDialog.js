import React, { useContext, useEffect, useState } from 'react'
import Logo from "../Images/close-lg-svgrepo-com (1).svg"
import { buyStock, findTheBalance, sellTheStock } from '../utils';
import { ComponentDataContext, UserDataContext } from '../App';
import { Button } from '@cred/neopop-web/lib/components';

import useMarketTimeChecker from './marketTimeChecker';

const SellDialog = (props) => {


  //freeze operations untill the current operation is not completed
  const [freezeOperations, setFreezeOperations] = useState(false);

  const [isResultFound, setIsResultFound] = useState(0);

  //Market Status Checker
  const isMarketLive = useMarketTimeChecker();

  const tradeTypeToExit = props.tradeTypeToExit;
  const avgPrice = props.avgPricePortfolio;




  const [stockQuote, setStockQuote] = useState({});
  const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);
  const { successAlert, failAlert, infoAlert, stockToSell, setStockToSell, maxQuantityToSell, setMaxQuantityToSell, holdingIdToSell, setHoldingIdToSell } = useContext(ComponentDataContext);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [quantityToSell, setQuantityToSell] = useState(1);

  console.log(stockToSell, maxQuantityToSell)

  useEffect(() => {
    getStockQuote();
  }, [stockToSell]);



  async function getStockQuote() {

    setIsDataLoading(true);
    // setStockQuote({c:"120.345",o:"117.45",l:"110.111",h:"150.44"});
    // return;

    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stockToSell}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);

    if (!response.ok) {
      failAlert("Not Able to Fetch Data!");
      setIsResultFound(-1)
      return;
    }

    const pureData = await response.json();

    console.log(pureData);
    setStockQuote(pureData);
    setIsResultFound(1);
    setIsDataLoading(false);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  return (
    <div className=' z-30 fixed md:absolute bottom-0 min-w-[100vw] max-w-[100vw] lg:min-w-[350px] lg:max-w-[350px]  h-[500px] bg-black border-slate-700  border-2  text-white rounded-lg mx-auto'>

      <button className=' absolute p-3 flex justify-center right-0 mr-2 text-lg' onClick={() => {
        props.closeTheDialog();
      }}><img src={Logo} className='  w-8' ></img></button>

      <div className='w-full flex flex-col align-middle items-center'>
        <span className=' text-3xl font-bold text-slate-400 m-2'>{stockToSell}</span>

        {
          isResultFound == 0 ?
            <div className='w-full min-h-[400px] flex  '>
              <span className='m-auto text-xl'>Loading...</span>
            </div>
            :
            isResultFound == -1 ?
              <div className="w-full min-h-[400px] flex ">
                <span className='m-auto text-xl'>Failed To Fetch Data</span>
              </div>
              :
              <div className='w-full flex flex-col align-middle items-center'>
                <span className='text-3xl m-2 font-extrabold text-emerald-500 select-none '>$ {Number(stockQuote?.c).toFixed(3)}</span>


                <span className='text-3xl mt-10 select-none '>Quantity</span>
                <div className='flex gap-5 text-2xl mt-4 select-none '>

                  {
                    quantityToSell > 0 ? <button onClick={() => { setQuantityToSell(quantityToSell - 1) }} className=' text-[30px]  px-5 bg-slate-700 font-bold  rounded-md flex  justify-center  align-middle pb-2 '><span>-</span></button> :
                      <button className=' text-[30px]  px-5 bg-slate-900 font-bold  rounded-md flex  justify-center  align-middle pb-2 '><span>-</span></button>
                  }
                  {/* <span className='select-none '>{quantity}</span> */}
                  <input type='number' value={quantityToSell} className='w-[100px] bg-black text-white text-center ' onChange={(e) => { setQuantityToSell(Number(e.target.value)) }} />

                  {
                    quantityToSell < maxQuantityToSell ? <button onClick={() => { setQuantityToSell(quantityToSell + 1) }} className=' text-[30px]  px-4 bg-slate-700 font-bold  rounded-md flex  justify-center  align-middle pb-2 '><span className='mx-1'>+</span></button> :
                      <button className=' text-[30px]  px-4 bg-slate-900 font-bold  rounded-md flex  justify-center  align-middle pb-2 '><span className='mx-1'>+</span></button>
                  }





                </div>
                <div className='w-full flex justify-center mt-3 gap-5'>
                  <button onClick={() => {
                    if (maxQuantityToSell >= 10)
                      setQuantityToSell(10)
                  }} className={`text-[20px] px-2  font-bold rounded-md flex justify-center align-middle ${maxQuantityToSell >= 10 ? 'bg-slate-700' : 'bg-slate-900'}   `}><span className='mx-1'>10</span></button>
                  <button onClick={() => {
                    if (maxQuantityToSell >= 25)
                      setQuantityToSell(25)
                  }} className={`text-[20px] px-2  font-bold rounded-md flex justify-center align-middle ${maxQuantityToSell >= 25 ? 'bg-slate-700' : 'bg-slate-900'}   `}><span className='mx-1'>25</span></button>
                  <button onClick={() => {
                    if (maxQuantityToSell >= 50)
                      setQuantityToSell(50)
                  }} className={`text-[20px] px-2  font-bold rounded-md flex justify-center align-middle ${maxQuantityToSell >= 50 ? 'bg-slate-700' : 'bg-slate-900'}   `}><span className='mx-1'>50</span></button>
                  <button onClick={() => {
                    if (maxQuantityToSell >= 100)
                      setQuantityToSell(100)
                  }} className={`text-[20px] px-2  font-bold rounded-md flex justify-center align-middle ${maxQuantityToSell >= 100 ? 'bg-slate-700' : 'bg-slate-900'}   `}><span className='mx-1'>100</span></button>



                </div>
                <button onClick={() => {
                  setQuantityToSell(maxQuantityToSell)
                }} className={`mt-3 text-[20px] px-2  font-bold rounded-md flex justify-center align-middle bg-slate-700 `}><span className='mx-1'>MAX</span></button>



                <div className='absolute w-full flex flex-col  justify-center gap-5 bottom-0 select-none '>

                  {
                    tradeTypeToExit == "B" ?
                      quantityToSell > (maxQuantityToSell) ? <span className=' self-center text-4xl font-bold text-indigo-500 opacity-60'>$ {Number(quantityToSell * stockQuote.c).toFixed(2)}</span> :
                        <span className=' self-center text-4xl font-bold text-indigo-500'>$ {Number(quantityToSell * stockQuote.c).toFixed(3)}</span>
                      :
                      quantityToSell > (maxQuantityToSell) ? <span className=' self-center text-4xl font-bold text-indigo-500 opacity-60'>$ {Number(2 * (Number(avgPrice) * Number(quantityToSell)) - (Number(stockQuote.c) * Number(quantityToSell))).toFixed(2)}</span> :
                        <span className=' self-center text-4xl font-bold text-indigo-500'>$ {Number(2 * (Number(avgPrice) * Number(quantityToSell)) - (Number(stockQuote.c) * Number(quantityToSell))).toFixed(2)}</span>


                  }



                  <Button

                    textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}
                    colorConfig={{ color: 'white', backgroundColor: '#DC2626', edgeColors: { left: "black", top: 'black', right: '#D2D2D2', bottom: '#8A8A8A' } }}
                    fullWidth={true}
                    variant="secondary"
                    kind="elevated"
                    size="big"
                    colorMode="dark"

                    className='w-full  p-3 bg-red-600 text-3xl font-bold' onClick={async () => {

                      // props.closeTheDialog();
                      if (freezeOperations) {
                        infoAlert("Wait To Execute The Current Order!");
                        return;
                      }

                      if (!isMarketLive) {
                        failAlert("Order FAILED! Market is Not Live!", "top-center");
                        await sleep(3000);
                        infoAlert("Market is Active from 7:00 PM to 1:30 AM IST(Indian Standard Time) on Working days.", "top-center", 5000)
                        return;
                      }

                      setFreezeOperations(true);

                      const result = await sellTheStock(holdingIdToSell, Number(stockQuote?.c), quantityToSell, new Date(), tradeTypeToExit);
                      console.log("back to sell Dialog with result ", result)
                      if (result == 1) {
                        successAlert(`Successfully Sold ${quantityToSell} Units of ${stockToSell}`);
                        setMaxQuantityToSell(maxQuantityToSell - quantityToSell);
                        props.updateHoldingCard(holdingIdToSell, quantityToSell);
                      }
                      else {
                        failAlert(`Not Able to Execute Order`);
                      }

                      setFreezeOperations(false);



                    }}>EXIT</Button>
                </div>

              </div>
        }





      </div>

    </div>
  )
}

export default SellDialog