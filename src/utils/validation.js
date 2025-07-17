const validateUserInput = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
    return "First name is required and must be a non-empty string.";
  }
  if (!lastName || typeof lastName !== "string" || lastName.trim() === "") {
    return "Last name is required and must be a non-empty string.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return "Valid email is required.";
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return "Password is required and must be at least 6 characters long.";
  }

  return null; // no error
};
module.exports = {
  validateUserInput,
};
