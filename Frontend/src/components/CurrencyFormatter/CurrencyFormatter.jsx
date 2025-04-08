import React from 'react';

const CurrencyFormatter = ({ amount }) => {
  const formatIndianCurrency = (amount) => {
    let [integerPart, decimalPart] = amount.toString().split('.');
    let lastThree = integerPart.slice(-3); 
    let otherNumbers = integerPart.slice(0, integerPart.length - 3); 
    if (otherNumbers) {
      lastThree = ',' + lastThree;
    }
    const formattedIntegerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return formattedIntegerPart + (decimalPart ? '.' + decimalPart : '');
  };

  return (
      <span style={{margin:"0"}}>₹{formatIndianCurrency(amount)}</span>
  );
};

export default CurrencyFormatter;
