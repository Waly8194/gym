// تعريف العناصر والمتغيرات
const exerciseForm = document.getElementById('exercise-form');
const exerciseNameInput = document.getElementById('exercise-name');
const muscleGroupSelect = document.getElementById('muscle-group');
const weightInput = document.getElementById('weight');
const setsInput = document.getElementById('sets');
const repsInput = document.getElementById('reps');
const exerciseListContainer = document.getElementById('exercise-list');
const splitButtons = document.querySelectorAll('.btn-split');
const clearAllBtn = document.getElementById('clear-all-btn');

let currentDay = 'push';

let workouts = JSON.parse(localStorage.getItem('gymWorkouts')) || {
    push: [],
    pull: [],
    legs: [],
    arms: []
};

// إدارة الأيام
splitButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        splitButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentDay = e.target.getAttribute('data-day');
        renderExercises();
    });
});

// إضافة تمرين
exerciseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newExercise = {
        id: Date.now(),
        name: exerciseNameInput.value.trim(),
        muscle: muscleGroupSelect.value,
        muscleText: muscleGroupSelect.options[muscleGroupSelect.selectedIndex].text,
        weight: weightInput.value,
        sets: setsInput.value,
        reps: repsInput.value
    };

    workouts[currentDay].push(newExercise);
    saveToLocalStorage();
    renderExercises();
    exerciseForm.reset();
});

// عرض التمارين
function renderExercises() {
    exerciseListContainer.innerHTML = '';
    const currentExercises = workouts[currentDay];

    if (currentExercises.length === 0) {
        exerciseListContainer.innerHTML = `
            <p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 20px;">
                لا توجد تمارين مسجلة لهذا اليوم بعد. ابدأ بإضافة أول تمرين! 🚀
            </p>`;
        return;
    }

    currentExercises.forEach(ex => {
        const card = document.createElement('div');
        card.classList.add('exercise-card');
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${ex.name}</h3>
                <span class="badge">${ex.muscleText.split(' ')[0]}</span>
            </div>
            <div class="card-body">
                <p><strong>الوزن:</strong> ${ex.weight} كجم</p>
                <p><strong>المجموعات:</strong> ${ex.sets}</p>
                <p><strong>العدّات:</strong> ${ex.reps}</p>
            </div>
            <div class="card-actions">
                <button class="btn-delete" onclick="deleteExercise(${ex.id})">حذف التمرين</button>
            </div>
        `;

        exerciseListContainer.appendChild(card);
    });
}

// حذف تمرين
function deleteExercise(id) {
    workouts[currentDay] = workouts[currentDay].filter(ex => ex.id !== id);
    saveToLocalStorage();
    renderExercises();
}

// مسح الكل
clearAllBtn.addEventListener('click', () => {
    if (confirm('هل أنت متأكد من مسح جميع تمارين هذا اليوم؟')) {
        workouts[currentDay] = [];
        saveToLocalStorage();
        renderExercises();
    }
});

// حفظ البيانات في LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('gymWorkouts', JSON.stringify(workouts));
}

// ⏱️ عداد الراحة
let countdown;
const timerDisplay = document.getElementById('timer-countdown');

function startTimer(seconds) {
    clearInterval(countdown);
    let timeLeft = seconds;
    updateTimerDisplay(timeLeft);

    countdown = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerDisplay.textContent = "انتهت الراحة! 💪";
            if ("vibrate" in navigator) {
                navigator.vibrate(200);
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdown);
    timerDisplay.textContent = "00:00";
}

function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedMins = mins < 10 ? '0' + mins : mins;
    const formattedSecs = secs < 10 ? '0' + secs : secs;
    timerDisplay.textContent = `${formattedMins}:${formattedSecs}`;
}

// التشغيل الأولي
renderExercises();