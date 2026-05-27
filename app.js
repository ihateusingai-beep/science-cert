// ============ 全域變數 ============
var studentName = "";
var progress = { sun: false, cloud: false, rain: false, snow: false, dew: false };
var quizScore = 0;
var currentQ = 0;
var isDewInteractive = false;

// ============ 登入 ============
function enterGame() {
    var input = document.getElementById('student-name');
    var name = input.value.trim();
    if (!name) { alert("請輸入你的名字才能開始魔術喔！"); input.focus(); return; }
    studentName = name;
    landingPage.style.opacity = "0";
    setTimeout(function() {
        landingPage.style.display = "none";
        gameContainer.classList.remove('hidden');
    }, 500);
}

// ============ 實驗按鈕 ============
function makeSun() {
    if (progress.sun) return;
    cloud.classList.add('hidden');
    sun.classList.remove('hidden');
    sun.classList.add('sun-active');
    statusText.innerHTML = '太陽升起咗！☀️ 太陽曬在水上，水会變成<span class="highlight-yellow">水蒸氣</span>！';
    showSound('升~！');
    progress.sun = true;
}

function makeCloud() {
    if (!progress.sun || progress.cloud) return;
    cloud.innerHTML = '☁️';
    cloud.classList.remove('hidden');
    cloud.classList.add('cloud-active');
    statusText.innerHTML = '水蒸氣升上去遇冷，變成<span class="highlight-blue">小水滴</span>，聚埋一齊就係<span class="highlight-sky">雲☁️</span>！';
    showSound('聚合！');
    progress.cloud = true;
}

function makeRain() {
    if (!progress.cloud || progress.rain) return;
    clearPrecipitation();
    for (var i = 0; i < 30; i++) {
        var drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 90 + 5 + '%';
        drop.style.top = '-20px';
        drop.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
        display.appendChild(drop);
    }
    statusText.innerHTML = '雲裡面太多水滴，整唔住就<span class="highlight-blue">跌落嚟</span>——落雨🌧️！';
    showSound('滴滴答！');
    progress.rain = true;
}

function makeSnow() {
    if (!progress.cloud || progress.snow) return;
    clearPrecipitation();
    for (var i = 0; i < 20; i++) {
        var flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.innerText = '❄️';
        flake.style.left = Math.random() * 90 + 5 + '%';
        flake.style.top = '-40px';
        flake.style.animationDuration = (2 + Math.random() * 2) + 's';
        display.appendChild(flake);
    }
    statusText.innerHTML = '如果溫度再凍啲，雨滴變成<span class="highlight-sky">雪❄️</span>！';
    showSound('雪雪雪！');
    progress.snow = true;
}

function makeDew() {
    if (progress.dew) return;
    var drop = document.createElement('div');
    drop.style.cssText = 'position:absolute;bottom:60px;left:50%;transform:translateX(-50%);width:20px;height:20px;background:linear-gradient(135deg,rgba(255,255,255,0.9),rgba(200,230,255,0.8));border-radius:50%;box-shadow:0 0 10px rgba(180,220,255,0.6);';
    display.appendChild(drop);
    statusText.innerHTML = '炎熱潮湿的空氣碰到凍嘅野，<span class="highlight-orange">水氣黏埋一齊</span>——露水🍹！';
    showSound('凝結！');
    progress.dew = true;
}

function clearPrecipitation() {
    document.querySelectorAll('.rain-drop, .snow-flake').forEach(function(d){ d.remove(); });
}

function showSound(text) {
    var el = document.createElement('div');
    el.className = 'sound-word';
    el.innerText = text;
    el.style.left = Math.random() * 60 + 20 + '%';
    el.style.top = Math.random() * 40 + 20 + '%';
    display.appendChild(el);
    setTimeout(function(){ el.remove(); }, 2000);
}

// ============ 小評估（5條題） ============
function startQuiz() {
    document.getElementById('quiz-section').classList.remove('hidden');
    quizScore = 0;
    currentQ = 0;
    loadQuizQuestion();
}

