const validateSignupForm = (values) => {
    const errors = {};
  
    // Validate First Name
    if (!values.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (values.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
  
    // Validate Last Name
    if (!values.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (values.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
  
    // Validate Phone Number
    const phoneRegex = /^[0-9]{10}$/; // 10-digit phone number
    if (!values.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(values.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be a valid 10-digit number';
    }
  
    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Please enter a valid email address';
    }
  
    return errors;
  };
  
  export default validateSignupForm;
  