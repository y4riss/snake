const canvas = document.querySelector("canvas")
const h3 = document.querySelector("h3")
// grid of 30 by 30

canvas.width = 500
canvas.height = 500
const w = canvas.width 
const h = canvas.height 



const ctx = canvas.getContext("2d")
const snakeLength = 25
const eatingSound = new Audio('eat.mp3')
const gameOverSound = new Audio('gameOver.mp3')
let score = 0

h3.textContent = "Score : "+score

// for ( let y = 0 ; y < h ; y++){

//     for ( let x = 0 ; x < w ; x++){
//         ctx.rect(x*snakeLength,y*snakeLength,snakeLength,snakeLength);
//     }
// }

class Fruit{
    
    constructor(x,y){
        this.x = x
        this.y = y
    }

    display(){
        ctx.fillStyle = "red"
        ctx.fillRect(this.x,this.y,snakeLength,snakeLength)
        ctx.stroke()
    }
}

class Snake{

    speed = snakeLength
    moving = false
    body = []
    direction = null
    constructor(x,y){
        this.head = {x,y}
        this.length = snakeLength
    }
    draw(x,y,w,h,color){

            
            ctx.fillStyle = "black"
            ctx.fillRect(x-1,y-1,w+2,h+2)
            ctx.fillStyle = color
            ctx.fillRect(x,y,w,h)
    }
    move(){
      
                this.draw(this.head.x,this.head.y  ,this.length ,snakeLength,"#9f9fff") // draw the head
                this.body.map(e => { // draw the body
                this.draw(e.x,e.y,this.length,snakeLength,"#ffff6e")
            })
        
    }

    moveUp(){

        this.speed = -Math.abs(this.speed)
        this.followTheHead() // shift the snake body part so that each part is the next one , and the first part becomes the head
        this.head.y += this.speed // move the head

        this.move() // draw the head and body in updated position

        
    }
    moveDown(){
        this.speed = Math.abs(this.speed)
        this.followTheHead()
        this.head.y += this.speed
        this.move()

    }
    moveLeft(){

            this.speed = -Math.abs(this.speed)
            this.followTheHead()
            this.head.x += this.speed
            this.move()

    }
    moveRight(){

        this.speed = Math.abs(this.speed)
        this.followTheHead()
        this.head.x += this.speed
        this.move()

    }
    getBigger(x,y){
        this.body.push({x,y})
    }

    followTheHead(){
        if(this.body.length){
            for ( let k = this.body.length - 1 ; k > 0 ; k-- ){
                this.body[k].x = this.body[k-1].x
                this.body[k].y = this.body[k-1].y
            }
            this.body[0].x = this.head.x
            this.body[0].y = this.head.y
        }




    }
}

document.body.addEventListener("keydown",(e)=>{

    if(e.code === 'ArrowUp'){
        snake.direction = 'up'
        snake.moving = true
    }
    else if(e.code === 'ArrowDown'){
        snake.direction = 'down'
        snake.moving = true
    }
    else if(e.code === 'ArrowLeft'){
        snake.direction = 'left'
    }
    else if(e.code === 'ArrowRight'){
        snake.direction = 'right'
        snake.moving = true
    }

})

let x_arr = []
for(let i = snakeLength; i < w ; i += snakeLength){
    x_arr.push(i) 
}

let y_arr = []
for(let i = snakeLength ; i < h ; i+=snakeLength){
    y_arr.push(i) 
}


let snake = new Snake(x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)],x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)])



let fruit = new Fruit(x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)])
let id = null

let time = 100



function start(){

    setTimeout(start,time)
    DetectCollision()
    UpdateScore()
    ctx.clearRect(0,0,w,h)
    fruit.display()

    if(snake.direction == 'up') {
        if(!snake.body.length) snake.moveUp()
        else{
            if(snake.body[0].y < snake.head.y ){
                if(snake.moving) snake.moveDown()
                else snake.move()
            }
            else  snake.moveUp()
        }
      
    }
    else if (snake.direction == 'down') {
        if(!snake.body.length) snake.moveDown()
        else{
            if(snake.body[0].y > snake.head.y ){
                if(snake.moving) snake.moveUp()
                else snake.move()
            }
            else  snake.moveDown()
        }

    }

    else if (snake.direction == 'left' ){
        if(!snake.body.length) snake.moveLeft()

        else{
            if(snake.body[0].x < snake.head.x ){
                if(snake.moving) snake.moveRight()
                else snake.move()
            }
            else  snake.moveLeft()
        }


    }

    else if (snake.direction == 'right') {
        if(!snake.body.length) snake.moveRight()

        else{
            if(snake.body[0].x > snake.head.x ){
                if(snake.moving) snake.moveLeft()
                else snake.move()
            }
            else  snake.moveRight()
        }

    
    }
    else snake.move()


}

const DetectCollision = ()=>{
    if(snake.head.x   <0 || snake.head.x + snakeLength > w  || snake.head.y < 0 || snake.head.y + snakeLength > h){
        gameOver()
    }
    snake.body.map(b =>{
        if(b.x == snake.head.x && b.y== snake.head.y) gameOver()
    })
}

const UpdateScore = ()=>{

    if(snake.head.x == fruit.x && snake.head.y == fruit.y){
        eatingSound.play()
        snake.getBigger(fruit.x,fruit.y)
        score += 10
        if(score >= 200) time = 20
        else if(score >= 150) time = 40
        else if (score >= 100) time = 60
        else if ( score >= 50) time = 80

        h3.textContent = "Score : "+score
        fruit = new Fruit(x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)])
    }
}
const gameOver = ()=>{
    gameOverSound.play()
    score = 0
    time = 100
    snake = new Snake(x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)],x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)])
    fruit = new Fruit(x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)])
    h3.textContent = "Score : "+score

}
start()