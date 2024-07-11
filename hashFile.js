document.addEventListener("DOMContentLoaded", function () {
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

      alert(`Generated Hash: ${generatedHash}`);

      // Update file upload status
      const fileUploadStatus = document.querySelector(".fileUploadStatus");
      if (fileUploadStatus) {
        fileUploadStatus.textContent = "File uploaded";
      }
    };

    reader.onerror = function (event) {
      console.error("File reading error:", event.target.error);
    };

    reader.readAsText(file);
  }

  // Download button event listener
  const downloadButton = document.querySelector(".downloadHash");
  if (downloadButton) {
    downloadButton.addEventListener("click", function () {
      const randomString = generateRandomString(32);
      downloadTextFile("random-string.txt", randomString);
    });
  }

  // Upload button event listener
  const uploadButton = document.querySelector(".uploadHash");
  if (uploadButton) {
    uploadButton.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        handleFileUpload(file);
      }
    });
  }
});
