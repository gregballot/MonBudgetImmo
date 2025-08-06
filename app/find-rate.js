// Find the exact monthly rate that produces the expected loan amount
const monthlyPayment = 1170;
const numberOfPayments = 300;
const expectedLoanAmount = 224233.91;

// Try different monthly rates to find the one that gives the expected result
const rates = [
  0.003167, // Your manual calculation
  0.0031666666666666666, // 3.8% / 12
  0.0031666666666666667, // Slightly higher
  0.0031666666666666665, // Slightly lower
];

rates.forEach(rate => {
  const loanAmount = monthlyPayment * (1 - Math.pow(1 + rate, -numberOfPayments)) / rate;
  const difference = Math.abs(loanAmount - expectedLoanAmount);
  console.log(`Rate: ${rate}, Loan Amount: ${loanAmount}, Difference: ${difference}`);
});

// Try to find the exact rate by binary search
let low = 0.003166;
let high = 0.003168;
let bestRate = 0.003167;
let bestDifference = Math.abs(monthlyPayment * (1 - Math.pow(1 + bestRate, -numberOfPayments)) / bestRate - expectedLoanAmount);

for (let i = 0; i < 10; i++) {
  const mid = (low + high) / 2;
  const loanAmount = monthlyPayment * (1 - Math.pow(1 + mid, -numberOfPayments)) / mid;
  const difference = Math.abs(loanAmount - expectedLoanAmount);
  
  if (difference < bestDifference) {
    bestDifference = difference;
    bestRate = mid;
  }
  
  if (loanAmount > expectedLoanAmount) {
    high = mid;
  } else {
    low = mid;
  }
}

console.log(`\nBest rate found: ${bestRate}`);
console.log(`Best loan amount: ${monthlyPayment * (1 - Math.pow(1 + bestRate, -numberOfPayments)) / bestRate}`);
console.log(`Difference: ${bestDifference}`); 