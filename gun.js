class Spaceship {
    constructor() {
        this.element = document.getElementById('spaceship');
        this.x = 375; // Initial position
        this.y = 550; // Initial position
        this.width = 50;
        this.height = 50;
        this.speed = 20; // Increased speed for faster movement
        this.lives = 3; // Adding lives property
        this.projectiles = [];
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.shoot = this.shoot.bind(this);
        this.moveProjectiles = this.moveProjectiles.bind(this); // Bind moveProjectiles method
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
        this.moveProjectiles(); // Move projectiles immediately after shooting
        
    }

    // Function to handle when spaceship gets hit by an enemy
    getHit() {
        this.lives--;
        if (this.lives === 0) {
            this.gameOver();
        }
    }

    // Function to handle game over
    gameOver() {
        this.element.style.display = 'none'; // Hide the spaceship
        alert("Game Over! You lost.");
    }

    // Function to move projectiles
    moveProjectiles() {
        const projectiles = this.projectiles;
        for (let i = 0; i < projectiles.length; i++) {
            const projectile = projectiles[i];
            const currentTop = parseInt(projectile.style.top);
            if (currentTop > 0) {
                projectile.style.top = currentTop - 10 + 'px'; // projectile speed goes according to choice
            } else {
                projectile.remove();
                this.projectiles.splice(i, 1);
                i--; // Decrement i to account for removed projectile
            }
        }
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
        this.gameOver = false;
        this.score = 0;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = 'Score: ' + this.score;
    }

    destroyEnemy() {
        this.score += 10; // Increment score when an enemy is destroyed
        this.updateScoreDisplay(); // Update score display
    }

    start() {
        this.gameLoop();
        this.enemyGenerator();
        this.setupControls();
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

        // Move projectiles and check for collision with enemies
        for (let i = 0; i < projectiles.length; i++) {
            const projectile = projectiles[i];
            const projectileRect = projectile.getBoundingClientRect();
            projectile.style.top = projectile.offsetTop - 5 + 'px'; // Move the projectile upwards

            // Check collision with each enemy
            for (let j = 0; j < enemies.length; j++) {
                const enemy = enemies[j];
                const enemyRect = enemy.getBoundingClientRect();

                // Check if projectile and enemy overlap
                if (projectileRect.top < enemyRect.bottom &&
                    projectileRect.bottom > enemyRect.top &&
                    projectileRect.left < enemyRect.right &&
                    projectileRect.right > enemyRect.left) {

                    // Collision detected
                    projectile.remove();
                    enemy.remove();
                    this.enemies.splice(j, 1); // Remove enemy from array
                    this.destroyEnemy(); // Increase score for each enemy destroyed
                }
            }

            // Remove projectile if it goes off-screen
            if (projectileRect.bottom < 0) {
                projectile.remove();
                this.spaceship.projectiles.splice(i, 1);
                i--; // Decrement i to account for removed projectile
            }
        }

        // Check collision between spaceship and enemies
        const spaceshipRect = this.spaceship.element.getBoundingClientRect();
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const enemyRect = enemy.getBoundingClientRect();

            // Check if enemy collides with spaceship
            if (enemyRect.top < spaceshipRect.bottom &&
                enemyRect.bottom > spaceshipRect.top &&
                enemyRect.left < spaceshipRect.right &&
                enemyRect.right > spaceshipRect.left) {
                // Collision detected
                enemy.remove();
                this.spaceship.getHit(); // Reduce spaceship lives
                if (this.spaceship.lives === 0) {
                    this.gameOver = true;
                    this.spaceship.gameOver();
                }
            }
        }
    }

    gameLoop() {
        this.checkCollisions();
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
            }
        }
    }

    setupControls() {
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') {
                this.spaceship.moveLeft();
            } else if (e.key === 'ArrowRight') {
                this.spaceship.moveRight();
            } else if (e.code === 'Space') {
                this.spaceship.shoot();
                this.moveProjectiles(); // moveProjectiles when shooting
            }
        });
    }
}

const game = new Game();
game.start();
