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
  grossSalary: number;
  totalOperationCost: number;
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
  public calculateMonthlyPayment(principal: number, rate: number, years: number): number {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) return principal / numberOfPayments;

    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  private calculateRequiredSalary(monthlyPayment: number): number {
    // Calculate required salary using the reverse debt ratio formula
    // Formula: [Mensualité - (Revenus Locatifs × Pourcentage Locatif) + Prêts Existants] / Taux d'Endettement
    const effectiveRentalIncome = this.rentalIncome * (this.rentalIncomePercentage / 100);
    const debtRateDecimal = this.debtRate / 100;
    // Required salary = [Monthly payment - (Rental income × Percentage) + Existing loans] / Debt rate
    const requiredSalary = (monthlyPayment - effectiveRentalIncome + this.existingLoans) / debtRateDecimal;
    return requiredSalary;
  }

  public calculateMaxMonthlyPayment(salary: number): number {
    // Calculate maximum monthly payment for a given salary considering existing loans and rental income
    // Only a percentage of rental income is considered (typically 70-80%)
    const effectiveRentalIncome = this.rentalIncome * (this.rentalIncomePercentage / 100);
    const debtRateDecimal = this.debtRate / 100;
    // Maximum available for loans = (Salary * debt rate) + (Effective rental income) - (Existing loans)
    const maxAvailableForLoans = (salary * debtRateDecimal) + effectiveRentalIncome - this.existingLoans;
    return Math.max(0, maxAvailableForLoans); // Ensure non-negative
  }

  private calculateGrossSalary(netSalary: number): number {
    // Convert net salary to gross salary (approximate conversion)
    // This is a simplified calculation - in reality, it depends on many factors
    // Using a rough estimate: gross = net / 0.75 (assuming ~25% taxes and charges)
    return netSalary / 0.75;
  }

  private calculateTotalOperationCost(totalPurchaseCost: number, totalCost: number): number {
    // Total operation cost = total purchase cost + total credit cost (interest)
    // This represents the total amount you'll pay over the entire loan period
    return totalPurchaseCost + totalCost;
  }



  public calculateLoanAmountFromMonthlyPayment(monthlyPayment: number, rate: number, years: number): number {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;

    // Formula: M × [1 - (1 + r)^-n] / r
    // This is the present value of an annuity formula
    return monthlyPayment * (1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate;
  }

  public calculateNotaryFees(propertyPrice: number): number {
    // French notary fees for existing properties (vente d'immeuble existant)
    // Based on actual French regulations and typical online simulators

    // For existing properties, notary fees are approximately 7-8% of property price
    // This includes: émoluments de notaire, droits d'enregistrement, taxes diverses
    // Using 7.5% as specified in the business requirements

    return propertyPrice * 0.075; // 7.5% - as per business requirements
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
    // Step 1: Calculate notary fees = property price × 7.5%
    const notaryFees = this.calculateNotaryFees(this.propertyPrice);

    // Step 2: Calculate loan amount = property price - down payment
    const loanAmount = this.propertyPrice - this.downPayment;

    // Step 3: Calculate monthly payment using the mortgage formula
    const monthlyPayment = this.calculateMonthlyPayment(loanAmount, this.interestRate, this.loanDuration);

    // Step 4: Calculate required salary using the reverse debt ratio formula
    const requiredSalary = this.calculateRequiredSalary(monthlyPayment);

    // Step 5: Calculate total cost = (monthly payment × number of months) - loan amount
    const totalCost = (monthlyPayment * this.loanDuration * 12) - loanAmount;

    // Step 6: Calculate total purchase cost = property price + notary fees
    const totalPurchaseCost = this.propertyPrice + notaryFees;

    // Step 7: Calculate gross salary from net salary
    const grossSalary = this.calculateGrossSalary(requiredSalary);

    // Step 8: Calculate total operation cost
    const totalOperationCost = this.calculateTotalOperationCost(totalPurchaseCost, totalCost);

    return {
      monthlyPayment: monthlyPayment,
      requiredSalary: requiredSalary,
      totalCost: totalCost,
      propertyPrice: this.propertyPrice,
      loanAmount: loanAmount,
      notaryFees: notaryFees,
      totalPurchaseCost: totalPurchaseCost,
      grossSalary: grossSalary,
      totalOperationCost: totalOperationCost,
    };
  }





  private calculateFromMonthly(): CalculationResult {
    // Step 1: Calculate the loan amount from the monthly payment
    // Formula: M × [1 - (1 + r)^-n] / r
    const loanAmount = this.calculateLoanAmountFromMonthlyPayment(this.monthlyPayment, this.interestRate, this.loanDuration);

    // Step 2: Calculate property price = loan amount + down payment
    const propertyPrice = loanAmount + this.downPayment;

    // Step 3: Calculate notary fees = property price × 7.5%
    const notaryFees = this.calculateNotaryFees(propertyPrice);

    // Step 4: Calculate required salary using the reverse debt ratio formula
    const requiredSalary = this.calculateRequiredSalary(this.monthlyPayment);

    // Step 5: Calculate total cost = (monthly payment × number of months) - loan amount
    const totalCost = (this.monthlyPayment * this.loanDuration * 12) - loanAmount;

    // Step 6: Calculate total purchase cost = property price + notary fees
    const totalPurchaseCost = propertyPrice + notaryFees;

    // Step 7: Calculate gross salary from net salary
    const grossSalary = this.calculateGrossSalary(requiredSalary);

    // Step 8: Calculate total operation cost
    const totalOperationCost = this.calculateTotalOperationCost(totalPurchaseCost, totalCost);

    return {
      monthlyPayment: this.monthlyPayment, // Use the input monthly payment
      requiredSalary: requiredSalary,
      totalCost: totalCost,
      propertyPrice: propertyPrice,
      loanAmount: loanAmount,
      notaryFees: notaryFees,
      totalPurchaseCost: totalPurchaseCost,
      grossSalary: grossSalary,
      totalOperationCost: totalOperationCost,
    };
  }





  private calculateFromSalary(): CalculationResult {
    // Step 1: Calculate the maximum monthly payment this salary can afford
    // considering existing loans and rental income
    const monthlyPayment = this.calculateMaxMonthlyPayment(this.requiredSalary);

    // Step 2: Calculate the loan amount directly from the monthly payment
    const loanAmount = this.calculateLoanAmountFromMonthlyPayment(monthlyPayment, this.interestRate, this.loanDuration);

    // Step 3: Calculate property price = loan amount + down payment
    const propertyPrice = loanAmount + this.downPayment;

    // Step 4: Calculate notary fees = property price × 7.5%
    const notaryFees = propertyPrice * 0.075;

    // Step 5: Calculate total cost = (monthly payment × number of months) - loan amount
    const totalCost = (monthlyPayment * this.loanDuration * 12) - loanAmount;

    // Step 6: Calculate total purchase cost = property price + notary fees
    const totalPurchaseCost = propertyPrice + notaryFees;

    // Step 7: Calculate gross salary from net salary
    const grossSalary = this.calculateGrossSalary(this.requiredSalary);

    // Step 8: Calculate total operation cost
    const totalOperationCost = this.calculateTotalOperationCost(totalPurchaseCost, totalCost);

    return {
      monthlyPayment: monthlyPayment,
      requiredSalary: this.requiredSalary, // Keep the input salary unchanged
      totalCost: totalCost,
      propertyPrice: propertyPrice,
      loanAmount: loanAmount,
      notaryFees: notaryFees,
      totalPurchaseCost: totalPurchaseCost,
      grossSalary: grossSalary,
      totalOperationCost: totalOperationCost,
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
