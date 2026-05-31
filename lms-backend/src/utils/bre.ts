export const runBusinessRuleEngine = (user: any) => {
  const errors = [];
  
  if (!user.dob) {
    errors.push("Date of Birth is required");
  } else {
    const dobDate = new Date(user.dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    if (age < 23 || age > 50) {
      errors.push(`Age must be between 23 and 50 (Current age: ${age})`);
    }
  }

  if (!user.monthlySalary || user.monthlySalary < 25000) {
    errors.push("Salary must be at least 25,000/month");
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!user.pan || !panRegex.test(user.pan)) {
    errors.push("Invalid PAN format");
  }

  if (user.employmentMode === 'Unemployed') {
    errors.push("Applicant cannot be unemployed");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
  return true;
};