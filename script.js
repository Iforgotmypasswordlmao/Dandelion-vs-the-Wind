let Turns = 7
let CurrentDandelions = []
let Board = []
const size = 6
let GameWon = false

let Directions = [
    [-1, 1],
    [0, 1],
    [1, 1],
    [-1, 0],
    [1, 0],
    [-1, -1],
    [0, -1],
    [1, -1]
]
Directions.sort(() => Math.random() - 0.5)

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const border = document.getElementById("border")
const btx = border.getContext("2d")

const direction = document.getElementById("direction")
const dtx = direction.getContext("2d")

const highlight = document.getElementById("highlight")
const htx = highlight.getContext("2d")

const counter = document.getElementById("counter")
const ttx = counter.getContext("2d")

const length = canvas.height
const squareLength = length/size

function reset()
{
    Turns = 7
    CurrentDandelions = []
    Board = []
    GameWon = false
    Directions = [
        [-1, 1],
        [0, 1],
        [1, 1],
        [-1, 0],
        [1, 0],
        [-1, -1],
        [0, -1],
        [1, -1]
    ]
    Directions.sort(() => Math.random() - 0.5)

    let row = []
    for (let i = 0; i < size; i++)
    {
        row.push(0)
    }

    for (let j = 0; j < size; j++)
    {
        Board.push([...row])
    }
}

function spread(dandelion, direction)
{
    for (let i = 0; i < size; i++)
    {
        const x = dandelion[0] - i*direction[1]
        const y = dandelion[1] + i*direction[0]
        if (x >= size || x < 0)
        {
            continue
        }

        if (y >= size || y < 0)
        {
            continue
        }

        if (Board[x][y] != 0)
        {
            continue
        }

        Board[x][y] = 1

    }
}

function place(x, y)
{
    if (Board[x][y] != 0 || Turns <= 0 || GameWon)
    {
        return false
    }

    Board[x][y] = 2 
    CurrentDandelions.push([x, y])
    Turns -= 1
    return true
}

function drawBorder()
{
    for (let i = 0; i <= size; i++)
    {
        btx.moveTo(i*squareLength, 0)
        btx.lineTo(i*squareLength, length)

        btx.moveTo(0, i*squareLength)
        btx.lineTo(length, i*squareLength)
    }

    btx.stroke()
}

function drawBoard()
{
    
    for (let i = 0; i < size; i++)
    {
        for (let j = 0; j < size; j++)
        {
            const image_to_draw = new Image(squareLength, squareLength)
            switch(Board[i][j])
            {
                case 0:
                    continue
                case 1:
                    image_to_draw.src = "Assets/Seed.png"
                    break
                case 2:
                    image_to_draw.src = "Assets/Dandelion.png"
                    break
            }
            image_to_draw.onload = () => { ctx.drawImage(image_to_draw, j*squareLength, i*squareLength) }
            
        }
    }
}

function checkGameWon()
{
    let AnyEmptySquares = false
    for (let i = 0; i < size; i++)
    {
        for (let j  = 0; j < size; j++)
        {
            if (Board[i][j] == 0)
            {
                AnyEmptySquares = true
            }
        }
    }

    return (Turns <= 0) && !AnyEmptySquares
}

function drawDirection()
{
    let sqLen = direction.height/3

    htx.clearRect(0, 0, sqLen*3, sqLen*3)
    dtx.clearRect(0, 0, sqLen*3, sqLen*3)

    htx.fillStyle = "#aaaaaa"
    htx.fillRect(0, 0, sqLen*3, sqLen*3)
    
    for (let i = 0; i <= 3; i++)
    {
        dtx.moveTo(i*sqLen, 0)
        dtx.lineTo(i*sqLen, sqLen*3)

        dtx.moveTo(0, i*sqLen)
        dtx.lineTo(sqLen*3, i*sqLen)
    }
    dtx.stroke()
    dtx.font = `${sqLen/2}px serif`

    const Names = ["NW", "N", "NE", "W", "O", "E", "SW", "S", "SE"]
    for (let j = 0; j < 3; j++)
    {
        for (let l = 0; l < 3; l++)
        {
            const index = j*3 + l
            if (index == 4)
            {
                continue
            }
            dtx.fillText(Names[index], l*sqLen + sqLen/10, j*sqLen + sqLen/1.5)
        }
    }

    htx.fillStyle = "#FFFFFF"
    htx.fillRect(sqLen, sqLen, sqLen, sqLen)
    for (let m = 0; m < Directions.length; m++)
    {
        const x = 1 + Directions[m][0]
        const y = 1 - Directions[m][1]
        htx.fillRect(x*sqLen, y*sqLen, sqLen, sqLen)
    }

}

function drawTurn()
{
    ttx.font = "20px serif"
    ttx.clearRect(0, 0, 200, 100)
    ttx.fillText(`Turns Remaining: ${Turns}`, 0, 50)
}



function main()
{
    reset()
    drawBorder()
    drawDirection()
    drawTurn()
    border.addEventListener('click', (e) => {
        const canvasX = e.offsetX
        const canvasY = e.offsetY
        const gameX = Math.floor(canvasY/squareLength)
        const gameY = Math.floor(canvasX/squareLength)

        validTurn = place(gameX, gameY)
        if (!validTurn)
        {
            return
        }
        Wind = Directions.pop()
        for (let dande in CurrentDandelions)
        {
            curdande = CurrentDandelions[dande]
            spread(curdande, Wind)
        }
        GameWon = checkGameWon()
        drawDirection()
        drawBoard()
        drawTurn()
    })
}

main()