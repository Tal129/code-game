const soundCorrect = new Audio('sounds/correct.mp3');
const soundWrong = new Audio('sounds/wrong.mp3');
const soundBackground = new Audio('sounds/bg.mp3');
soundBackground.loop = true;
soundBackground.volume = 0.2; 


const allQuestions = {
        'Java': [
        { q: "رتب الكود لتعريف متغير صحيح x قيمته 10", correct: "intx=10;", options: ["int", "x", "=", "10", ";", "String", "float", ":"] },
        { q: "رتب كود طباعة كلمة Hi", correct: "System.out.println(\"Hi\");", options: ["System.out.println", "(", "\"Hi\"", ")", ";", "print", "out", ":"] },
        { q: "رتب الكود لزيادة قيمة المتغير x بواحد", correct: "x=x+1;", options: ["x", "=", "x", "+", "1", ";", "y", "-"] },
        { q: "رتب الشرط التالي (إذا كان x أكبر من 5)", correct: "if(x>5)", options: ["if", "(", "x", ">", "5", ")", "when", "{"] },
        { q: "رتب كود لجمع رقمين (y + z) وتخزينهم في sum", correct: "intsum=y+z;", options: ["int", "sum", "=", "y", "+", "z", ";", "add"] }
    ],
    'HTML': [
        { q: "رتب وسم العنوان الرئيسي لموقعك", correct: "<h1>مرحباً</h1>", options: ["<h1>", "مرحباً", "</h1>", "<body>", "<head>", "<h2>"] },
        { q: "رتب وسم إضافة رابط لموقع جوجل", correct: "<ahref=\"google.com\">جوجل</a>", options: ["<a", "href=", "\"google.com\"", ">", "جوجل", "</a>", "<link>", "src="] },
        { q: "رتب وسم إدراج صورة باسم logo.png", correct: "<imgsrc=\"logo.png\">", options: ["<img", "src=", "\"logo.png\"", ">", "href=", "</img>", "<image>"] },
        { q: "رتب وسم حاوية محتوى (div) بداخلها نص", correct: "<div>محتوى</div>", options: ["<div>", "محتوى", "</div>", "<span>", "<section>", "<p>"] },
        { q: "رتب وسم زر مكتوب عليه (إرسال)", correct: "<button>إرسال</button>", options: ["<button>", "إرسال", "</button>", "submit", "<input>", "type="] }
    ],
    'CSS': [
        { q: "رتب خاصية جعل لون النص أحمر", correct: "color:red;", options: ["color", ":", "red", ";", "font-color", "text-color", "="] },
        { q: "رتب خاصية جعل حجم الخط 20 بكسل", correct: "font-size:20px;", options: ["font-size", ":", "20px", ";", "text-size", "width", "size"] },
        { q: "رتب خاصية إضافة تباعد داخلي (padding) 10 بكسل", correct: "padding:10px;", options: ["padding", ":", "10px", ";", "margin", "11px", "border", "space"] },
        { q: "رتب خاصية جعل النص في المنتصف", correct: "text-align:center;", options: ["text-align", ":", "center", ";", "middle", "justify", "align"] },
        { q: "رتب خاصية تغيير لون الخلفية للأزرق", correct: "background-color:blue;", options: ["background-color", ":", "blue", ";", "bgcolor", "color", "fill"] }
    ]
};

let timeLeft = 30;
let timerId;
let score = 0;
let currentQuestionIndex = 0;


let pageType = window.location.pathname.includes('java') ? 'Java' : 
               window.location.pathname.includes('html') ? 'HTML' : 'CSS';

const questions = allQuestions[pageType];


window.onload = function() {
    
    let name = localStorage.getItem("playerName") || "المبرمج المبدع";
    if(document.getElementById("playerName")) {
        document.getElementById("playerName").innerText = "👤 " + name;
    }
    
    
    soundBackground.play().catch(e => console.log("المتصفح ينتظر تفاعل لتشغيل الصوت"));
    
    initGame();
};

function initGame() {
    loadQuestion();
    startTimer();
    
    
    new Sortable(document.getElementById('blocks'), { 
        group: 'shared', 
        animation: 150 
    });
    new Sortable(document.getElementById('drop-area'), { 
        group: 'shared', 
        animation: 150 
    });
}

 
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        finishGame(true); 
        return;
    }

    const qData = questions[currentQuestionIndex];
    document.getElementById("question").innerText = qData.q;
    
    const blocksContainer = document.getElementById("blocks");
    const dropArea = document.getElementById("drop-area");
    
    blocksContainer.innerHTML = ''; 
    dropArea.innerHTML = ''; 


    let shuffledOptions = [...qData.options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(opt => {
        const span = document.createElement("span");
        span.className = "game-block"; 
        span.innerText = opt;
        blocksContainer.appendChild(span);
    });
}

function startTimer() {
    timeLeft = 30;
    document.getElementById("timer").innerText = timeLeft;
    clearInterval(timerId);
    
    timerId = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            soundWrong.play();
            alert("⏰ انتهى الوقت!");
            finishGame(false); 
        }
    }, 1000);
}

 
function finish() {
    const dropArea = document.getElementById("drop-area");
   const userAnswer = Array.from(dropArea.children)
  .map(el => el.innerText)
  .join('')
  .replace(/\s/g, '');

const correctAnswer = questions[currentQuestionIndex].correct.replace(/\s/g, '');
    const correctAnswer = questions[currentQuestionIndex].correct;

    if (userAnswer === correctAnswer) {
        soundCorrect.play();
        score += 20;
        if(document.getElementById("score")) {
            document.getElementById("score").innerText = score;
        }
        currentQuestionIndex++;
        
        
        setTimeout(() => {
            loadQuestion();
            startTimer();
        }, 500);
    } else {
        soundWrong.play();
        alert("❌ الترتيب خاطئ، حاول مرة أخرى!");
    }
}

function retry() {
    location.reload();
}

function finishGame(isWin) {
    localStorage.setItem("result", isWin ? "true" : "false");
    localStorage.setItem("currentPage", window.location.pathname);
    soundBackground.pause();
    location.href = "result.html";
}
