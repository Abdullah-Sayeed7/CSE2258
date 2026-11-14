var answers = {
  "python-easy":  ["B","C","D","A","B","C","D","A","B","C"],

  "python-hard":  ["B","C","D","A","B","C","D","A","B","C","D","A","B","C","D"],

  "c-easy":       ["B","C","D","A","B","C","D","A","B","C"],

  "c-hard":       ["B","C","D","A","B","C","D","A","B","C","D","A","B","C","D"],

  "cpp-easy":     ["B","C","D","A","B","C","D","A","B","C"],

  "cpp-hard":     ["B","C","D","A","B","C","D","A","B","C","D","A","B","C","D"],

  "java-easy":    ["B","C","D","A","B","C","D","A","B","C"],

  "java-hard":    ["B","C","D","A","B","C","D","A","B","C","D","A","B","C","D"],

  "html-easy":    ["B","C","D","A","B","C","D","A","B","C"],

  "html-hard":    ["B","C","D","A","B","C","D","A","B","C","D","A","B","C","D"],

  "css-easy":     ["B","C","D","A","B","C","D","A","B","C"],

  "css-hard":     ["B","C","D","A","B","C","D","A","B","C","D","A","B","C","D"]
};

var currentPath = window.location.pathname;
var pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1).replace(".html", "");
if (pageName === "") {
  pageName = "index";
}

var timerInterval = null;
var quizSubmitted = false;


function startTimer(minutes) {
  var totalSeconds = minutes * 60;
  var timerDisplay = document.getElementById("timer");

  timerInterval = setInterval(function () {
    var mins = Math.floor(totalSeconds / 60);
    var secs = totalSeconds % 60;

    if (mins < 10) { mins = "0" + mins; }
    if (secs < 10) { secs = "0" + secs; }

    timerDisplay.innerHTML = mins + ":" + secs;

    if (totalSeconds <= 120) {
      timerDisplay.style.color = "#f43f5e";
    }

    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      alert("Time is up! Your quiz will be submitted now.");
      quizSubmitted = true;
      submitQuiz();
    }

    totalSeconds--;
  }, 1000);
}

function getSelectedValue(questionName) {
  var radios = document.getElementsByName(questionName);
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return null;
}

function calculateScore() {
  var key = answers[pageName];
  if (!key) { return 0; }

  var score = 0;
  for (var i = 0; i < key.length; i++) {
    var questionName = "q" + (i + 1);
    var selectedValue = getSelectedValue(questionName);
    if (selectedValue === key[i]) {
      score++;
    }
  }
  return score;
}

function validateForm() {
  var nameInput = document.getElementById("studentName");
  var studentName = nameInput ? nameInput.value.trim() : "";
  if (studentName === "") {
    alert("Name must be filled out");
    if (nameInput) {
      nameInput.focus();
      nameInput.style.borderColor = "#f43f5e";
    }
    return false;
  }
  if (nameInput) {
    nameInput.style.borderColor = "#475569";
  }

  var emailInput = document.getElementById("studentEmail");
  var studentEmail = emailInput ? emailInput.value.trim() : "";
  var emailPattern = /^[A-Za-z0-9_]+@[A-Za-z]+\.[A-Za-z]{2,}$/;
  if (!emailPattern.test(studentEmail)) {
    alert("Please enter a valid email address (e.g., student_1@college.edu)");
    if (emailInput) {
      emailInput.focus();
      emailInput.style.borderColor = "#f43f5e";
    }
    return false;
  }
  if (emailInput) {
    emailInput.style.borderColor = "#475569";
  }

  var rollInput = document.getElementById("studentRoll");
  var studentRoll = rollInput ? rollInput.value.trim() : "";
  var rollPattern = /^[A-Za-z0-9]{12}$/;
  if (!rollPattern.test(studentRoll)) {
    alert("Roll number must be exactly 12 characters (e.g. 20251CSE0332)");
    if (rollInput) {
      rollInput.focus();
      rollInput.style.borderColor = "#f43f5e";
    }
    return false;
  }
  if (rollInput) {
    rollInput.style.borderColor = "#475569";
  }

  var key = answers[pageName];
  if (!key) { return true; }

  var questionCards = document.getElementsByClassName("question");
  var allAnswered = true;
  var firstUnanswered = null;

  for (var i = 0; i < key.length; i++) {
    var questionName = "q" + (i + 1);
    var selectedValue = getSelectedValue(questionName);

    if (selectedValue === null) {
      allAnswered = false;
      if (questionCards[i]) {
        questionCards[i].style.borderColor = "#f43f5e";
        if (!firstUnanswered) {
          firstUnanswered = questionCards[i];
        }
      }
    } else {
      if (questionCards[i]) {
        questionCards[i].style.borderColor = "#334155";
      }
    }
  }

  if (!allAnswered) {
    alert("Please answer all questions before submitting.");
    return false;
  }
  return true;
}

