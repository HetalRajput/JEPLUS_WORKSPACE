// validation.js

/**
 * Validates a phone number.
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {string|null} - Returns an error message if invalid, otherwise null.
 */
export const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
      return "Phone number is required.";
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      return "Phone number must be 10 digits.";
    }
    return null;
  };
  