function loadQuizQuestion() {
    var questions = [
        { q: "☀️ 太陽令水變成咩？", o: ["💨 氣體", "🌧️ 雨", "☁️ 雲"], a: 0 },
        { q: "❄️ 空氣變冷時，水氣會點樣？", o: ["🔽 掉落下來", "🤝 抱在一起變雲", "💨 飛走"], a: 1 },
        { q: "🌧️ 雨係點樣形成嘅？", o: ["💨 太陽曬", "❄️ 雲裡面凍到出水", "🔥 火燒"], a: 1 },
        { q: "❄️ 雪係喺咩溫度形成？", o: ["🔥 好熱", "☀️ 有時凍", "🥶 極凍 (~0°C)"], a: 2 },
        { q: "🍹 露水係點樣出現？", o: ["🔥 高溫", "💨 壓縮", "🌙 暖空氣遇冷野"], a: 2 }
    ];
    var q = questions[currentQ];
    document.getElementById('quiz-question').innerText = q.q;
    quizOptsEl = document.getElementById('quiz-options');
    quizOptsEl.innerHTML = '';
    q.o.forEach(function(opt, idx) {
        var btn = document.createElement('button');
        btn.className = 'w-full text-left text-xl p-4 rounded-xl border-4 border-sky-200 bg-sky-50 hover:bg-sky-100 transition-all font-bold mb-3';
        btn.innerText = opt;
        btn.onclick = function() { checkQuizAnswer(idx, q.a, btn); };
        quizOptsEl.appendChild(btn);
    });
    document.getElementById('quiz-progress').innerText = '第 ' + (currentQ + 1) + ' 題 / ' + questions.length + ' 題';
}

function checkQuizAnswer(selected, correct, btnEl) {
    var buttons = quizOptsEl.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) buttons[i].style.pointerEvents = 'none';
    if (selected === correct) {
        btnEl.classList.add('bg-green-200', 'border-green-400');
        quizScore += 10;
    } else {
        btnEl.classList.add('bg-red-200', 'border-red-400');
        buttons[correct].classList.add('bg-green-200', 'border-green-400');
    }
    setTimeout(function() {
        currentQ++;
        if (currentQ >= 5) { showCert(); return; }
        loadQuizQuestion();
    }, 1200);
}

function showCert() {
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('cert-card').classList.remove('hidden');
    document.getElementById('cert-name').innerText = studentName + '，恭喜你！';
    document.getElementById('cert-score').innerText = quizScore + '/50';
    document.getElementById('cert-date').innerText = new Date().toLocaleDateString('zh-Hant');
    createConfetti();
}

function createConfetti() {
    var colors = ['#facc15','#fb923c','#34d399','#60a5fa','#a78bfa','#f472b6'];
    for (var i = 0; i < 50; i++) {
        var c = document.createElement('div');
        c.style.cssText = 'position:fixed;top:-20px;left:' + Math.random()*100 + 'vw;width:10px;height:10px;background:' + colors[Math.floor(Math.random()*6)] + ';border-radius:2px;z-index:9999;pointer-events:none;animation:confetti-fall ' + (1+Math.random()*2) + 's linear forwards';
        document.body.appendChild(c);
        setTimeout(function(el){ el.remove(); }, 4000, c);
    }
}

// ============ INIT ============
function bindButtons() {
    var btn = document.getElementById('btn-start');
    if (!btn) return false;
    landingPage = document.getElementById('landing-page');
    gameContainer = document.getElementById('game-container');
    statusText = document.getElementById('status-text');
    cloud = document.getElementById('cloud-obj');
    sun = document.getElementById('sun-obj');
    display = document.getElementById('display');
    btnSun = document.getElementById('btn-sun');
    btnCloud = document.getElementById('btn-cloud');
    btnRain = document.getElementById('btn-rain');
    btnSnow = document.getElementById('btn-snow');
    btnDew = document.getElementById('btn-dew');
    btnQuiz = document.getElementById('btn-quiz');
    dewDrops = document.getElementById('dew-drops');
    handHint = document.getElementById('hand-hint');
    certCard = document.getElementById('cert-card');
    quizQEl = document.getElementById('quiz-question');
    quizOptsEl = document.getElementById('quiz-options');
    quizProgEl = document.getElementById('quiz-progress');
    btn.addEventListener('click', enterGame);
    document.getElementById('student-name').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') enterGame();
    });
    document.getElementById('btn-sun').addEventListener('click', makeSun);
    document.getElementById('btn-cloud').addEventListener('click', makeCloud);
    document.getElementById('btn-rain').addEventListener('click', makeRain);
    document.getElementById('btn-snow').addEventListener('click', makeSnow);
    document.getElementById('btn-dew').addEventListener('click', makeDew);
    document.getElementById('btn-quiz').addEventListener('click', startQuiz);
    return true;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindButtons);
} else {
    bindButtons();
}
