import platform from '/Users/xinxin/Desktop/web_game/img/platform.png'
import hills from '/Users/xinxin/Desktop/web_game/img/hills.png'
import background from '/Users/xinxin/Desktop/web_game/img/background.png'
import platformSmallTall from '/Users/xinxin/Desktop/web_game/img/platformSmallTall.png'

import spriteRunLeft from '/Users/xinxin/Desktop/web_game/img/spriteRunLeft.png'
import spriteRunRight from '/Users/xinxin/Desktop/web_game/img/spriteRunRight.png'
import spriteStandLeft from '/Users/xinxin/Desktop/web_game/img/spriteStandLeft.png'
import spriteStandRight from '/Users/xinxin/Desktop/web_game/img/spriteStandRight.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 576

const gravity = 0.3 //adding some accelarations 

class Player {
    constructor(){
        this.position = {
            x: 100,
            y: 100
        }

        this.velocity = {
            x: 0,
            y: 0     // y position to drag the player down, set constant velocity y = 1
            //since added gravity/accelarations later, can set this back to 0. 
        }


        this.width = 33
        this.height = 75
        this.image = creatImage(spriteStandRight)
        this.frame = 0 //to iterate all the pictures in one picture for player animate
        this.sprite = {
          stand:{
            right:creatImage(spriteStandRight),
            left:creatImage(spriteStandLeft),
            cropWidth:177,
            width: 33
          },
          run:{
            right: creatImage(spriteRunRight),
            left: creatImage(spriteRunLeft),
            cropWidth:341,
            width:63.94
          }
        }

        this.currentSprite = this.sprite.stand.right
        this.currentCropwidth = 177
    }

    draw(){
        /*
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        */
        c.drawImage(
          this.currentSprite, 
          this.currentCropwidth*this.frame,
          0,
          this.currentCropwidth,
          400,
          this.position.x, 
          this.position.y, 
          this.width, 
          this.height
          )
    }
    update(){
        this.frame ++
        if (this.frame>59 && (this.currentSprite === this.sprite.stand.right || this.currentSprite === this.sprite.stand.left)) {
          this.frame = 0
        }
        else if (this.frame>29 && (this.currentSprite === this.sprite.run.right || this.currentSprite === this.sprite.run.left)){
          this.frame = 0
        }

        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if(this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        //else this.velocity.y = 0  once the player off the platform, should keep falling
    }
}

class Platform{
    constructor({x,y, image}){
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = 560
        this.height = image.height
        
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject{
  constructor({x,y, image}){
    this.position = {
      x,
      y
    }
    this.image = image
    this.width = image.width
    this.height = image.height

  }
  draw(){
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

//pass through different img
function creatImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}

let platformImage = creatImage(platform)
let platformSmallTallImage = creatImage(platformSmallTall)

let player = new Player()
let platforms = []
let genericObject = []
//const platform = new Platform()
/*
let platforms = [
    new Platform({
        x:-1,
        y:470,
        image: platformImage
        
    }),
    new Platform({ x: 570, y:470, image: platformImage}),
    new Platform({ x: 570 * 2 + 100, y:470, image: platformImage}),
    new Platform({ x: 570 * 3 + 100, y:470, image: platformImage})
  ]

let genericObject = [

  new GenericObject ({
    x:0,
    y:0,
    image: creatImage(background)
    }),

  new GenericObject ({
    x:0,
    y:0,
    image: creatImage(hills)
    })
]
*/

const keys = {
  right:{
    pressed:false
  },
  left:{
    pressed:false
  }
}
//decide how far does the game scroll the screen
let scrollOffset = 0 //start


//creat a init function to reset everything after lose the game
function init(){
  platformImage = creatImage(platform)
  platformSmallTallImage = creatImage(platformSmallTall)

  player = new Player()
  //const platform = new Platform()
  platforms = [
      new Platform({ x: 570*4+300-2+570-280, y:270, image:platformSmallTallImage}),
      new Platform({x:-1,y:470,image: platformImage}),
      new Platform({ x: 570, y:470, image: platformImage}),
      new Platform({ x: 570 * 2 + 100, y:470, image: platformImage}),
      new Platform({ x: 570 * 3 + 300, y:470, image: platformImage}),
      new Platform({ x: 570 * 4 +300 - 2, y:470, image: platformImage}),
      new Platform({ x: 570 * 5 +600 - 2, y:470, image: platformImage})
    ]

  genericObject = [

    new GenericObject ({
      x:0,
      y:0,
      image: creatImage(background)
      }),

    new GenericObject ({
      x:0,
      y:0,
      image: creatImage(hills)
      })
  ]
  //decide how far does the game scroll the screen
  scrollOffset = 0 //start
}

init()
function animate(){
    requestAnimationFrame(animate)  //changing players properties over time
    c.fillStyle = 'white'
    c.fillRect(0,0,canvas.width,canvas.height)

    genericObject.forEach(genericObject => {
      genericObject.draw()
    })
    
    platforms.forEach(platform => {
        platform.draw()
    })

    player.update()
    //platform.draw()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5
    } 
    else if ((keys.left.pressed && player.position.x>100)||keys.left.pressed && scrollOffset === 0 && player.position.x>0) {
        player.velocity.x = -5
    } 
    else {
        player.velocity.x = 0
        
        //moving backgrounds instead of moving player out of screen
        if (keys.right.pressed){
            scrollOffset+=5
            platforms.forEach(platform => {
                platform.draw()
                platform.position.x -=5
            })
            genericObject.forEach(genericObject =>{
              genericObject.position.x -= 3
            })
        }else if (keys.left.pressed && scrollOffset>0){
            scrollOffset-=5
            platforms.forEach(platform => {
                platform.draw()
                platform.position.x+=5
            })
            genericObject.forEach(genericObject =>{
              genericObject.position.x += 3
            })
        }
    }

    // player should fall in platform and touch the platform
    // 1. when bottom of the player is less than the top of platform
    // 2. to make sure the veelocity is 0 when it touches platform
    // 3. to make player fall back when it is not on platform (x_axis)
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width>= platform.position.x && player.position.x <= platform.position.x+ platform.width){
                player.velocity.y = 0 
            }
        })
    
