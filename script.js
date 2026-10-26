const symbols = ["🍒", "🍋", "🍇", "🔔", "⭐", "🍀"];
let balance = 1000;

const balanceElement = document.querySelector("#balance");
const betInput = document.querySelector("#bet");
const message = document.querySelector("#message");
const reels = document.querySelectorAll("#reels span");
const formatAmount = (amount) => new Intl.NumberFormat("pl-PL").format(amount);

const spinButton = document.querySelector("#spin");
const reelsContainer = document.querySelector("#reels");
const celebration = document.querySelector("#celebration");
const casinoClock = document.querySelector("#casino-clock");

const updateClock = () => {
    if (!casinoClock) return;
    const time = new Date();
    casinoClock.textContent = time.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
    casinoClock.dateTime = time.toISOString();
};

updateClock();
window.setInterval(updateClock, 1000);

const randomSymbol = (symbolsToChooseFrom = symbols) =>
    symbolsToChooseFrom[Math.floor(Math.random() * symbolsToChooseFrom.length)];

const generateResult = () => {
    const roll = Math.random();

    if (roll < 0.84) {
        const noPair = [...symbols].sort(() => Math.random() - 0.5).slice(0, 3);
        return noPair;
    }

    if (roll < 0.96) {
        const matchingSymbol = randomSymbol();
        const otherSymbols = symbols.filter((symbol) => symbol !== matchingSymbol);
        const otherSymbol = randomSymbol(otherSymbols);
        return Math.random() < 0.5
            ? [matchingSymbol, matchingSymbol, otherSymbol]
            : [matchingSymbol, otherSymbol, matchingSymbol];
    }

    const matchingSymbol = randomSymbol();
    return [matchingSymbol, matchingSymbol, matchingSymbol];
};

const celebrateWin = () => {
    const colors = ["#f5cf52", "#e84a3c", "#ffffff", "#35a86c", "#2c7dd1"];

    for (let index = 0; index < 70; index += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti";
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.setProperty("--fall-duration", `${1.8 + Math.random() * 1.7}s`);
        piece.style.setProperty("--drift", `${-120 + Math.random() * 240}px`);
        piece.style.setProperty("--spin", `${360 + Math.random() * 720}deg`);
        piece.style.animationDelay = `${Math.random() * .45}s`;
        celebration.appendChild(piece);
        window.setTimeout(() => piece.remove(), 4000);
    }
};

spinButton?.addEventListener("click", () => {
    const bet = Number(betInput.value);

    if (!Number.isInteger(bet) || bet < 10) {
        message.textContent = "Zakład musi wynosić co najmniej 10 żetonów.";
        return;
    }

    if (bet > balance) {
        message.textContent = "Masz za mało żetonów na taki zakład.";
        return;
    }

    const result = generateResult();
    const shuffleInterval = window.setInterval(() => {
        reels.forEach((reel) => {
            reel.textContent = randomSymbol();
        });
    }, 220);

    spinButton.disabled = true;
    reelsContainer.classList.add("spinning");
    message.textContent = "Kręcenie...";

    result.forEach((symbol, index) => {
        window.setTimeout(() => {
            const reel = reels[index];
            reel.style.animation = "none";
            reel.textContent = symbol;
        }, 700 + index * 350);
    });

    window.setTimeout(() => {
        window.clearInterval(shuffleInterval);
        reelsContainer.classList.remove("spinning");
        reels.forEach((reel) => reel.style.removeProperty("animation"));

        const counts = result.reduce((totals, symbol) => {
            totals.set(symbol, (totals.get(symbol) || 0) + 1);
            return totals;
        }, new Map());
        const matchCount = Math.max(...counts.values());
        const multiplier = matchCount === 3 ? 5 : matchCount === 2 ? 2 : 0;
        const payout = bet * multiplier;

        balance = balance - bet + payout;
        balanceElement.textContent = formatAmount(balance);
        message.classList.toggle("win", payout > 0);
        message.textContent = payout > 0
            ? `Wygrana: ${formatAmount(payout - bet)} żetonów. Wypłata: ${formatAmount(payout)} żetonów.`
            : `Przegrana: ${formatAmount(bet)} żetonów.`;
        if (payout > 0) celebrateWin();
        spinButton.disabled = false;
    }, 1500);
});