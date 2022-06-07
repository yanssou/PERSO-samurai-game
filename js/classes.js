class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) { // mettre des acolades permet de convertir tous les arg en un de type object et de ne plus necessiter de mettre les arg dans l'ordre
        this.position = position;
        this.width = 50
        this.height = 150
        this.image = new Image() // creer une image html avec les proprietes js
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0  // combien de frames se sont ecoulees pendant toute l'animation
        this.framesHold = 5    // combien de frames doit on attendre avant de changer l'animation
        this.offset = offset
    }

    draw() {
       c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax), // permet d'avancer de frameCurrent frames pour animer notre image
            0,
            this.image.width / this.framesMax, // on veut isoler une frame de l'image, il y a 6 frames dans l'image.
            this.image.height, 
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold == 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent ++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        // gestion de l'animation
        this.animateFrames()
    }
}


class Fighter extends Sprite {  // les methodes utilisees qui ont le meme nom que celles dans la classe sprite seront privilegiees, on supprime les methodes de fighter que l'on veut prendre de sprite 
    constructor({
        position, 
        velocity, 
        color = 'red', 
        imageSrc, scale = 1, 
        framesMax = 1, 
        offset = {x: 0, y: 0}, 
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) { super({   
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity;
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {           // permet de definir la zone d'une attaque
            position: {
                x: this.position.x,
                y: this.position.y
            }, // pour que la position s'adapte a la position du joueur
            offset: attackBox.offset, // ()= offset: offset mais comme ils ont le meme nom on peut reduire comme ca) l'offset sert a placer la zone d'attaque de l'ennemi du cote inverse au joueur
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0  
        this.framesHold = 5
        this.sprites = sprites   
        this.dead = false
        
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image() // permet d'ajouter au tableau sprites et a la case sprite une nouvelle caracteristique nommee image et initialisee avec new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

    }

    update() {
        this.draw();
        if (!this.dead)
            this.animateFrames()

        // attackBoxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // dessin de la hitbox
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // gravity function
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 96) {  // verification permettant d'empecher les rectangles de sortir de l'ecran et de s'arreter au moment ou ils touchent le bas du canvas
            this.velocity.y = 0
            this.position.y = 330 // permet d'eviter un bug d'animation quand le perso retombe apres un saute 
        } else this.velocity.y += gravity // permet de mettre de la gravite sur nos rectangles et les faires accelerer plus ils tombent


    }

    // on definit une methode d'attaque qui permet au joueur de choisir quand attaquer, on definit la duree d'une attaque avec le setTimeout (ici elle dure 100ms)
    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
        
    }

    takeHit() {
        this.health -= 20

        if (this.health <= 0) {
            this.switchSprite('death')
        } else {
            this.switchSprite('takeHit')
        }

    }

    switchSprite(sprite) {

        // overwrit des autres animations quand on meurt
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true
            return
        }
        // overwrite des autres animations quand on attaque
        if(
            this.image === this.sprites.attack1.image && 
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        ) 
            return
        
        // overwrite des autres animations quand on prend des degats
        if(
            this.image === this.sprites.takeHit.image && 
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        ) 
            return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
            
        }
    }
}

// command + d pour selectionner d'un coup plusieurs elements en surbrillance