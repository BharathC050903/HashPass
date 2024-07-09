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
  const specialChars = '!@#$%^&*()_+{}:"<>?[];', // Define at least 10 special characters
    specialCharArray = specialChars.split("");
  hashTable.push(...specialCharArray);
  return hashTable;
}

// Function to generate the unique password
// Function to generate the unique password
// Function to generate the unique password
function generateUniquePassword() {
  const passwordElement = document.getElementById("password");
  const websiteElement = document.getElementById("website");
  const outputElement = document.querySelector(".passOutput");

  if (!passwordElement || !websiteElement || !outputElement) {
    alert("Required elements are missing!");
    return;
  }

  const uniquePassword = passwordElement.value;
  const websiteName = websiteElement.value;

  if (!uniquePassword || !websiteName) {
    alert("Please enter both website name and unique password.");
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

  const specialChars = '!@#$%^&*()_+{}:"<>?[];'; // Define at least 10 special characters
  const specialCharArray = specialChars.split("");
  const specialIndex = getAsciiValue(uniquePassword.charAt(0)) % 16;
  const specialChar =
    specialCharArray[Math.floor(Math.random() * specialCharArray.length)];
  generatedPassword =
    generatedPassword.substring(0, specialIndex) +
    specialChar +
    generatedPassword.substring(specialIndex + 1);

  outputElement.textContent = generatedPassword;
}

// Function to copy the generated password to the clipboard
function copyToClipboard() {
  const outputElement = document.querySelector(".passOutput");
  const passwordText = outputElement.textContent;
  navigator.clipboard
    .writeText(passwordText)
    .then(() => {
      alert("Password copied to clipboard!");
    })
    .catch((err) => {
      console.error("Error copying password to clipboard: ", err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const generateButton = document.querySelector(".button-30");
  const copyButton = document.querySelector(".button-54");

  if (generateButton) {
    generateButton.addEventListener("click", generateUniquePassword);
  }

  if (copyButton) {
    copyButton.addEventListener("click", copyToClipboard);
  }
});
