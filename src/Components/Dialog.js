import React, { useContext, useEffect, useState } from 'react'
import Logo from "../Images/close-lg-svgrepo-com (1).svg"
import { buyStock, findTheBalance } from '../utils';
import { ComponentDataContext, UserDataContext } from '../App';
import { Button } from '@cred/neopop-web/lib/components';

import useMarketTimeChecker from './marketTimeChecker';

const Dialog = (props) => {

  const [isResultfound, setIsResultFound] = useState(0);

  const stock = props.stock;
  const [stockQuote, setStockQuote] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);
  const { successAlert, failAlert, infoAlert } = useContext(ComponentDataContext);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(-Infinity);

  //Market Status Checker
  const isMarketLive = useMarketTimeChecker();

  async function findIt() {

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
  useEffect(() => {

    findIt();

  }, []);


  useEffect(() => {
    // alert(stock);
    // findIt();
    getStockQuote();
  }, [stock]);

  useEffect(() => {


    findIt();

  }, []);


  async function getStockQuote() {

    //Starting the loader 
    setIsDataLoading(true);

    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);

    if (!response.ok) {
      failAlert("Not Able to Fetch Data!");
      setIsResultFound(-1);
      return;
    }

    // console.log("Jimish")
    // console.log(response);
    // console.log("Jimish")

    const pureData = await response.json();

    console.log(pureData);
    setStockQuote(pureData);
    setIsResultFound(1)

    setIsDataLoading(false);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }






  return (
    <div className=' z-30 fixed md:absolute bottom-0 min-w-[100vw] max-w-[100vw] md:min-w-[350px] md:max-w-[350px] h-[500px] bg-black border-slate-700  border-2  text-white rounded-lg mx-auto'>

      <button className=' absolute p-3 flex justify-center right-0 mr-2 text-lg' onClick={() => {
        props.closeTheDialog();
      }}><img src={Logo} className='  w-8' ></img></button>


      <div className='w-full flex flex-col align-middle items-center '>
        <span className=' text-3xl font-bold text-slate-400 m-2'>{stock}</span>

        {
          isResultfound == 0 ?
            <div className='w-full min-h-[400px] flex  '>
              <span className='m-auto text-xl'>Loading...</span>
            </div>
            :
            isResultfound == -1 ?
              <div className="w-full min-h-[400px] flex ">
                <span className='m-auto text-xl'>Failed To Fetch Data</span>
              </div>
              :
              <div className='w-full flex flex-col align-middle items-center '>
                <span className='text-3xl m-2 font-extrabold text-emerald-500 select-none '>$ {Number(stockQuote?.c).toFixed(3)}</span>
                <div className='w-full flex  justify-around my-2 text-2xl select-none '>
                  <div><span className='font-bold'>Low: </span><span className=' p-1  bg-red-600 rounded-md'>${Number(stockQuote.l).toFixed(2)}</span></div>
                  <div><span className='font-bold'>High: </span><span className=' p-1  bg-green-600 rounded-md'>${Number(stockQuote.h).toFixed(2)}</span></div>
                </div>

                <span className='text-3xl mt-10 select-none '>Quantity</span>
                <div className='flex gap-5 text-2xl mt-4 select-none '>

                  {
                    quantity > 0 ? <button onClick={() => { setQuantity(quantity - 1) }} className=' text-[30px]  px-5 bg-slate-700 font-bold  rounded-md flex  justify-center  align-middle pb-2 '><span>-</span></button> :
                      <button className=' text-[30px]  px-5 bg-slate-800 font-bold  rounded-md flex  justify-center  align-middle pb-2 '><span>-</span></button>
                  }
                  {/* <span className='select-none '>{quantity}</span> */}
                  <input type='number' value={quantity} className='w-[100px] bg-black text-white text-center ' onChange={(e) => { setQuantity(Number(e.target.value)) }} />
                  <button onClick={() => { setQuantity(quantity + 1) }} className=' text-[30px]  px-4 bg-slate-700 font-bold  rounded-md flex  justify-center  align-middle pb-2 '><span className='mx-1'>+</span></button>


                </div>
                <div className='w-full flex justify-center mt-3 gap-5'>
                  <button onClick={() => { setQuantity(10) }} className=' text-[20px]  px-2 bg-slate-700 font-bold  rounded-md flex  justify-center  align-middle  '><span className='mx-1'>10</span></button>
                  <button onClick={() => { setQuantity(25) }} className=' text-[20px]  px-2 bg-slate-700 font-bold  rounded-md flex  justify-center  align-middle  '><span className='mx-1'>25</span></button>
                  <button onClick={() => { setQuantity(50) }} className=' text-[20px]  px-2 bg-slate-700 font-bold  rounded-md flex  justify-center  align-middle  '><span className='mx-1'>50</span></button>
                  <button onClick={() => { setQuantity(100) }} className=' text-[20px]  px-2 bg-slate-700 font-bold  rounded-md flex  justify-center  align-middle  '><span className='mx-1'>100</span></button>

                </div>


                <div className='absolute w-full flex flex-col  justify-center gap-5 bottom-0 select-none '>

                  {
                    currentBalance > (quantity * stockQuote.c) ? <span className=' self-center text-4xl font-bold text-indigo-500'>$ {Number(quantity * stockQuote.c).toFixed(3)}</span> :
                      <span className=' self-center text-4xl font-bold text-indigo-500 opacity-60'>$ {Number(quantity * stockQuote.c).toFixed(2)}</span>
                  }



                  <Button

                    textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}
                    colorConfig={{ color: 'white', backgroundColor: '#15803D', edgeColors: { left: "black", top: 'black', right: '#D2D2D2', bottom: '#8A8A8A' } }}
                    fullWidth={true}
                    variant="secondary"
                    kind="elevated"
                    size="big"
                    colorMode="dark"

                    className='w-full  p-3 bg-green-700 text-3xl font-bold' onClick={async () => {
                      if (isDataLoading)
                        return;
                      if (!isMarketLive) {
                        failAlert("Order FAILED! Market is Not Live!", "top-center");
                        await sleep(3000);
                        infoAlert("Market is Active from 7:00 PM to 1:30 AM IST(Indian Standard Time) on Working days.", "top-center", 5000)
                        return;
                      }

                      if (quantity == 0) {
                        // alert("Quantity Must be Greater than 0");
                        failAlert("Quantity Must be Greater than 0", 'top-center');
                        return;
                      }
                      let totalPrice = Number(quantity * stockQuote.c)
                      // alert(totalPrice);
                      // alert(currentBalance)
                      // return;
                      if (currentBalance < totalPrice) {
                        failAlert(`Not Enough Balance To Trade!\nCurrent Balance: ${currentBalance}`, 'top-center');
                        // setQuantity(quantity);
                        findIt();
                        return;
                      }

                      let isBought = await buyStock(userObject._id, stock, stockQuote.c, quantity.toFixed(2).toString(), new Date());
                      if (isBought == -1) {
                        if (currentBalance < totalPrice) {
                          failAlert(`Not Enough Balance To Trade!\nCurrent Balance: ${Number(currentBalance).toFixed(2)}`, 'top-center');
                          findIt();
                          return;
                        }
                      }
                      if (isBought == 0) {
                        //  alert("Falied to Purchase!");
                        failAlert("Falied to Purchase!", 'top-center');
                      }
                      else {
                        // alert("Successfully Bought Stock");
                        successAlert(`Successfully Bought ${stock}`, 'top-center');
                      }
                      await findIt();
                      // alert("JIMISH-"+currentBalance+"-JIMISH");
                    }}>BUY</Button>
                </div>
              </div>

        }








      </div>



    </div>
  )
}

export default Dialog