document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const goal = document.getElementById('goal');
    const enemies = document.querySelectorAll('.enemy');
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-button');
    const safeZone = document.getElementById('safe-zone');

    let playerPosition = { top: 140, left: 10 };
    let gameStarted = false;
    let inSafeZone = true;

    function movePlayer(e) {
        if (!gameStarted) return;

        switch (e.key) {
            case 'ArrowUp':
                if (playerPosition.top > 0) playerPosition.top -= 10;
                break;
            case 'ArrowDown':
                if (playerPosition.top < (gameContainer.clientHeight - player.clientHeight)) playerPosition.top += 10;
                break;
            case 'ArrowLeft':
                if (playerPosition.left > 0) playerPosition.left -= 10;
                break;
            case 'ArrowRight':
                if (playerPosition.left < (gameContainer.clientWidth - player.clientWidth)) playerPosition.left += 10;
                break;
        }
        player.style.top = (playerPosition.top - 130) + 'px';
        player.style.left = playerPosition.left + 'px';

        checkSafeZone();
        checkCollision();
    }

    function checkSafeZone() {
        const playerRect = player.getBoundingClientRect();
        const safeZoneRect = safeZone.getBoundingClientRect();
        inSafeZone = !(playerRect.right < safeZoneRect.left ||
                       playerRect.left > safeZoneRect.right ||
                       playerRect.bottom < safeZoneRect.top ||
                       playerRect.top > safeZoneRect.bottom);
    }

    function moveEnemies() {
        if (!gameStarted) return;

        enemies.forEach(enemy => {
            let direction = enemy.getAttribute('data-direction');
            let top = parseInt(enemy.style.top);
            let left = parseInt(enemy.style.left);

            if (direction === 'right') {
                if (left >= (gameContainer.clientWidth - enemy.clientWidth)) {
                    enemy.setAttribute('data-direction', 'left');
                } else {
                    enemy.style.left = (left + 2) + 'px';
                }
            } else if (direction === 'left') {
                if (left <= 0) {
                    enemy.setAttribute('data-direction', 'right');
                } else {
                    enemy.style.left = (left - 2) + 'px';
                }
            } else if (direction === 'down') {
                if (top >= (gameContainer.clientHeight - enemy.clientHeight)) {
                    enemy.setAttribute('data-direction', 'up');
                } else {
                    enemy.style.top = (top + 2) + 'px';
                }
            } else if (direction === 'up') {
                if (top <= 0) {
                    enemy.setAttribute('data-direction', 'down');
                } else {
                    enemy.style.top = (top - 2) + 'px';
                }
            }
        });
        checkCollision();
        requestAnimationFrame(moveEnemies);
    }

    function checkCollision() {
        if (inSafeZone) return;

        const playerRect = player.getBoundingClientRect();
        const goalRect = goal.getBoundingClientRect();
        if (!(goalRect.right < playerRect.left || 
            goalRect.left > playerRect.right || 
            goalRect.bottom < playerRect.top || 
            goalRect.top > playerRect.bottom)) {
            alert('You win!');
            resetPlayer();
        }

        enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();
            if (!(enemyRect.right < playerRect.left || 
                enemyRect.left > playerRect.right || 
                enemyRect.bottom < playerRect.top || 
                enemyRect.top > playerRect.bottom)) {
                player.classList.add('hit');
                setTimeout(() => {
                    alert('Game Over!');
                    resetPlayer();
                }, 500);
            }
        });
    }

    function resetPlayer() {
        playerPosition = { top: 140, left: 10 };
        player.style.top = '10px';
        player.style.left = playerPosition.left + 'px';
        player.classList.remove('hit');
        inSafeZone = true;
        gameStarted = false;
        startButton.style.display = 'block';
        gameContainer.style.display = 'none';
    }

    function startGame() {
        gameStarted = true;
        startButton.style.display = 'none';
        gameContainer.style.display = 'block';
        moveEnemies();
    }

    startButton.addEventListener('click', startGame);
    document.addEventListener('keydown', movePlayer);
});
