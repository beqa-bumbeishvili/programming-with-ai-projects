function displayStockData(data) {
    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    const oldestPrice = sortedData[0].price;
    const newestPrice = sortedData[sortedData.length - 1].price;

    const difference = newestPrice - oldestPrice;
    const percentChange = ((difference / oldestPrice) * 100).toFixed(2);

    const priceHTML = `
      <div class="current-price">$${newestPrice.toFixed(2)}</div>
       <span class="${difference >= 0 ? 'positive' : 'negative'}">
          ${difference >= 0 ? '+' : ''}$${Math.abs(difference).toFixed(2)} 
          (${difference >= 0 ? '+' : ''}${percentChange}%)
        </span>
        <span class="period-text">Past 5 days</span>
      </div>
      
      <div class="pre-market">
        $${oldestPrice.toFixed(2)} 
        <span class="price-change ${-difference >= 0 ? 'positive' : 'negative'}">
          ${difference >= 0 ? '-' : ''}$${Math.abs(difference).toFixed(2)} 
          (${difference >= 0 ? '-' : ''}${Math.abs(difference / newestPrice * 100).toFixed(2)}%) 
        </span>
        Pre-Market
      </div>
    `;
    document.getElementById('price-display').innerHTML = priceHTML;
}
