const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: { preload, create, update },
  physics: { default: "arcade" },
  backgroundColor: "#222",
};

let player, bullets, cursors, spaceKey, zombies, gameOverText;
let lastZombieTime = 0;
let gameOver = false;
let score = 0;
const game = new Phaser.Game(config);

function preload() {
  this.load.image("player", "assets/player.png");
  this.load.image("bullet", "assets/bullet.png");
  this.load.image("zombie", "assets/zombie.png");
}

function create() {
  player = this.physics.add.sprite(100, 300, "player").setScale(0.2);
  player.setCollideWorldBounds(true);

  bullets = this.physics.add.group();
  zombies = this.physics.add.group();

  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // 🏆 Title
  this.add.text(20, 10, "Shrimpers take over szn!", {
    fontSize: "28px",
    fill: "#fff",
    fontStyle: "bold",
  });

  // 🧮 Scoreboard
  scoreText = this.add.text(20, 50, "Score: 0", {
    fontSize: "24px",
    fill: "#0f0",
  });
  // 🔁 Restart Button (top right)
  restartButton = this.add
    .text(660, 20, "⟳ Restart", {
      fontSize: "22px",
      fill: "#fff",
      backgroundColor: "#333",
      padding: { x: 1, y: 5 },
    })
    .setInteractive()
    .on("pointerdown", () => {
      this.scene.restart();
      score = 0;
      gameOver = false;
    })
    // 🔵 Hover: Light background and scale up
    .on("pointerover", () => {
      restartButton.setStyle({ backgroundColor: "#555", fill: "#0f0" });
      restartButton.setScale(1.1);
    })
    // 🔙 Unhover: Revert to normal
    .on("pointerout", () => {
      restartButton.setStyle({ backgroundColor: "#333", fill: "#fff" });
      restartButton.setScale(1);
    });

  // 🎯 Game Over text (center screen, hidden initially)
  gameOverText = this.add.text(250, 250, "", {
    fontSize: "48px",
    fill: "#f00",
  });

  // 🔥 Bullet hits zombie
  this.physics.add.overlap(bullets, zombies, (bullet, zombie) => {
    bullet.destroy();
    zombie.destroy();
    score += 1;
    scoreText.setText("Score: " + score);
  });

  // 💀 Zombie hits player
  this.physics.add.overlap(player, zombies, () => {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    gameOverText.setText("shrimp got fried!");
  });
}

function update(time) {
  if (!gameOver) {
    if (cursors.up.isDown) player.y -= 5;
    if (cursors.down.isDown) player.y += 5;

    if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
      const bullet = bullets.create(player.x + 20, player.y, "bullet");
      bullet.setVelocityX(400);
      bullet.setScale(0.1);
    }

    if (time > lastZombieTime + 1000) {
      const y = Phaser.Math.Between(50, 550);
      const zombie = zombies.create(800, y, "zombie");
      zombie.setVelocityX(-100);
      zombie.setScale(0.25);
      lastZombieTime = time;
    }
  }
}
