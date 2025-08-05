export interface CalculationInputs {
  propertyPrice: number;
  monthlyPayment: number;
  requiredSalary: number;
  downPayment: number;
  loanDuration: number;
  interestRate: number;
  // Advanced mode inputs
  debtRate: number;
  existingLoans: number;
  rentalIncome: number;
  rentalIncomePercentage: number;
}

export interface CalculationResult {
  monthlyPayment: number;
  requiredSalary: number;
  totalCost: number;
  propertyPrice: number;
  loanAmount: number;
  notaryFees: number;
  totalPurchaseCost: number;
}

export type CalculationMode = 'property' | 'monthly' | 'salary';

export class MortgageCalculator {
  private inputs: CalculationInputs;

  constructor(inputs: Partial<CalculationInputs> = {}) {
    this.inputs = {
      propertyPrice: 250000,
      monthlyPayment: 1189,
      requiredSalary: 3400,
      downPayment: 50000,
      loanDuration: 25,
      interestRate: 3.8,
      debtRate: 33,
      existingLoans: 0,
      rentalIncome: 0,
      rentalIncomePercentage: 70,
      ...inputs
    };
  }

  // Getters for inputs
  get propertyPrice(): number { return this.inputs.propertyPrice; }
  get monthlyPayment(): number { return this.inputs.monthlyPayment; }
  get requiredSalary(): number { return this.inputs.requiredSalary; }
  get downPayment(): number { return this.inputs.downPayment; }
  get loanDuration(): number { return this.inputs.loanDuration; }
  get interestRate(): number { return this.inputs.interestRate; }
  get debtRate(): number { return this.inputs.debtRate; }
  get existingLoans(): number { return this.inputs.existingLoans; }
  get rentalIncome(): number { return this.inputs.rentalIncome; }
  get rentalIncomePercentage(): number { return this.inputs.rentalIncomePercentage; }

  // Setters for inputs
  set propertyPrice(value: number) { this.inputs.propertyPrice = value; }
  set monthlyPayment(value: number) { this.inputs.monthlyPayment = value; }
  set requiredSalary(value: number) { this.inputs.requiredSalary = value; }
  set downPayment(value: number) { this.inputs.downPayment = value; }
  set loanDuration(value: number) { this.inputs.loanDuration = value; }
  set interestRate(value: number) { this.inputs.interestRate = value; }
  set debtRate(value: number) { this.inputs.debtRate = value; }
  set existingLoans(value: number) { this.inputs.existingLoans = value; }
  set rentalIncome(value: number) { this.inputs.rentalIncome = value; }
  set rentalIncomePercentage(value: number) { this.inputs.rentalIncomePercentage = value; }

  // Core calculation methods
  private calculateMonthlyPayment(principal: number, rate: number, years: number): number {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) return principal / numberOfPayments;

    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  private calculateRequiredSalary(monthlyPayment: number): number {
    // Calculate required salary considering existing loans and rental income
    // Only a percentage of rental income is considered (typically 70-80%)
    const effectiveRentalIncome = this.rentalIncome * (this.rentalIncomePercentage / 100);
    // Available for new loan = (Monthly payment for new loan) - (Existing loans) + (Effective rental income)
    const availableForNewLoan = monthlyPayment - this.existingLoans + effectiveRentalIncome;
    const debtRateDecimal = this.debtRate / 100;
    return availableForNewLoan / debtRateDecimal;
  }

  private calculateMaxMonthlyPayment(salary: number): number {
    // Calculate maximum monthly payment for a given salary considering existing loans and rental income
    // Only a percentage of rental income is considered (typically 70-80%)
    const effectiveRentalIncome = this.rentalIncome * (this.rentalIncomePercentage / 100);
    const debtRateDecimal = this.debtRate / 100;
    // Maximum available for loans = (Salary * debt rate) + (Effective rental income) - (Existing loans)
    const maxAvailableForLoans = (salary * debtRateDecimal) + effectiveRentalIncome - this.existingLoans;
    return Math.max(0, maxAvailableForLoans); // Ensure non-negative
  }

  private calculateTotalCost(monthlyPayment: number, years: number): number {
    return monthlyPayment * years * 12;
  }

  private calculatePropertyPrice(monthlyPayment: number, rate: number, years: number): number {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) return monthlyPayment * numberOfPayments;

