document.addEventListener("DOMContentLoaded", function () {
  const downloadButton = document.querySelector(".downloadHash");

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
  }

  downloadButton.addEventListener("click", function () {
    // Generate a 32-character random string
    const randomString = generateRandomString(32);

    // Download it as a text file named "random-string.txt"
    downloadTextFile("random-string.txt", randomString);
  });
});
