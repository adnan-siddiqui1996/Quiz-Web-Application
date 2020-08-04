//Nav Bar
function openNav() {
    var sideNav = document.getElementById("mySidenav");
    var width = window.innerWidth
    if(width < 576) {
        document.getElementById("mySidenav").style.width = "200px";
        document.getElementById("main").style.marginLeft = "200px";
    }
    else{
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    }
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
}

//submit Data
var name = localStorage.getItem("name");
function submit() {
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var contact = document.getElementById('contact');
    console.log(name.value);
    if(name.value === "" || email.value === "" || contact.value === "") {
        alert("Please fill all the fields");
    }
    else{
        localStorage.setItem("name", name.value);
        window.location.href = "questions.html";
    }
}

//Add question & option on quiz
const questionNumber = document.querySelector(".question-number");
const questionText = document.querySelector(".question-text");
const optionContainer = document.querySelector(".option-container");
const answersIndicatorContainer = document.querySelector(".answers-indicator");
const homeBox = document.querySelector(".home-box");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const timerBox = document.querySelector(".timer");

function onloadFunction() {
    homeBox.querySelector(".total-question").innerHTML = quiz.length;
}


let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctAnswers = 0;
let attempt = 0;


// Push the questions into availableQuestions Array
function setAvailableQuestions() {
    const totalQuestion = quiz.length;
    for(let i = 0; i < totalQuestion; i++) {
        availableQuestions.push(quiz[i]);
    }
}

function getNewQuestion() {
    questionNumber.innerHTML = "Question " + (questionCounter + 1) + " of " + quiz.length;

    const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    currentQuestion = questionIndex;
    questionText.innerHTML = currentQuestion.question;

    const index1 = availableQuestions.indexOf(questionIndex);

    availableQuestions.splice(index1, 1);
    
    const optionLen = currentQuestion.options.length;

    for(let i = 0; i < optionLen; i++) {
        availableOptions.push(i);
    }
    
    optionContainer.innerHTML = '';
    let animationDelay = 0.15;
    //Create option in html
    for(let i = 0; i < optionLen; i++) {
        //Remove Option
        const OptionIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)];
        // Get the position of 'optionIndex' from the 'availableOptions'
        const index2 = availableOptions.indexOf(OptionIndex);
        //Remove the 'optionIndex' from the 'availableOption', so that the option does not repeat
        availableOptions.splice(index2, 1);
        const option = document.createElement("div");
        option.innerHTML = currentQuestion.options[OptionIndex];
        option.id = OptionIndex;
        option.style.animationDelay = animationDelay + 's';
        animationDelay = animationDelay + 0.15;
        option.className = "option";
        optionContainer.appendChild(option);
        option.setAttribute("onclick", "getResult(this)");
    }

    questionCounter++;
}

//Get the result of current attempt question
function getResult(element) {
    var id = parseInt(element.id);
    //Get the answer by comparing the id of clicked option
    if(id === currentQuestion.answer){
        //Set the green color to the correct option
        element.classList.add("correct");
        //Add the indicator to correct mark 
        updateAnswerIndicator("correct");
        correctAnswers++;
    }
    else{
        //Set the red color to the wrong option
        element.classList.add("wrong");
        //Add the indicator to wrong mark 
        updateAnswerIndicator("wrong");
        //If the answer is incorrect show the correct option by green color
        const optionLen = optionContainer.children.length;
        for(var i = 0; i < optionLen; i++) {
            if(parseInt(optionContainer.children[i].id) === currentQuestion.answer) {
                optionContainer.children[i].classList.add("correct");
            }
        }
    }
    attempt++;
    unclickableOptions();
}

//Make all the options unclickable once the user select an option
function unclickableOptions() {
    const optionLen = optionContainer.children.length;
    for (var i = 0; i < optionLen; i++) {
        optionContainer.children[i].classList.add("already-answered");
    }
}

function answersIndicator() {
    answersIndicatorContainer.innerHTML = '';
    const totalQuestion = quiz.length;
    for(var i = 0; i < totalQuestion; i++) {
        const indicator =    document.createElement("div");
        answersIndicatorContainer.appendChild(indicator);
    }
}

function updateAnswerIndicator(markType) {
    answersIndicatorContainer.children[questionCounter-1].classList.add(markType);
}

function next() {
    if(questionCounter === quiz.length) {
        quizOver();
    }
    else{
        minute = 1;
        time = 60;
        getNewQuestion();
    }
}

function quizOver() {
    //Hide quiz box
    quizBox.classList.add("hide");
    timerBox.classList.add("hide");
    resultBox.classList.remove("hide");
    quizResult();
}
//Get the quiz Result
function quizResult() {
    resultBox.querySelector(".student-name").innerHTML = name;
    resultBox.querySelector(".total-question").innerHTML = quiz.length;
    resultBox.querySelector(".total-attempt").innerHTML = attempt;
    resultBox.querySelector(".total-correct").innerHTML = correctAnswers;
    resultBox.querySelector(".total-wrong").innerHTML = attempt - correctAnswers;
    var percentage = (correctAnswers * 100) / quiz.length;
    resultBox.querySelector(".percentage").innerHTML = percentage.toFixed(2) + "%";
    resultBox.querySelector(".total-score").innerHTML = correctAnswers + " / " + quiz.length;
}

var resetCounter = 0;
//Reset Quiz
function resetQuiz() {
    resetCounter++;
    minute = 1;
    time = 60;
    questionCounter = 0;
    correctAnswers = 0;
    attempt = 0;
}

//Try Again Quiz
function tryAgain() {
    resultBox.classList.add("hide");
    timerBox.classList.add("hide");
    homeBox.classList.remove("hide");
    resetQuiz();
}

//Go to Home
function goToHome() {
    resetQuiz();
    window.location.href = "index.html";    
}

//Starting point
function startQuiz() {
    if(resetCounter === 0) {
        setInterval(updateCount,1000);
    }
    homeBox.classList.add("hide");
    timerBox.classList.remove("hide")
    quizBox.classList.remove("hide");
    // First we set all questions in 'availableQuestions' array
    setAvailableQuestions();
    //Second we call new question function
    getNewQuestion();
    //We create indicator of answers
    answersIndicator();
}


//Timer
var minute = 1;
var time = minute * 60;
const countDownEl = document.getElementById('counter');
var min, sec;
function updateCount() {
    if(min === 0 && sec === 0) {
        if(questionCounter >= quiz.length) {
            quizOver();
        }
        minute = 1;
        time = minute * 60;
        getNewQuestion();
    }
    min = Math.floor(time / 60);
    sec = time % 60;
    countDownEl.innerHTML = min + " : " + sec;
    time--;
}






