// Function to get ASCII value of a character
function getAsciiValue(char) {
  return char.charCodeAt(0);
}

// Function to generate a hash table
function generateHashTable() {
  const hashTable = [];
  for (let i = 97; i <= 122; i++) {
    // a-z
    hashTable.push(String.fromCharCode(i));
  }
  for (let i = 65; i <= 90; i++) {
    // A-Z
    hashTable.push(String.fromCharCode(i));
  }
  for (let i = 48; i <= 57; i++) {
    // 0-9
    hashTable.push(String.fromCharCode(i));
  }
  const specialChars = '!@#$%^&*()_+{}:"<>?[];'; // Define at least 10 special characters
  const specialCharArray = specialChars.split("");
  hashTable.push(...specialCharArray);
  return hashTable;
}

// Function to generate a 32-character random string
function generateRandomString(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
}

// Function to download a text file
function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
}

// Function to validate password
function validatePassword(password) {
  // Password must be at least 12 characters long and contain at least one uppercase letter, lowercase letter, number, and special character
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+{}:"<>?[\];]/.test(password); // Adjusted for special characters

  if (password.length < minLength) {
    return {
      valid: false,
      error: "Password must be at least 12 characters long.",
    };
  }

  if (!hasUpperCase) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter.",
    };
  }

  if (!hasLowerCase) {
    return {
      valid: false,
      error: "Password must contain at least one lowercase letter.",
    };
  }

  if (!hasNumber) {
    return {
      valid: false,
      error: "Password must contain at least one number.",
    };
  }

  if (!hasSpecialChar) {
    return {
      valid: false,
      error: "Password must contain at least one special character.",
    };
  }

  return { valid: true };
}

// Function to handle focus change on password input
function handlePasswordFocus() {
  const passwordElement = document.getElementById("password");
  const warningElement = document.getElementById("passwordWarning");

  if (!passwordElement || !warningElement) {
    return;
  }

  if (passwordElement.value.trim() === "") {
    warningElement.textContent = "Password cannot be empty.";
  } else {
    const validation = validatePassword(passwordElement.value);
    if (!validation.valid) {
      warningElement.textContent = validation.error;
    } else {
      warningElement.textContent = "";
    }
  }
}

// Function to generate the unique password
function generateUniquePassword() {
  const passwordElement = document.getElementById("password");
  const websiteElement = document.getElementById("website");
  const outputElement = document.querySelector(".passOutput");
  const warningElement = document.getElementById("passwordWarning");

  if (
    !passwordElement ||
    !websiteElement ||
    !outputElement ||
    !warningElement
  ) {
    alert("Required elements are missing!");
    return;
  }

  const uniquePassword = passwordElement.value.trim();
  let websiteName = websiteElement.value.trim().toLowerCase(); // Convert website name to lowercase

  const validation = validatePassword(uniquePassword); // Validate password before generating

  if (!validation.valid) {
    warningElement.textContent = validation.error;
    return;
  }

  const hashTable = generateHashTable();
  const hashTableLength = hashTable.length;

  let asciiProduct = 1;
  for (let i = 0; i < uniquePassword.length && i < websiteName.length; i++) {
    const websiteChar = websiteName.charAt(i);
    const passwordChar = uniquePassword.charAt(i);
    asciiProduct *= getAsciiValue(websiteChar) * getAsciiValue(passwordChar);
  }

  let generatedPassword = "";
  for (let i = 0; i < 16; i++) {
    generatedPassword += hashTable[asciiProduct % hashTableLength];
    asciiProduct = Math.floor(asciiProduct / hashTableLength);
  }

  // Insert special character at a fixed position
  const specialChars = '!@#$%^&*()_+{}:"<>?[];'; // Define at least 10 special characters
  const specialIndex = getAsciiValue(uniquePassword.charAt(0)) % 16;
  const specialChar = specialChars.charAt(specialIndex % specialChars.length);
  generatedPassword =
    generatedPassword.substring(0, specialIndex) +
    specialChar +
    generatedPassword.substring(specialIndex + 1);

  outputElement.textContent = generatedPassword;
  warningElement.textContent = ""; // Clear any previous validation warnings
}

// Function to copy the generated password to the clipboard
function copyToClipboard() {
  const outputElement = document.querySelector(".passOutput");
  const passwordText = outputElement.textContent;

  if (passwordText == "Your password") {
    alert("Generate a password first. 😊");
    return;
  }

  if (!navigator.clipboard) {
    // Clipboard API not supported
    fallbackCopyTextToClipboard(passwordText);
    return;
  }

  navigator.clipboard
    .writeText(passwordText)
    .then(() => {
      alert("Password copied to clipboard! 😊");
    })
    .catch((err) => {
      console.error("Error copying password to clipboard: ", err);
      // Fallback method if clipboard write fails
      fallbackCopyTextToClipboard(passwordText);
    });
}

// Fallback method for unsupported browsers
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
    alert("Password copied to clipboard!");
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
    alert("Oops, unable to copy password to clipboard. Please copy manually.");
  }

  document.body.removeChild(textArea);
}

// Function to handle file upload and generate hash
function handleFileUpload(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const uploadedContent = event.target.result.trim();
    const hashTable = generateHashTable();
    const hashTableLength = hashTable.length;
    let asciiProduct = 1;

    // Multiply ASCII values of each character in uploaded content
    for (let i = 0; i < uploadedContent.length; i++) {
      asciiProduct *= getAsciiValue(uploadedContent.charAt(i));
    }

    // Generate a hash using ASCII product and previous multiplication values
    let generatedHash = "";
    for (let i = 0; i < 16; i++) {
      generatedHash += hashTable[asciiProduct % hashTableLength];
      asciiProduct = Math.floor(asciiProduct / hashTableLength);
    }

    // Append generatedHash to existing password output
    const outputElement = document.querySelector(".passOutput");
    outputElement.textContent += generatedHash;
    alert(`Generated Hash: ${generatedHash}`);
  };

  reader.onerror = function (event) {
    console.error("File reading error:", event.target.error);
  };

  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", function () {
  const passwordElement = document.getElementById("password");

  // Add event listeners for focus change and input validation
  if (passwordElement) {
    passwordElement.addEventListener("blur", handlePasswordFocus);
  }

  const generateButton = document.querySelector(".button-30");
  const copyButton = document.querySelector(".button-54");
  const uploadButton = document.querySelector(".uploadHash");

  if (generateButton) {
    generateButton.addEventListener("click", generateUniquePassword);
  }

  if (copyButton) {
    copyButton.addEventListener("click", copyToClipboard);
  }

  if (uploadButton) {
    uploadButton.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        handleFileUpload(file);
      }
    });
  }
});