    return monthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) /
           (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
  }

  private calculateNotaryFees(propertyPrice: number): number {
    // French notary fees for existing properties (vente d'immeuble existant)
    // Based on actual French regulations and typical online simulators

    // For existing properties, notary fees are approximately 7-8% of property price
    // This includes: émoluments de notaire, droits d'enregistrement, taxes diverses
    // The exact percentage varies slightly but 7.93% is commonly used

    return propertyPrice * 0.0793; // 7.93% - typical rate for existing properties
  }

  // Helper method to get detailed breakdown of notary fees
  getNotaryFeesBreakdown(propertyPrice: number) {
    const totalFees = propertyPrice * 0.0793;

    // Approximate breakdown (simplified)
    const notaryEmoluments = totalFees * 0.15; // ~15% of total fees
    const registrationFees = totalFees * 0.73; // ~73% of total fees (droits d'enregistrement)
    const variousTaxes = totalFees * 0.12; // ~12% of total fees (taxes diverses)

    return {
      notaryEmoluments,
      registrationFees,
      variousTaxes,
      total: totalFees,
    };
  }

  // Main calculation method based on mode
  calculate(mode: CalculationMode): CalculationResult {
    switch (mode) {
      case 'property':
        return this.calculateFromProperty();
      case 'monthly':
        return this.calculateFromMonthly();
      case 'salary':
        return this.calculateFromSalary();
      default:
        throw new Error(`Unknown calculation mode: ${mode}`);
    }
  }

  private calculateFromProperty(): CalculationResult {
    const notaryFees = this.calculateNotaryFees(this.propertyPrice);
    const totalPurchaseCost = this.propertyPrice + notaryFees;
    const loanAmount = totalPurchaseCost - this.downPayment;
    const monthly = this.calculateMonthlyPayment(loanAmount, this.interestRate, this.loanDuration);

    return {
      monthlyPayment: monthly,
      requiredSalary: this.calculateRequiredSalary(monthly),
      totalCost: this.calculateTotalCost(monthly, this.loanDuration),
      propertyPrice: this.propertyPrice,
      loanAmount: loanAmount,
      notaryFees: notaryFees,
      totalPurchaseCost: totalPurchaseCost,
    };
  }

  private calculateFromMonthly(): CalculationResult {
    // Calculate the property price that would result in the desired monthly payment
    // We need to account for notary fees and down payment in the calculation

    // First, let's calculate what loan amount would give us the desired monthly payment
    const monthlyRate = this.interestRate / 100 / 12;
    const numberOfPayments = this.loanDuration * 12;

    let loanAmount: number;
    if (monthlyRate === 0) {
      loanAmount = this.monthlyPayment * numberOfPayments;
    } else {
      loanAmount = this.monthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) /
                   (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    }

    // Now calculate the property price needed to achieve this loan amount
    // Total purchase cost = loan amount + down payment
    // Property price = total purchase cost - notary fees
    // But notary fees depend on property price, so we need to solve this iteratively

    // Start with an estimate: property price = loan amount + down payment
    let propertyPrice = loanAmount + this.downPayment;
    let notaryFees = this.calculateNotaryFees(propertyPrice);
    let totalPurchaseCost = propertyPrice + notaryFees;
    let newLoanAmount = totalPurchaseCost - this.downPayment;

    // Iterate a few times to converge on the correct property price
    for (let i = 0; i < 5; i++) {
      const adjustment = (newLoanAmount - loanAmount) / 1.0793; // 1 + notary fee rate
      propertyPrice -= adjustment;
      notaryFees = this.calculateNotaryFees(propertyPrice);
      totalPurchaseCost = propertyPrice + notaryFees;
      newLoanAmount = totalPurchaseCost - this.downPayment;

      if (Math.abs(newLoanAmount - loanAmount) < 1) break; // Close enough
    }

    return {
      monthlyPayment: this.monthlyPayment, // Use the input monthly payment
      requiredSalary: this.calculateRequiredSalary(this.monthlyPayment),
      totalCost: this.calculateTotalCost(this.monthlyPayment, this.loanDuration),
      propertyPrice: propertyPrice,
      loanAmount: newLoanAmount,
      notaryFees: notaryFees,
      totalPurchaseCost: totalPurchaseCost,
    };
  }

  private calculateFromSalary(): CalculationResult {
    // In salary mode, the salary is the input and property price is calculated
    // First, calculate the maximum monthly payment this salary can afford
    // considering existing loans and rental income
    const maxMonthlyPayment = this.calculateMaxMonthlyPayment(this.requiredSalary);

    // Calculate the property price that would result in this monthly payment
    const price = this.calculatePropertyPrice(maxMonthlyPayment, this.interestRate, this.loanDuration);
    const notaryFees = this.calculateNotaryFees(price);
    const totalPurchaseCost = price + notaryFees;
    const loanAmount = totalPurchaseCost - this.downPayment;

    // Recalculate actual monthly payment based on the loan amount
    const actualMonthlyPayment = this.calculateMonthlyPayment(loanAmount, this.interestRate, this.loanDuration);

    return {
      monthlyPayment: actualMonthlyPayment,
      requiredSalary: this.requiredSalary, // Keep the input salary unchanged
      totalCost: this.calculateTotalCost(actualMonthlyPayment, this.loanDuration),
      propertyPrice: price,
      loanAmount: loanAmount,
      notaryFees: notaryFees,
      totalPurchaseCost: totalPurchaseCost,
    };
  }

  // Utility methods
  getLoanAmount(): number {
    return this.propertyPrice - this.downPayment;
  }

  getMonthlyRate(): number {
    return this.interestRate / 100 / 12;
  }

  getNumberOfPayments(): number {
    return this.loanDuration * 12;
  }

  // Validation methods
  validateInputs(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.propertyPrice <= 0) errors.push('Property price must be positive');
    if (this.monthlyPayment <= 0) errors.push('Monthly payment must be positive');
    if (this.requiredSalary <= 0) errors.push('Required salary must be positive');
    if (this.downPayment < 0) errors.push('Down payment cannot be negative');
    if (this.loanDuration <= 0) errors.push('Loan duration must be positive');
    if (this.interestRate < 0) errors.push('Interest rate cannot be negative');
    if (this.downPayment >= this.propertyPrice) errors.push('Down payment cannot exceed property price');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