function submitQuiz() {
  var key = answers[pageName];
  if (!key) { return false; }

  if (!quizSubmitted) {
    if (!validateForm()) {
      return false;
    }
  }

  quizSubmitted = true;

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  var score = calculateScore();
  var total = key.length;

  var nameInput = document.getElementById("studentName");
  var rollInput = document.getElementById("studentRoll");
  var sName = nameInput ? nameInput.value.trim() : "";
  var sRoll = rollInput ? rollInput.value.trim().toUpperCase() : "";

  var resultsUrl = "results.html?score=" + score + "&total=" + total + "&quiz=" + pageName;
  if (sName !== "") {
    resultsUrl += "&name=" + encodeURIComponent(sName);
  }
  if (sRoll !== "") {
    resultsUrl += "&roll=" + encodeURIComponent(sRoll);
  }

  window.location.href = resultsUrl;
  return false;
}

function getQueryParameter(name) {
  var query = window.location.search.substring(1);
  var pairs = query.split("&");
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    if (pair[0] === name) {
      return pair[1];
    }
  }
  return null;
}

function showResults() {
  var score = getQueryParameter("score");
  var total = getQueryParameter("total");
  var quizName = getQueryParameter("quiz");
  var studentName = getQueryParameter("name");
  var studentRoll = getQueryParameter("roll");

  var scoreDisplay = document.getElementById("scoreDisplay");
  var feedbackDisplay = document.getElementById("feedbackDisplay");
  var quizTitle = document.getElementById("quizTitle");

  var badge = document.getElementById("candidateBadge");
  var nameSpan = document.getElementById("candidateName");
  var rollSpan = document.getElementById("candidateRoll");
  if (studentName && studentRoll && badge && nameSpan && rollSpan) {
    nameSpan.innerHTML = decodeURIComponent(studentName);
    rollSpan.innerHTML = decodeURIComponent(studentRoll).toUpperCase();
    badge.style.display = "block";
  }

  if (score !== null && total !== null) {
    scoreDisplay.innerHTML = score + "/" + total;

    var percentage = Math.round((parseInt(score) / parseInt(total)) * 100);

    if (percentage >= 80) {
      feedbackDisplay.innerHTML = "Excellent! You scored " + percentage + "%! Outstanding job!";
      feedbackDisplay.style.color = "#10b981";
    } else if (percentage >= 50) {
      feedbackDisplay.innerHTML = "Good effort! You scored " + percentage + "%. Keep practicing!";
      feedbackDisplay.style.color = "#fbbf24";
    } else {
      feedbackDisplay.innerHTML = "You scored " + percentage + "%. Keep practicing, you can do better!";
      feedbackDisplay.style.color = "#f43f5e";
    }

    if (quizName && quizTitle) {
      var displayName = quizName.replace("-", " ");
      quizTitle.innerHTML = displayName.toUpperCase() + " - Results";
    }
  } else {
    scoreDisplay.innerHTML = "—";
    feedbackDisplay.innerHTML = "No quiz data found. Please take a quiz first.";
    feedbackDisplay.style.color = "#fbbf24";
  }
}

function setupOptionHighlight() {
  var options = document.getElementsByClassName("option");

  for (var i = 0; i < options.length; i++) {
    var radio = options[i].getElementsByTagName("input")[0];
    if (radio) {
      radio.onchange = function () {
        var groupRadios = document.getElementsByName(this.name);
        for (var j = 0; j < groupRadios.length; j++) {
          var label = groupRadios[j].parentNode;
          if (groupRadios[j].checked) {
            label.style.borderColor = "#6366f1";
            label.style.backgroundColor = "rgba(99, 102, 241, 0.15)";
          } else {
            label.style.borderColor = "#334155";
            label.style.backgroundColor = "#162032";
          }
        }

        var card = this.parentNode.parentNode;
        if (card) {
          card.style.borderColor = "#334155";
        }
      };
    }
  }
}

function setupNavigationLock() {
  window.onbeforeunload = function () {
    if (!quizSubmitted) {
      return "You have not submitted your quiz. Are you sure you want to leave?";
    }
  };
}

function setupStartConfirm() {
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    if (links[i].innerHTML === "Start Now") {
      links[i].onclick = function () {
        return confirm("Are you ready to start a quiz?");
      };
    }
  }
}

window.onload = function () {

  if (answers[pageName]) {
    var forms = document.getElementsByTagName("form");
    if (forms.length > 0) {
      forms[0].onsubmit = function () {
        return submitQuiz();
      };
    }

    var isHard = pageName.indexOf("hard") !== -1;
    var timerMinutes = isHard ? 30 : 20;

    startTimer(timerMinutes);
    setupOptionHighlight();
    setupNavigationLock();
  }

  if (pageName === "results") {
    showResults();
  }

  if (pageName === "index") {
    setupStartConfirm();
  }
};
