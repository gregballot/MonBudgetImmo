// Manual calculation to verify the formula
const monthlyPayment = 1170;
const annualRate = 3.8;
const monthlyRate = 0.003167; // Fixed precision to match manual calculation
const numberOfPayments = 25 * 12; // 300

console.log('Inputs:');
console.log('Monthly payment:', monthlyPayment);
console.log('Annual rate:', annualRate + '%');
console.log('Monthly rate:', monthlyRate);
console.log('Number of payments:', numberOfPayments);

// Formula: M × [1 - (1 + r)^-n] / r
const loanAmount = monthlyPayment * (1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate;

console.log('\nCalculated loan amount:', loanAmount);
console.log('Expected loan amount: 224233.91');
console.log('Difference:', loanAmount - 224233.91); 