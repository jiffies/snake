// Generated by CoffeeScript 1.6.1
(function() {
  var DHTMLDraw, Food, GH, GW, Game, GameOver, Grid, HEIGHT, KEY, Snake, WIDTH, clone, fTimer, init, isBound, point, sTimer;

  GameOver = false;

  WIDTH = 510;

  HEIGHT = 510;

  GW = 10;

  GH = 10;

  KEY = {
    "up": 38,
    "down": 40,
    "right": 39,
    "left": 37
  };

  point = 0;

  sTimer = fTimer = null;

  isBound = function(x, y) {
    if ((x >= WIDTH || x < 0) || (y >= HEIGHT || y < 0)) {
      return false;
    }
    return true;
  };

  clone = function(old) {
    var key, o, value;
    o = new Object();
    for (key in old) {
      value = old[key];
      if (old.hasOwnProperty(key)) {
        o["" + key] = value;
      }
    }
    return o;
  };

  DHTMLDraw = {
    drawRect: function(params) {
      var elem, elemStyle;
      elem = params.$drawTarget.append("<div/>").find(":last");
      elem.css({
        position: 'absolute',
        width: params.w,
        height: params.h,
        left: params.x,
        top: params.y,
        backgroundColor: params.color
      });
      elemStyle = elem[0].style;
      return {
        element: elem,
        elemStyle: elemStyle
      };
    }
  };

  Grid = (function() {

    function Grid(params) {
      this.div = DHTMLDraw.drawRect(params);
    }

    Grid.prototype.changeColor = function(color) {
      return this.div.elemStyle.backgroundColor = color;
    };

    return Grid;

  })();

  Snake = function() {
    var canMove, destroy, nextPos, sBody, sDir, sHead, sParams, sTail;
    sBody = [];
    sDir = null;
    sHead = null;
    sTail = null;
    sParams = null;
    nextPos = function() {
      switch (sDir) {
        case KEY.up:
          return {
            x: sHead.x,
            y: sHead.y - GH
          };
        case KEY.down:
          return {
            x: sHead.x,
            y: sHead.y + GH
          };
        case KEY.left:
          return {
            x: sHead.x - GW,
            y: sHead.y
          };
        case KEY.right:
          return {
            x: sHead.x + GW,
            y: sHead.y
          };
      }
    };
    canMove = function(food, x, y) {
      return food.cansetFood(x, y);
    };
    destroy = function(node) {
      return node.element.remove();
    };
    return {
      reset: function() {
        var snake, _i, _len;
        for (_i = 0, _len = sBody.length; _i < _len; _i++) {
          snake = sBody[_i];
          snake.element.remove();
        }
        return sBody = [];
      },
      initSnake: function(params) {
        var i, snode, _i, _ref;
        sParams = params;
        for (i = _i = 0; _i <= 1; i = ++_i) {
          params.x += params.w * i;
          snode = DHTMLDraw.drawRect(params);
          _ref = [params.x, params.y], snode.x = _ref[0], snode.y = _ref[1];
          snode.snake = true;
          sBody.push(snode);
        }
        sDir = KEY.left;
        return sHead = sBody[0], sTail = sBody[1], sBody;
      },
      setDir: function(dir) {
        if (!(sDir - dir === 2 || sDir - dir === -2 || dir === 18 || dir === 9)) {
          return sDir = dir;
        }
      },
      isSnake: function(x, y) {
        var snode, _i, _len;
        for (_i = 0, _len = sBody.length; _i < _len; _i++) {
          snode = sBody[_i];
          if (snode.x === x && snode.y === y) {
            return true;
          }
        }
        return false;
      },
      move: function(food) {
        var apple, next, node, tail, _ref, _ref1;
        next = nextPos();
        if (canMove(food, next.x, next.y)) {
          /*
          				sTail.elemStyle.left = "#{next.x}px"
          				sTail.elemStyle.top = "#{next.y}px"
          				[sTail.x,sTail.y] = [next.x,next.y]
          				sBody.unshift sBody.pop()
          				sHead = sBody[0]
          				sTail = sBody[sBody.length-1]
          */

          _ref = [next.x, next.y], sParams.x = _ref[0], sParams.y = _ref[1];
          node = DHTMLDraw.drawRect(sParams);
          _ref1 = [next.x, next.y], node.x = _ref1[0], node.y = _ref1[1];
          node.snake = true;
          sBody.unshift(node);
          sHead = node;
          tail = sBody.pop();
          return destroy(tail);
        } else if (food.issetFood(next.x, next.y)) {
          apple = food.popFood(next.x, next.y);
          apple.elemStyle.backgroundColor = "red";
          apple.snake = true;
          sBody.unshift(apple);
          sHead = apple;
          point += 10;
          return $("p").text("" + point);
        } else {
          return GameOver = true;
        }
      }
    };
  };

  Food = function(snake) {
    var canFood, foods, isFood;
    foods = [];
    isFood = function(x, y) {
      var food, _i, _len;
      for (_i = 0, _len = foods.length; _i < _len; _i++) {
        food = foods[_i];
        if (food.x === x && food.y === y) {
          return true;
        }
      }
      return false;
    };
    canFood = function(x, y) {
      if (isFood(x, y) || snake.isSnake(x, y) || !isBound(x, y)) {
        return false;
      }
      return true;
    };
    return {
      reset: function() {
        var food, _i, _len;
        for (_i = 0, _len = foods.length; _i < _len; _i++) {
          food = foods[_i];
          food.element.remove();
        }
        return foods = [];
      },
      cansetFood: function(x, y) {
        if (isFood(x, y) || snake.isSnake(x, y) || !isBound(x, y)) {
          return false;
        }
        return true;
      },
      issetFood: function(x, y) {
        var food, _i, _len;
        for (_i = 0, _len = foods.length; _i < _len; _i++) {
          food = foods[_i];
          if (food.x === x && food.y === y) {
            return true;
          }
        }
        return false;
      },
      popFood: function(x, y) {
        var apple, food, result, _i, _len;
        result = [];
        apple = null;
        for (_i = 0, _len = foods.length; _i < _len; _i++) {
          food = foods[_i];
          if (food.x !== x || food.y !== y) {
            result.push(food);
          } else {
            apple = food;
          }
        }
        foods = result;
        return apple;
      },
      genFood: function(params) {
        var food, x, y, _ref, _ref1;
        x = (Math.floor(Math.random() * 51)) * 10;
        y = (Math.floor(Math.random() * 51)) * 10;
        while (!canFood(x, y)) {
          x = (Math.floor(Math.random() * 51)) * 10;
          y = (Math.floor(Math.random() * 51)) * 10;
        }
        _ref = [x, y], params.x = _ref[0], params.y = _ref[1];
        food = DHTMLDraw.drawRect(params);
        _ref1 = [x, y], food.x = _ref1[0], food.y = _ref1[1];
        return foods.push(food);
      }
    };
  };

  Game = function(snake, food, params) {
    return {
      initGame: function($drawTarget) {
        var paramsFood;
        $(document).keydown(function(e) {
          return snake.setDir(e.which);
        });
        sTimer = setInterval(function() {
          if (GameOver) {
            clearInterval(sTimer);
            clearInterval(fTimer);
            if (confirm("GameOver! Do you want to play again?")) {
              snake.reset();
              food.reset();
              init();
              return;
            }
          }
          return snake.move(food);
        }, 100);
        paramsFood = clone(params);
        paramsFood.color = "green";
        return fTimer = setInterval(function() {
          return food.genFood(paramsFood);
        }, 3000);
      }
    };
  };

  init = function() {
    var food, game, p, snake;
    GameOver = false;
    point = 0;
    $("p").text("" + point);
    p = {
      $drawTarget: $("#draw-target"),
      w: GW,
      h: GH,
      x: 250,
      y: 250,
      color: "red"
    };
    snake = Snake();
    snake.reset();
    snake.initSnake(p);
    food = Food(snake);
    food.reset();
    game = Game(snake, food, p);
    return game.initGame($("#draw-target"));
  };

  /*
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
  */


  $(document).ready(function() {
    $("#start").click(function() {
      init();
      return this.style.display = "none";
    });
    return $("#again").click(function() {
      var div, divs, _i, _len;
      if (GameOver) {
        divs = $("#draw-target").children();
        for (_i = 0, _len = divs.length; _i < _len; _i++) {
          div = divs[_i];
          $(div).remove();
        }
        return init();
      }
    });
    /*
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
    */

  });

}).call(this);
