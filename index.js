const canvas = document.querySelector('canvas'); // on stock la balise canvas présente dans l'index.html dans une variable
const c = canvas.getContext('2d'); // jeu 2d donc on prend un contexte 2d (on l'appelle c car on va bcp l'utiliser donc plus rapide)

// On redimensionne notre canvas pour l'adapter a tous les ecrans
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height) // pour dessiner un rectangle sur le canvas , 0,0 dit qu'on commence au top left

const gravity = 0.7 // permet de definir la vitesse a laquelle sautent nos joueurs

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/background.png"
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: "./img/shop.png",
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
    x: 0,
    y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/samuraiMack/Idle.png",
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: "./img/samuraiMack/Idle.png",
            framesMax: 8
        },
        run: {
            imageSrc: "./img/samuraiMack/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/samuraiMack/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/samuraiMack/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/samuraiMack/Attack1.png",
            framesMax: 6
        },
        takeHit: {
            imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
            framesMax: 4
        },
        death: {
            imageSrc: "./img/samuraiMack/Death.png",
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
}); // de cette maniere, nous definissons notre argument comme etant de type object

player.draw();

const ennemy = new Fighter({
    position: {
    x: 400,
    y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: "./img/samuraiMack/Idle.png",
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: "./img/kenji/Idle.png",
            framesMax: 4
        },
        run: {
            imageSrc: "./img/kenji/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/kenji/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/kenji/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/kenji/Attack1.png",
            framesMax: 4
        },
        takeHit: {
            imageSrc: "./img/kenji/Take hit.png",
            framesMax: 3
        },
        death: {
            imageSrc: "./img/kenji/Death.png",
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
});

ennemy.draw();

const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    z: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}



decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate); // permet de creer une loop d'animation car la fonction va appeler animate a l'infini
    c.fillStyle = 'black'; // pour pas avoir un background rouge
    c.fillRect(0,0, canvas.width, canvas.height);
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)' // donne du blanc, opacite de 0.15, permet de mieux distinguer les joueurs dans l'espace
    c.fillRect(0,0,canvas.width, canvas.height)
    player.update();
    ennemy.update();

    player.velocity.x = 0;
    ennemy.velocity.x = 0;

    // mouvement du joueur
    
    if(keys.q.pressed && player.lastKey == 'q') {
        player.velocity.x = -5; // definit la vitesse de deplacement 
        player.switchSprite('run') // permet de dire que quand on appui sur q, le sprite idle change pour devenir le sprite run
    } else if(keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // quand on saute, la velocite du personnage est negative
    if (player.velocity.y < 0) {  
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // ennemi du joueur
    if(keys.ArrowLeft.pressed && ennemy.lastKey == 'ArrowLeft') {
        ennemy.velocity.x = -5;
        ennemy.switchSprite('run')
    } else if(keys.ArrowRight.pressed && ennemy.lastKey == 'ArrowRight') {
        ennemy.velocity.x = 5
        ennemy.switchSprite('run')
    } else {
        ennemy.switchSprite('idle')
    }

    // quand on saute, la velocite du personnage est negative
    if (ennemy.velocity.y < 0) {  
        ennemy.switchSprite('jump')
    } else if (ennemy.velocity.y > 0) {
        ennemy.switchSprite('fall')
    }

    // detecte la collision d'une attaque contre un joueur (si le cote droit de la zone d'attaque a des coordonnees superieures a celles du cote gauche de l'ennemi) && quand on prend des degats
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: ennemy
    }) && player.isAttacking && player.framesCurrent === 4) { // derniere condition sert a choisir a quelle frame on retire de la vie a l'ennemi 
        ennemy.takeHit()
        player.isAttacking = false

        // animation de la barre de pv quand on perd de la vie
        gsap.to('#ennemyHealth', {
            width: ennemy.health + '%' // ici, c'est la longueur de la barre de vie que l'on veut animer
        })
    }

    // si le joueur rate son attaque
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // detecte la collision pour l'ennemi cette fois
    if (rectangularCollision({
        rectangle1: ennemy,
        rectangle2: player
    }) && ennemy.isAttacking && ennemy.framesCurrent === 2) { 
        player.takeHit()
        ennemy.isAttacking = false

        // animation de la vie du joueur qui diminue
        gsap.to('#playerHealth', {
            width: player.health + '%' // ici, c'est la longueur de la barre de vie que l'on veut animer
        })
    }

    // si l'ennemi rate son attaque
    if (ennemy.isAttacking && ennemy.framesCurrent === 2) { // les attaques de kenji sont plus rapides que celle de mack
        ennemy.isAttacking = false
    }

    // arret de la partie si un des deux joueurs n'a plus de pv
    if (ennemy.health <= 0 || player.health <= 0) {
        determineWinner({player, ennemy, timerId})
    }
}

animate();

window.addEventListener('keydown', (event) => {      // keydown permet de dire que l'on fait l'action a chaque appui de touche
    if (!player.dead) {
        
        switch(event.key) {
            case 'd':
                keys.d.pressed = true       // permet d'aller a droite
                player.lastKey = 'd'
                break
            case 'q':
                keys.q.pressed = true       // permet d'aller a gauche
                player.lastKey = 'q'               
                break
            case 'z':
                player.velocity.y = -20     // z permet au joueur de sauter
                break
            case ' ':
                player.attack()
                break
        }
    }
    
    // touches de l'ennemi
    if (!ennemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true       
                ennemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true       
                ennemy.lastKey = 'ArrowLeft'               
                break
            case 'ArrowUp':
                ennemy.velocity.y = -20     
                break
            case 'ArrowDown':
                ennemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {      // keydown permet de dire que l'on fait l'action a chaque levé de touche
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'q':
            keys.q.pressed = false
            break
        case 'z':
            keys.z.pressed = false
            break


        // touches de l'ennemi 
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        
    }
})

