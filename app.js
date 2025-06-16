// Game state
let currentWeek = null;
let currentQuestion = null;
let correctCount = 0;
let totalCount = 0;
let isAnswerChecked = false;

// Initialize the app
function initApp() {
    createWeekButtons();
}

// Generate week selection buttons
function createWeekButtons() {
    console.log('Creating week buttons...');
    const weekGrid = document.getElementById('weekGrid');
    if (!weekGrid) {
        console.error('weekGrid element not found');
        return;
    }
    
    weekGrid.innerHTML = '';
    const weeks = Object.keys(vocabularyData);
    console.log('Number of weeks:', weeks.length);
    
    weeks.forEach((week, index) => {
        const btn = document.createElement('button');
        btn.className = 'week-btn';
        btn.textContent = `สัปดาห์ ${index + 1}`;
        btn.onclick = () => startWeek(week);
        weekGrid.appendChild(btn);
    });
}

// Select a week and start practice
function startWeek(week) {
    console.log('Starting week:', week);
    currentWeek = week;
    document.querySelector('.week-selector').style.display = 'none';
    const practiceArea = document.getElementById('practiceArea');
    if (practiceArea) {
        practiceArea.style.display = 'block';
    }
    const weekNumber = parseInt(week.split(' ')[1]);
    document.getElementById('currentWeek').textContent = `สัปดาห์ที่ ${weekNumber}`;
    resetStats();
    nextQuestion();
}

// Generate next question
function nextQuestion() {
    if (!currentWeek) return;
    
    const weekVocab = vocabularyData[currentWeek];
    const randomIndex = Math.floor(Math.random() * weekVocab.length);
    const isEnglishToThai = Math.random() < 0.5;
    
    currentQuestion = {
        word: weekVocab[randomIndex],
        isEnglishToThai: isEnglishToThai
    };
    
    document.getElementById('questionType').textContent = 
        isEnglishToThai ? 'แปลเป็นภาษาไทย:' : 'แปลเป็นภาษาอังกฤษ:';
    document.getElementById('questionText').textContent = 
        isEnglishToThai ? currentQuestion.word.english : currentQuestion.word.thai;
    
    const answerInput = document.getElementById('answerInput');
    answerInput.value = '';
    answerInput.disabled = false;
    answerInput.focus();
    
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    
    isAnswerChecked = false;
}

// Check the answer
function checkAnswer() {
    if (!currentQuestion || isAnswerChecked) return;
    
    const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
    const correctAnswer = currentQuestion.isEnglishToThai 
        ? currentQuestion.word.thai.toLowerCase() 
        : currentQuestion.word.english.toLowerCase();
    
    const isCorrect = isAnswerSimilarEnough(userAnswer, correctAnswer);
    
    totalCount++;
    if (isCorrect) correctCount++;
    
    updateStats();
    showFeedback(isCorrect, correctAnswer);
    
    document.getElementById('answerInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('nextBtn').disabled = false;
    
    isAnswerChecked = true;
}

// Check if the answer is similar enough
function isAnswerSimilarEnough(userAnswer, correctAnswer) {
    if (userAnswer === correctAnswer) return true;
    
    // Check English answer with a flexible matching
    if (/^[a-zA-Z\s]+$/.test(correctAnswer)) {
        // Remove all spaces and symbols
        const cleanUserAnswer = userAnswer.replace(/[^a-z]/g, '');
        const cleanCorrectAnswer = correctAnswer.replace(/[^a-z]/g, '');
        
        // Accept if at least 80% is typed correctly
        if (cleanUserAnswer.length > 0 && cleanCorrectAnswer.includes(cleanUserAnswer)) {
            return cleanUserAnswer.length >= cleanCorrectAnswer.length * 0.8;
        }
    }
    
    // Check Thai answer with a flexible matching
    if (/[\u0E00-\u0E7F]/.test(correctAnswer)) {
        // Remove all spaces and symbols
        const cleanUserAnswer = userAnswer.replace(/[^\u0E00-\u0E7F]/g, '');
        const cleanCorrectAnswer = correctAnswer.replace(/[^\u0E00-\u0E7F]/g, '');
        
        // Accept if at least 80% is typed correctly
        if (cleanUserAnswer.length > 0 && cleanCorrectAnswer.includes(cleanUserAnswer)) {
            return cleanUserAnswer.length >= cleanCorrectAnswer.length * 0.8;
        }
    }
    
    return false;
}

// Show feedback
function showFeedback(isCorrect, correctAnswer) {
    const feedback = document.getElementById('feedback');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    
    if (isCorrect) {
        feedback.textContent = '🎉 ถูกต้อง!';
    } else {
        feedback.textContent = `❌ ไม่ถูกต้อง คำตอบที่ถูกคือ: ${correctAnswer}`;
    }
}

// Update statistics display
function updateStats() {
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('accuracy').textContent = 
        totalCount > 0 ? Math.round((correctCount / totalCount) * 100) + '%' : '0%';
}

// Reset statistics
function resetStats() {
    correctCount = 0;
    totalCount = 0;
    updateStats();
}

// Go back to week selection
function goBack() {
    document.querySelector('.week-selector').style.display = 'block';
    document.getElementById('practiceArea').style.display = 'none';
    currentWeek = null;
    resetStats();
}

// Handle Enter key press
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initApp();
    
    document.getElementById('answerInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (!isAnswerChecked) {
                checkAnswer();
            } else {
                nextQuestion();
            }
        }
    });
});

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    createWeekButtons();
    const practiceArea = document.getElementById('practiceArea');
    if (practiceArea) {
        practiceArea.style.display = 'none';
    }
}); 