// permet de detecter la collision entre la zone d'attaque d'un joueur et un autre joueur
function rectangularCollision({ rectangle1, rectangle2 }) {
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width // ici on verifie que l'on ne depasse pas non plus le joueur auquel cas l'attaque ne touche pas non plus
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y   // les deux lignes suivantes servent a verifier que lorsque l'on saute, l'attaque ne touche plus si on depasse le joueur ennemi
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, ennemy, timerId}) {
    clearTimeout(timerId) // pour arreter le timer lorsqu'il y a un gagnant
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health == ennemy.health) {
        document.querySelector('#displayText').innerHTML = 'EGALITE'
    } else if (player.health > ennemy.health) {
            document.querySelector('#displayText').innerHTML = 'SAMURAI MACK WINS'
    } else if (ennemy.health > player.health) {
            document.querySelector('#displayText').innerHTML = 'KENJI WINS'
    }
}

// fonction qui va gerer le timer
let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000) // permet de creer une loop infinie pendant 1000 tours
        timer--
        document.querySelector('#timer').innerHTML = timer // permet de modifier ce que contient la balise avec cet id
    }

    if (timer == 0) {
        determineWinner({player, ennemy, timerId})
    }
}