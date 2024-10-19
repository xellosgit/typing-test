const quoteApiUrl = "http://localhost:3000/quote"; // URL to fetch from local server

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let mistakes = 0;
let time = 60;
let timer = null;

// Function to fetch a new quote from the local server
const fetchNewQuote = async () => {
  try {
    const response = await fetch(quoteApiUrl); // Fetching from local Node.js server

    if (!response.ok) throw new Error("Failed to fetch the quote");

    const data = await response.json();
    quote = data.content;

    // Display the quote with each character wrapped in a span for easy styling
    const quoteChars = quote
      .split("")
      .map((char) => `<span class='quote-char'>${char}</span>`);
    quoteSection.innerHTML = quoteChars.join("");
  } catch (error) {
    console.error("Error fetching the quote:", error);
    quoteSection.innerHTML =
      "Не вдалося завантажити цитату. Спробуйте пізніше.";
  }
};

// Function to compare the typed input with the quote
userInput.addEventListener("input", () => {
  const quoteChars = document.querySelectorAll(".quote-char");
  const userInputChars = userInput.value.split("");

  // Reset mistakes
  mistakes = 0;

  quoteChars.forEach((char, index) => {
    // Correct character
    if (userInputChars[index] === char.innerText) {
      char.classList.add("success");
      char.classList.remove("fail");
    }
    // If user hasn't entered anything or backspaced
    else if (userInputChars[index] == null) {
      char.classList.remove("success", "fail");
    }
    // Incorrect character
    else {
      char.classList.add("fail");
      char.classList.remove("success");
      mistakes++;
    }
  });

  // Display mistakes count
  document.getElementById("mistakes").innerText = mistakes;

  // Check if the entire quote has been typed correctly
  if (quoteChars.length === userInputChars.length && mistakes === 0) {
    stopTest();
  }
});

// Function to start the typing test
const startTest = () => {
  mistakes = 0;
  time = 60;
  userInput.disabled = false;
  userInput.value = "";
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
  document.querySelector(".result").style.display = "none"; // Hide previous result
  startTimer();
  fetchNewQuote();
};

// Function to stop the typing test
const stopTest = () => {
  clearInterval(timer);
  userInput.disabled = true;
  document.getElementById("stop-test").style.display = "none";
  document.getElementById("start-test").style.display = "block";
  displayResult();
};

// Function to start the timer
const startTimer = () => {
  timer = setInterval(() => {
    if (time > 0) {
      time--;
      document.getElementById("timer").innerText = `${time}s`;
    } else {
      stopTest();
    }
  }, 1000);
};

// Function to display the typing test result
const displayResult = () => {
  // Show the result section no matter what
  const resultSection = document.querySelector(".result");
  resultSection.style.display = "block"; // Show the result section

  const timeTaken = (60 - time) / 60 || 1; // Total time taken (1 minute = 60 seconds)
  const totalTypedChars = userInput.value.length;

  // Handle case where no characters are typed to avoid NaN%
  if (totalTypedChars === 0) {
    document.getElementById("accuracy").innerHTML = `<strong>0%</strong>`;
    document.getElementById("wpm").innerHTML = `<strong>0.00</strong> wpm`;
    return; // Exit the function early
  }

  const wordsTyped = totalTypedChars / 5; // A word is typically 5 characters
  const wpm = (wordsTyped / timeTaken).toFixed(2); // Words per minute calculation

  // Accuracy: If some characters were typed, calculate accuracy based on input
  const accuracy = Math.round(
    ((totalTypedChars - mistakes) / totalTypedChars) * 100
  );

  // Display the calculated results
  document.getElementById("wpm").innerHTML = `<strong>${wpm}</strong> wpm`;
  document.getElementById(
    "accuracy"
  ).innerHTML = `<strong>${accuracy}%</strong>`;
};

// Function to toggle between light and dark themes
const toggleThemeButton = document.getElementById("theme-toggle");

toggleThemeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  // Update button text based on current theme
  if (document.body.classList.contains("light-theme")) {
    toggleThemeButton.innerText = "Switch to Light Theme";
  } else {
    toggleThemeButton.innerText = "Switch to Dark Theme";
  }
});

// Add event listeners for start and stop buttons
document.getElementById("start-test").addEventListener("click", startTest);
document.getElementById("stop-test").addEventListener("click", stopTest);
