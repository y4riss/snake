const canvas = document.querySelector("canvas")
const currentScore = document.querySelector("#current-score")
const highestScore = document.querySelector("#highest-score")
const grid = document.querySelector(".grid")
canvas.width = 600
canvas.height = 600
const w = canvas.width 
const h = canvas.height 


const createDiv = (cls) =>{
    const div = document.createElement("div")
    div.classList.add(cls)
    grid.appendChild(div)
}
const DrawBoard = ()=>{

    for ( let y = 0 ; y < 15 ; y++){
        
        for ( let x = 0 ; x < 15 ; x++){

            if( (x+y) %2 ==0) createDiv("cell1")
            else createDiv("cell2")

        }

    }
}

DrawBoard()

//local storage
let hScore = localStorage.getItem("hScore");
if(hScore){
    highestScore.textContent = "Highest score : "+ hScore
}
else  highestScore.textContent = "Highest score : "+ 0





const ctx = canvas.getContext("2d")
const snakeLength = 40
const eatingSound = new Audio('audio/eat.mp3')
const gameOverSound = new Audio('audio/gameOver.mp3')


const foodImg = new Image()
foodImg.src = 'food.jpg'
let score = 0

currentScore.textContent = "Score : "+score



class Food{
    
    constructor(x,y){
        this.x = x
        this.y = y
    }

    display(){
        
        ctx.drawImage(foodImg,this.x,this.y,snakeLength,snakeLength)
    }
}

class Snake{

    offsetPlacement = snakeLength
    moving = false
    body = []
    direction = null
    constructor(x,y){
        this.head = {x,y}
        this.length = snakeLength
    }
    draw(x,y,w,h,color){

            ctx.fillStyle = color
            ctx.fillRect(x,y,w,h)
    }
    move(){
      // draw the head
                this.draw(this.head.x,this.head.y  ,this.length ,snakeLength,'#c30720')

                this.body.map(e => { // draw the body
                    this.draw(e.x,e.y,this.length,snakeLength,"#2e2e2e")
            })
        
    }

    moveUp(){

        this.offsetPlacement = -Math.abs(this.offsetPlacement)
        this.followTheHead() // shift the snake body part so that each part is the next one , and the first part becomes the head
        this.head.y += this.offsetPlacement // move the head

        this.move() // draw the head and body in updated position
        this.draw(this.head.x+10,this.head.y,this.length/4 ,snakeLength/4,'#2e2e2e')

        
    }
    moveDown(){
        this.offsetPlacement = Math.abs(this.offsetPlacement)
        this.followTheHead()
        this.head.y += this.offsetPlacement
        this.move()
        this.draw(this.head.x+10,this.head.y+30,this.length/4 ,snakeLength/4,'#2e2e2e')

    }
    moveLeft(){

            this.offsetPlacement = -Math.abs(this.offsetPlacement)
            this.followTheHead()
            this.head.x += this.offsetPlacement
            this.move()
            this.draw(this.head.x,this.head.y+10,this.length/4 ,snakeLength/4,'#2e2e2e')

    }
    moveRight(){

        this.offsetPlacement = Math.abs(this.offsetPlacement)
        this.followTheHead()
        this.head.x += this.offsetPlacement
        this.move()
        this.draw(this.head.x+30,this.head.y+10,this.length/4 ,snakeLength/4,'#2e2e2e')


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

    if(e.keyCode === 38){
        snake.direction = 'up'
        snake.moving = true
    }
    else if(e.keyCode=== 40){
        snake.direction = 'down'
        snake.moving = true
    }
    else if(e.keyCode === 37){
        snake.direction = 'left'
    }
    else if(e.keyCode === 39){
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
let food = new Food(x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)])
let id = null

let time = 100



function start(){

    setTimeout(start,time)
    
    DetectCollision()
    UpdateScore()
    ctx.clearRect(0,0,w,h)
    food.display()
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

    if(snake.head.x == food.x && snake.head.y == food.y){
        eatingSound.play()
        snake.getBigger(food.x,food.y)
        score += 10
        if(score % 50 == 0 && score <=300)
            time -= 10

        currentScore.textContent = "Score : "+score
        food = new Food(x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)])
    }
}

const gameOver = ()=>{
    gameOverSound.play()
    if(hScore < score){
        localStorage.setItem('hScore',score)
        hScore = localStorage.getItem("hScore");
        highestScore.textContent = "Highest score : "+ hScore
    }
    score = 0
    time = 100
    snake = new Snake(x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)],x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)])
    food = new Food(x_arr[Math.floor(Math.random()*x_arr.length)],y_arr[Math.floor(Math.random()*y_arr.length)])
    currentScore.textContent = "Score : "+score

}


start()