    //win condition
    if (scrollOffset > 2000){
        console.log('You Win')
    }

    //lose condition
    if (player.position.y > canvas.height){
      console.log('You Lose')
      init()
    }

}
player.update()
animate()

window.addEventListener('keydown',({keyCode}) => {
    console.log(keyCode)
    switch(keyCode){
        case 65: 
            console.log('left')
            keys.left.pressed = true
            player.currentSprite = player.sprite.run.left
            player.currentCropwidth = player.sprite.run.cropWidth
            player.width = player.sprite.run.width
            break

        case 68: 
            console.log('right')
            keys.right.pressed = true
            player.currentSprite = player.sprite.run.right
            player.currentCropwidth = player.sprite.run.cropWidth
            player.width = player.sprite.run.width
            break

        case 87: 
            console.log('up')
            player.velocity.y -= 10
            break 

        case 83: 
            console.log('down')
            break
    }
    console.log(keys.right.pressed)
})

window.addEventListener('keyup',({keyCode}) => {
    console.log(keyCode)
    switch(keyCode){
        case 65: 
            console.log('left')
            keys.left.pressed = false
            player.currentSprite = player.sprite.stand.left
            player.currentCropwidth = player.sprite.stand.cropWidth
            player.width = player.sprite.stand.width
            break

        case 68: 
            console.log('right')
            keys.right.pressed = false
            player.currentSprite = player.sprite.stand.right
            player.currentCropwidth = player.sprite.stand.cropWidth
            player.width = player.sprite.stand.width
            break

        case 87: 
            console.log('up')
            player.velocity.y -= 1
            break 

        case 83: 
            console.log('down')
            break
    }
    console.log(keys.right.pressed)
})
