// Utility Functions
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
  document.body.removeChild(a);
}

function getAsciiValue(char) {
  return char.charCodeAt(0);
}

function generateHashTable() {
  const hashTable = [];
  for (let i = 97; i <= 122; i++) hashTable.push(String.fromCharCode(i)); // a-z
  for (let i = 65; i <= 90; i++) hashTable.push(String.fromCharCode(i)); // A-Z
  for (let i = 48; i <= 57; i++) hashTable.push(String.fromCharCode(i)); // 0-9
  const specialChars = '!@#$%^&*()_+{}:"<>?[];'; // Special characters
  hashTable.push(...specialChars.split(""));
  return hashTable;
}

function validatePassword(password) {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+{}:"<>?[\];]/.test(password);

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

// Password Handling Functions
function handlePasswordFocus() {
  const passwordElement = document.getElementById("password");
  const warningElement = document.getElementById("passwordWarning");

  if (!passwordElement || !warningElement) return;

  if (passwordElement.value.trim() === "") {
    warningElement.textContent = "Password cannot be empty.";
  } else {
    const validation = validatePassword(passwordElement.value);
    warningElement.textContent = validation.valid ? "" : validation.error;
  }
}

function generateUniquePassword(fileContent) {
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
  let websiteName = websiteElement.value.trim().toLowerCase();

  const validation = validatePassword(uniquePassword);
  if (!validation.valid) {
    warningElement.textContent = validation.error;
    return;
  }

  const hashTable = generateHashTable();
  const hashTableLength = hashTable.length;

  let asciiProduct = 1;
  for (let i = 0; i < fileContent.length; i++) {
    asciiProduct *= getAsciiValue(fileContent.charAt(i));
  }
  for (let i = 0; i < uniquePassword.length && i < websiteName.length; i++) {
    asciiProduct *=
      getAsciiValue(websiteName.charAt(i)) *
      getAsciiValue(uniquePassword.charAt(i));
  }

  let generatedPassword = "";
  for (let i = 0; i < 16; i++) {
    generatedPassword += hashTable[asciiProduct % hashTableLength];
    asciiProduct = Math.floor(asciiProduct / hashTableLength);
  }

  const specialChars = '!@#$%^&*()_+{}:"<>?[];';
  const specialIndex = getAsciiValue(uniquePassword.charAt(0)) % 16;
  const specialChar = specialChars.charAt(specialIndex % specialChars.length);
  generatedPassword =
    generatedPassword.substring(0, specialIndex) +
    specialChar +
    generatedPassword.substring(specialIndex + 1);

  outputElement.textContent = generatedPassword;
  warningElement.textContent = "";
}

// File Handling Functions
function handleFileUpload(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const fileContent = event.target.result.trim();
    generateUniquePassword(fileContent);
  };
  reader.onerror = function (event) {
    console.error("File reading error:", event.target.error);
  };
  reader.readAsText(file);
}

// Clipboard Handling Functions
function copyToClipboard() {
  const outputElement = document.querySelector(".passOutput");
  const passwordText = outputElement.textContent;

  if (passwordText.trim() === "") {
    alert("Generate a password first.");
    return;
  }

  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(passwordText);
    return;
  }

  navigator.clipboard
    .writeText(passwordText)
    .then(() => alert("Password copied to clipboard!"))
    .catch((err) => {
      console.error("Error copying password to clipboard: ", err);
      fallbackCopyTextToClipboard(passwordText);
    });
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    alert("Password copied to clipboard!");
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
    alert("Oops, unable to copy password to clipboard. Please copy manually.");
  }

  document.body.removeChild(textArea);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  const passwordElement = document.getElementById("password");
  if (passwordElement)
    passwordElement.addEventListener("blur", handlePasswordFocus);

  const downloadButton = document.getElementById("downloadHash");
  if (downloadButton) {
    downloadButton.addEventListener("click", function () {
      const randomString = generateRandomString(32);
      const filename = "random_string.txt";
      downloadTextFile(filename, randomString);
    });
  } else {
    console.error("Download button not found!");
  }

  const generateButton = document.querySelector(".button-30");
  if (generateButton) {
    generateButton.addEventListener("click", function () {
      const fileUploadElement = document.getElementById("fileUpload");
      if (fileUploadElement && fileUploadElement.files.length > 0) {
        handleFileUpload(fileUploadElement.files[0]);
      } else {
        generateUniquePassword("");
      }
    });
  }

  const copyButton = document.querySelector(".button-54");
  if (copyButton) copyButton.addEventListener("click", copyToClipboard);

  const uploadButton = document.querySelector(".uploadHash");
  if (uploadButton) {
    uploadButton.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) handleFileUpload(file);
    });
  }
});
