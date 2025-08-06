import { MortgageCalculator } from '../Calculator';

describe('MortgageCalculator - Golden Path Tests', () => {
  it('should calculate exact values with existing loans and rental income (salary mode)', () => {
    // Given: Scenario with existing loans and rental income
    const calculator = new MortgageCalculator({
      propertyPrice: 250000,        // Default value (not used in salary mode)
      monthlyPayment: 1189,         // Default value (not used in salary mode)
      requiredSalary: 4000,         // €4000 monthly salary
      downPayment: 50000,           // €50,000 down payment
      loanDuration: 25,             // 25 years (300 months)
      interestRate: 3.8,            // 3.8% annual interest rate (0.3167% monthly)
      debtRate: 33,                 // 33% debt-to-income ratio
      existingLoans: 1200,          // €1200 existing loans
      rentalIncome: 1500,           // €1500 rental income
      rentalIncomePercentage: 70,   // 70% of rental income considered
    });

    // When: Calculate in salary mode
    const result = calculator.calculate('salary');

    // Then: Verify exact calculated values based on the mathematically correct formula
    expect(result.requiredSalary).toBe(4000);
    expect(result.monthlyPayment).toBeCloseTo(1170.00, 2);
    expect(result.loanAmount).toBeCloseTo(226368.41, 2);
    expect(result.propertyPrice).toBeCloseTo(276368.41, 2);
    expect(result.notaryFees).toBeCloseTo(20727.63, 2);
    expect(result.totalCost).toBeCloseTo(124631.59, 2);
    expect(result.totalPurchaseCost).toBeCloseTo(297096.04, 2);
  });

  it('should calculate exact values for property price mode with existing loans and rental income', () => {
    // Given: Property price mode scenario with existing loans and rental income
    // Using the property price from the salary mode test to ensure symmetry
    const calculator = new MortgageCalculator({
      propertyPrice: 276368.41,     // Property price from salary mode test
      monthlyPayment: 1189,         // Default value (not used in property mode)
      requiredSalary: 3400,         // Default value (not used in property mode)
      downPayment: 50000,           // €50,000 down payment
      loanDuration: 25,             // 25 years (300 months)
      interestRate: 3.8,            // 3.8% annual interest rate (0.3167% monthly)
      debtRate: 33,                 // 33% debt-to-income ratio
      existingLoans: 1200,          // €1200 existing loans
      rentalIncome: 1500,           // €1500 rental income
      rentalIncomePercentage: 70,   // 70% of rental income considered
    });

    // When: Calculate in property mode
    const result = calculator.calculate('property');

    // Then: Verify exact calculated values (should be symmetric with salary mode test)
    expect(result.propertyPrice).toBe(276368.41);
    expect(result.notaryFees).toBeCloseTo(20727.63, 2);
    expect(result.loanAmount).toBeCloseTo(226368.41, 2);
    expect(result.monthlyPayment).toBeCloseTo(1170.00, 2);
    expect(result.requiredSalary).toBeCloseTo(4000.00, 2);
    expect(result.totalCost).toBeCloseTo(124631.58, 2);
    expect(result.totalPurchaseCost).toBeCloseTo(297096.04, 2);
  });

  it('should calculate exact values for monthly payment mode with existing loans and rental income', () => {
    // Given: Monthly payment mode scenario with existing loans and rental income
    const calculator = new MortgageCalculator({
      propertyPrice: 250000,        // Default value (not used in monthly mode)
      monthlyPayment: 1170,         // €1,170 desired monthly payment
      requiredSalary: 3400,         // Default value (not used in monthly mode)
      downPayment: 50000,           // €50,000 down payment
      loanDuration: 25,             // 25 years (300 months)
      interestRate: 3.8,            // 3.8% annual interest rate (0.3167% monthly)
      debtRate: 33,                 // 33% debt-to-income ratio
      existingLoans: 1200,          // €1200 existing loans
      rentalIncome: 1500,           // €1500 rental income
      rentalIncomePercentage: 70,   // 70% of rental income considered
    });

    // When: Calculate in monthly mode
    const result = calculator.calculate('monthly');

    // Then: Verify exact calculated values based on the mathematically correct formula
    expect(result.monthlyPayment).toBe(1170);
    expect(result.loanAmount).toBeCloseTo(226368.41, 2);
    expect(result.propertyPrice).toBeCloseTo(276368.41, 2);
    expect(result.notaryFees).toBeCloseTo(20727.63, 2);
    expect(result.requiredSalary).toBeCloseTo(4000.00, 2);
    expect(result.totalCost).toBeCloseTo(124631.59, 2);
    expect(result.totalPurchaseCost).toBeCloseTo(297096.04, 2);
  });
});
