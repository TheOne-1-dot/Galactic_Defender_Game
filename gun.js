// Function to increase the score
function increaseScore() {
    
    console.log("Score increased!");
}

class Spaceship {
    constructor() {
        this.element = document.getElementById('spaceship');
        this.x = 375; // Initial position
        this.y = 580; // Initial position
        this.width = 50;
        this.height = 50;
        this.speed = 30;
        this.projectiles = [];
    }

    // Function to check collision between spaceship's projectiles and enemies
    checkProjectileCollision() {
        const projectiles = this.projectiles;
        const enemies = document.getElementsByClassName('enemy');
        for (let i = 0; i < projectiles.length; i++) {
            const projectile = projectiles[i];
            const projectileRect = projectile.getBoundingClientRect();
            for (let j = 0; j < enemies.length; j++) {
                const enemy = enemies[j];
                const enemyRect = enemy.getBoundingClientRect();
                if (projectileRect.top < enemyRect.bottom &&
                    projectileRect.bottom > enemyRect.top &&
                    projectileRect.left < enemyRect.right &&
                    projectileRect.right > enemyRect.left) {
                    // Collision detected
                    projectile.remove();
                    enemy.remove();
                    increaseScore(); // Call increaseScore function
                }
            }
        }
    }

    moveLeft() {
        if (this.x > 0) {
            this.x -= this.speed;
            this.element.style.left = this.x + 'px'; 
        }
    }

    moveRight() {
        if (this.x < 750) {
            this.x += this.speed;
            this.element.style.left = this.x + 'px'; 
        }
    }

    shoot() {
        const projectile = document.createElement('div');
        projectile.className = 'projectile';
        projectile.style.left = this.x + this.width / 2 + 'px';
        projectile.style.top = (this.y - 10) + 'px';
        document.getElementById('game-container').appendChild(projectile);
        this.projectiles.push(projectile);
    }
}

class Enemy {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'enemy';
        this.width = 30;
        this.height = 30;
        this.speed = Math.random() * 2 + 1; // Random speed for variation
        this.x = Math.random() * 770; // Random horizontal position
        this.y = -30; // Start above the screen
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        document.getElementById('game-container').appendChild(this.element);
    }

    moveDown() {
        this.y += this.speed;
        this.element.style.top = this.y + 'px';
        if (this.y > 600) {
            // Remove the enemy if it goes beyond the screen
            this.element.remove();
            return true; // Signal that the enemy is out of bounds
        }
        return false; // Signal that the enemy is still within bounds
    }
}

class Game {
    constructor() {
        this.spaceship = new Spaceship();
        this.enemies = [];
        this.score = 0;
        this.gameOver = false;
    }

    start() {
        this.gameLoop();
        this.enemyGenerator();
    }

    enemyGenerator() {
        setInterval(() => {
            if (!this.gameOver) {
                const enemy = new Enemy();
                this.enemies.push(enemy);
            }
        }, 1000); // Adjust enemy spawn rate as needed
    }

    checkCollisions() {
        const projectiles = this.spaceship.projectiles;
        const enemies = document.getElementsByClassName('enemy');
        for (let i = 0; i < projectiles.length; i++) {
            const projectile = projectiles[i];
            const projectileRect = projectile.getBoundingClientRect();
            for (let j = 0; j < enemies.length; j++) {
                const enemy = enemies[j];
                const enemyRect = enemy.getBoundingClientRect();
                if (projectileRect.top < enemyRect.bottom &&
                    projectileRect.bottom > enemyRect.top &&
                    projectileRect.left < enemyRect.right &&
                    projectileRect.right > enemyRect.left) {
                    // Collision detected
                    projectile.remove();
                    enemy.remove();
                    increaseScore(); // Call increaseScore function
                }
            }
        }
    }

    checkGameStatus() {
        if (this.enemies.some(enemy => enemy.y + enemy.height > this.spaceship.y)) {
            this.gameOver = true;
            alert("Game Over! You lost.");
            // You can add further actions for game over, like resetting the game.
        }
    }

    gameLoop() {
        this.spaceship.checkProjectileCollision();
        this.checkCollisions();
        this.checkGameStatus();
        this.moveProjectiles();
        this.moveEnemies();
        if (!this.gameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    moveEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].moveDown()) {
                this.enemies.splice(i, 1);
                i--; // Decrement i to account for removed enemy
            }
        }
    }

    moveProjectiles() {
        const projectiles = this.spaceship.projectiles;
        for (let i = 0; i < projectiles.length; i++) {
            const projectile = projectiles[i];
            const currentTop = parseInt(projectile.style.top);
            if (currentTop < 0) {
                projectile.remove();
                this.spaceship.projectiles.splice(i, 1);
                i--; // Decrement i to account for removed projectile
            } else {
                projectile.style.top = currentTop - 5 + 'px';
            }
        }
    }
}

const game = new Game();
game.start();

// Keyboard controls
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
        game.spaceship.moveLeft();
    } else if (e.key === 'ArrowRight') {
        game.spaceship.moveRight();
    } else if (e.code === 'Space') {
        game.spaceship.shoot();
    }
});
