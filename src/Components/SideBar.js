import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CurrStockContext } from "../App";
import { getStockMetricUtils } from "../utils";


const Sidebar = () => {

  const [currentStock, setCurrentStock] = useContext(CurrStockContext);
  const [matrices, setMatrices] = useState({});
  const [isLoaded, setIsLoaded] = useState(0);

  useEffect(() => {

    getFinancials();
  }, [currentStock]);


  async function getFinancials() {
    setIsLoaded(0);
    // const response = await fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${currentStock}&metric=all&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
    const response = await getStockMetricUtils(currentStock);

    if (response) {
      const pureData = response;
      console.log(pureData);
      setMatrices(pureData);
      setIsLoaded(1);
    }
  }

  return (

    <div className="flex flex-col scrollbar w-full h-[500px] overflow-scroll py-4 rounded-lg mb-0  md:my-0 md:p-0  md:max-w-[330px] md:min-h-full max-h-full gap-3  bg-black my-5 md:min-w-[330px] pt-5 pb-2  shadow-lg">

      <h1 className="text-center font-bold text-2xl text-white">Key Matrices</h1>
      <div className="overflow-y-auto overflow-x-hidden grow ">
        {
          isLoaded == 1 ?
            <div className="p-2">
              {
                Object.entries(matrices['metric']).map(mat => {
                  let key = mat[0];

                  let value = mat[1]//;
                  return (
                    <div className="flex items-center">
                      <span className="font-bold text-white">{key.toString().replace(/^[a-z]|[A-Z]/g, (c, i) => (i ? " " : "") + c.toUpperCase()) + ":"} </span>
                      <span className=" text-gray-400">{typeof value == 'string' ? value : (new Number(value)).toFixed(2)}</span>
                    </div>
                  )
                })
              }
            </div> : <div className="w-full h-full flex justify-center items-center text-center">Loading...</div>
        }
      </div>

    </div>
  );
}

export default Sidebar;