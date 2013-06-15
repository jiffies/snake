GameOver = false
WIDTH = 510
HEIGHT = 510
GW = 10
GH = 10
KEY = 
	"up":38
	"down":40
	"right":39
	"left":37
point = 0
sTimer = fTimer = null

isBound = (x,y)->
	return false if (x>=WIDTH or x<0) or (y>=HEIGHT or y<0)
	true
clone = (old)->
	o = new Object()
	for key,value of old when old.hasOwnProperty(key)
		o["#{key}"] = value
	return o

DHTMLDraw = 
	drawRect: (params)-> #$drawTarget,x,y,w,h,color
		elem = params.$drawTarget.append("<div/>").find(":last")
		elem.css 
			position: 'absolute'
			width: params.w
			height: params.h
			left: params.x
			top: params.y
			backgroundColor: params.color
		elemStyle = elem[0].style
		return {element:elem, elemStyle:elemStyle}

class Grid
	constructor:(params)->
		@div = DHTMLDraw.drawRect params

	changeColor: (color)->
		@div.elemStyle.backgroundColor = color 

Snake = ->
	sBody = []
	sDir = null
	sHead = null
	sTail = null
	sParams = null
	nextPos = ->
			switch sDir
				when KEY.up then {x:sHead.x,y:sHead.y-GH}
				when KEY.down then {x:sHead.x,y:sHead.y+GH}
				when KEY.left then {x:sHead.x-GW,y:sHead.y}
				when KEY.right then {x:sHead.x+GW,y:sHead.y}

	canMove = (food,x,y)->
		food.cansetFood x,y
			
	destroy = (node)->
			node.element.remove()
	return {
		reset: ->
			snake.element.remove() for snake in sBody
			sBody = []

		initSnake: (params)->
			sParams = params
			for i in [0..1]
				params.x += params.w * i
				snode = DHTMLDraw.drawRect params
				[snode.x,snode.y] = [params.x,params.y]
				snode.snake = true
				sBody.push snode
			sDir = KEY.left
			[sHead,sTail] = sBody
		
			
		setDir: (dir)->
			sDir = dir unless sDir - dir is 2 or sDir-dir is -2 or dir is 18 or dir is 9
		isSnake: (x,y)->
			return true for snode in sBody when snode.x is x and snode.y is y
			false
			
		move : (food)->
			next = nextPos()
			if canMove(food,next.x,next.y)
				###
				sTail.elemStyle.left = "#{next.x}px"
				sTail.elemStyle.top = "#{next.y}px"
				[sTail.x,sTail.y] = [next.x,next.y]
				sBody.unshift sBody.pop()
				sHead = sBody[0]
				sTail = sBody[sBody.length-1]
				###
				[sParams.x,sParams.y] = [next.x,next.y]
				node = DHTMLDraw.drawRect sParams
				[node.x,node.y] = [next.x,next.y]
				node.snake = true
				sBody.unshift node
				sHead = node
				tail = sBody.pop()
				destroy tail
			else if food.issetFood(next.x,next.y)
				apple = food.popFood next.x,next.y
				apple.elemStyle.backgroundColor = "red"
				apple.snake = true
				sBody.unshift apple
				sHead = apple
				point += 10
				$("p").text "#{point}"
				
				#tail = sBody.pop()
				#destroy tail

			else
				GameOver = true
				# ...
			
				

	}
Food = (snake)->
	foods = []
	isFood = (x,y)->
		return true for food in foods when food.x is x and food.y is y
		false
	canFood = (x,y)->
		    return false if isFood(x,y) or snake.isSnake(x,y) or !isBound(x,y)
		    true

	return {
		reset: ->
			food.element.remove() for food in foods
			foods = []

		cansetFood: (x,y)->
		    return false if isFood(x,y) or snake.isSnake(x,y) or !isBound(x,y)
		    true
		issetFood: (x,y)->
			return true for food in foods when food.x is x and food.y is y
			false
		popFood: (x,y)->
			result = []
			apple = null		
			for food in foods
				 if food.x isnt x or food.y isnt y
				 	result.push food 
				 else
				 	apple = food
			foods = result
			return apple
		genFood: (params)->
			x = (Math.floor Math.random()*51)*10
			y = (Math.floor Math.random()*51)*10
			while !canFood(x,y)
				x = (Math.floor Math.random()*51)*10
				y = (Math.floor Math.random()*51)*10
			[params.x,params.y] = [x,y]
			food = DHTMLDraw.drawRect params
			[food.x,food.y] = [x,y]
			foods.push food


	}

Game = (snake,food,params)->
		return {
			initGame: ($drawTarget)->
				$(document).keydown (e)->
					#console.log e.which
					snake.setDir e.which	
				sTimer = setInterval ->
					if GameOver
						clearInterval sTimer
						clearInterval fTimer
						if confirm "GameOver! Do you want to play again?"
							snake.reset()
							food.reset()
							
							init()
							return
						else
							return
						

					snake.move(food)
					
				,100	
				paramsFood = clone params
				paramsFood.color = "green"
				fTimer = setInterval ->
					food.genFood paramsFood
				,3000
		}

init = ->

	GameOver = false
	point = 0
	$("p").text "#{point}"
	p = 
		$drawTarget : $("#draw-target")
		w:GW
		h:GH
		x: 250
		y: 250
		color: "red"
	snake = Snake()
	snake.reset()
							
	snake.initSnake p
	food = Food(snake)
	food.reset()
	game = Game(snake,food,p)
	game.initGame $("#draw-target")
###
gridManager = ->
	grids = []
	w = WIDTH
	h = HEIGHT
	return { 
		init : (params)->
			for i in [0...h]
				params.y = GH*i
				for j in [0...w]
					params.x = GW*j
					grid = new Grid(params)
					grids.push grid
				}
###

$(document).ready ->
	$("#start").click ->
		
		init()
		@.style.display = "none"
	$("#again").click ->
		
		if GameOver
			divs = $("#draw-target").children()
			$(div).remove() for div in divs
			init()
	
	###
	p = 
		$drawTarget : $("#draw-target")
		w:GW
		h:GH
		x: 250
		y: 250
		color: "red"
	snake = Snake()
	snake.initSnake p
	food = Food(snake)

	game = Game(snake,food,p)
	game.initGame $("#draw-target")
	###
