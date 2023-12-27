export async function getAllSearchResults(searchText)
{
    const resultResponse=await fetch(`https://finnhub.io/api/v1/search?q=${searchText}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    const result=await resultResponse.json();

    const commonStocks=result.result.filter((stock)=>{
      return stock.type=="Common Stock" && !stock.symbol.includes(".");
    });
    
    console.log(commonStocks);
    return commonStocks;
}

export function formatMillisecondsToDateTime(milliseconds) {
  const date = new Date(milliseconds*1000);

  // Extract date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format the date
  const formattedDate = `${year}-${month}-${day}`;
  // const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


  console.log(formattedDate);
  return formattedDate.toString();
}