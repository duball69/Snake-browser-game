// Retrieve and display highscores on the highscores page
const highscoresTable = document.querySelector('.highscore-table table');
const highscores = JSON.parse(localStorage.getItem('highscores')) || [];

highscoresTable.innerHTML = `
    <tr>
        <th>Rank</th>
        <th>Username</th>
        <th>Score</th>
    </tr>
    ${highscores.slice(0, 10).map((entry, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${entry.username}</td>
            <td>${entry.score}</td>
        </tr>
    `).join('')}
`;
