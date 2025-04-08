export const formatCurrency = (amount) => {
    let integerPart = amount.toString()
    let lastThree = integerPart.slice(-3);
    let otherNumbers = integerPart.slice(0, integerPart.length - 3);
    if (otherNumbers) {
      lastThree = "," + lastThree;
    }
    const formattedIntegerPart =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return formattedIntegerPart;
  };
  