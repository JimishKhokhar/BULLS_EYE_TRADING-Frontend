import React, { useEffect, useState } from 'react';
import upward from "../Images/move-upward-svgrepo-com.svg";
import downward from "../Images/move-downward-svgrepo-com.png";
import './StockTicker.css'; // Import the CSS file

const StockTicker = () => {
  // const stockSymbols = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA"];
  // const [stocks, setStocks] = useState([]);
  // const [loading, setLoading] = useState(true); // State to manage loading

  // useEffect(() => {
  //   const fetchStockData = async () => {
  //     const fetchedStocks = await Promise.all(stockSymbols.map(async (symbol) => {
  //       const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=ci7mp5hr01qni8lhcfugci7mp5hr01qni8lhcfv0`);
  //       const data = await response.json();
  //       return {
  //         name: symbol,
  //         price: data.c ? `$${data.c.toFixed(2)}` : 'N/A', // Current price
  //         change: data.d ? (data.d > 0 ? `+${data.d.toFixed(2)}` : `${data.d.toFixed(2)}`) : '0.00', // Change
  //       };
  //     }));
  //     setStocks(fetchedStocks);
  //     setLoading(false); // Set loading to false once data is fetched
  //   };

  //   fetchStockData();
  // }, []);

  // if (loading) {
  //   return null; // Don't render anything until data is loaded
  // }

  // Hardcoded stock data for testing
  const hardcodedStocks = [
    { name: "AAPL", price: "$150.00", change: "+1.50" },
    { name: "MSFT", price: "$280.00", change: "-2.00" },
    { name: "NVDA", price: "$200.00", change: "+3.00" },
    { name: "GOOGL", price: "$2,800.00", change: "-10.00" },
    { name: "AMZN", price: "$3,000.00", change: "+15.00" },
    { name: "META", price: "$350.00", change: "-5.00" },
    { name: "TSLA", price: "$700.00", change: "+12.00" },
  ];
  
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  // Simulate fetching data with hardcoded values
  useEffect(() => {
    // Use hardcoded data to populate stocks
    setStocks(hardcodedStocks);
    setLoading(false); // Set loading to false after setting data
  }, []);

  if (loading) {
    return null; // Don't render anything until data is loaded
  }


  return (
    <div className="ticker-container bg-black">
      <div className="ticker-track">
        {stocks.map((stock, index) => (
          <div className="ticker-item" key={index}>
            <span className="symbol">{stock.name}</span>
            <span className="price">{stock.price}</span>
            <span 
              className={`change ${stock.change.startsWith('+') ? 'positive' : 'negative'}`}
              style={{ color: stock.change.startsWith('+') ? '#16a34a' : 'red' }} // Set color based on change
            >
              {stock.change}
              <img
                src={stock.change.startsWith('+') ? upward : downward}
                alt={stock.change.startsWith('+') ? 'Upward' : 'Downward'}
                style={{ width: '12px', height: '12px', marginLeft: '4px' }} // Decreased size and adjusted position
              />
            </span>
          </div>
        ))}
        {/* Duplicate items to create an infinite loop effect */}
        {stocks.map((stock, index) => (
          <div className="ticker-item" key={index + stocks.length}>
            <span className="symbol">{stock.name}</span>
            <span className="price">{stock.price}</span>
            <span 
              className={`change ${stock.change.startsWith('+') ? 'positive' : 'negative'}`}
              style={{ color: stock.change.startsWith('+') ? '#16a34a' : 'red' }} // Set color based on change
            >
              {stock.change}
              <img
                src={stock.change.startsWith('+') ? upward : downward}
                alt={stock.change.startsWith('+') ? 'Upward' : 'Downward'}
                style={{ width: '12px', height: '12px', marginLeft: '4px' }} // Decreased size and adjusted position
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockTicker;
