export interface CalculationInputs {
  propertyPrice: number;
  monthlyPayment: number;
  requiredSalary: number;
  downPayment: number;
  loanDuration: number;
  interestRate: number;
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

  // Setters for inputs
  set propertyPrice(value: number) { this.inputs.propertyPrice = value; }
  set monthlyPayment(value: number) { this.inputs.monthlyPayment = value; }
  set requiredSalary(value: number) { this.inputs.requiredSalary = value; }
  set downPayment(value: number) { this.inputs.downPayment = value; }
  set loanDuration(value: number) { this.inputs.loanDuration = value; }
  set interestRate(value: number) { this.inputs.interestRate = value; }

  // Core calculation methods
  private calculateMonthlyPayment(principal: number, rate: number, years: number): number {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  private calculateRequiredSalary(monthlyPayment: number): number {
    // Rule of thumb: monthly payment should not exceed 33% of net salary
    return monthlyPayment / 0.33;
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
    const property = this.calculatePropertyPrice(this.monthlyPayment, this.interestRate, this.loanDuration);
    const notaryFees = this.calculateNotaryFees(property);
    const totalPurchaseCost = property + notaryFees;
    const loanAmount = totalPurchaseCost - this.downPayment;
    
    return {
      monthlyPayment: this.monthlyPayment,
      requiredSalary: this.calculateRequiredSalary(this.monthlyPayment),
      totalCost: this.calculateTotalCost(this.monthlyPayment, this.loanDuration),
      propertyPrice: property,
      loanAmount: loanAmount,
      notaryFees: notaryFees,
      totalPurchaseCost: totalPurchaseCost,
    };
  }

  private calculateFromSalary(): CalculationResult {
    const payment = this.requiredSalary * 0.33;
    const price = this.calculatePropertyPrice(payment, this.interestRate, this.loanDuration);
    const notaryFees = this.calculateNotaryFees(price);
    const totalPurchaseCost = price + notaryFees;
    const loanAmount = totalPurchaseCost - this.downPayment;
    
    return {
      monthlyPayment: payment,
      requiredSalary: this.requiredSalary,
      totalCost: this.calculateTotalCost(payment, this.loanDuration),
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
