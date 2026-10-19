const symbols = ["🍒", "🍋", "🍇", "🔔", "⭐", "🍀"];
let balance = 1000;

const balanceElement = document.querySelector("#balance");
const betInput = document.querySelector("#bet");
const message = document.querySelector("#message");
const reels = document.querySelectorAll("#reels span");
const formatAmount = (amount) => new Intl.NumberFormat("pl-PL").format(amount);

document.querySelector("#spin").addEventListener("click", () => {
    const bet = Number(betInput.value);

    if (!Number.isInteger(bet) || bet < 10) {
        message.textContent = "Zakład musi wynosić co najmniej 10 żetonów.";
        return;
    }

    if (bet > balance) {
        message.textContent = "Masz za mało żetonów na taki zakład.";
        return;
    }

    const result = Array.from(reels, (reel) => {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = symbol;
        return symbol;
    });
    const counts = result.reduce((totals, symbol) => {
        totals.set(symbol, (totals.get(symbol) || 0) + 1);
        return totals;
    }, new Map());
    const matchCount = Math.max(...counts.values());
    const multiplier = matchCount === 3 ? 5 : matchCount === 2 ? 2 : 0;
    const payout = bet * multiplier;

    balance = balance - bet + payout;
    balanceElement.textContent = formatAmount(balance);
    message.textContent = payout > 0
        ? `Wygrana: ${formatAmount(payout - bet)} żetonów. Wypłata: ${formatAmount(payout)} żetonów.`
        : `Przegrana: ${formatAmount(bet)} żetonów.`;
});