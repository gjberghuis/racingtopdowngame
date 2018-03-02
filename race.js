var gameArea = (function() {

	var interval;

	var initInterval = function() {
		interval = setInterval(updateGameArea, 20);
	}

	var updateGameArea = function() {
		canvas.update();
		obstacles.update();
		car.update();
	}

	return {
		init: function() {		
			canvas.init();
			initInterval();
		}
	};
}());

var canvas = (function() {
	var context;
	var canvasObject;

	var init = function() {
		canvasObject = $('canvas#game')[0];
		canvasObject.width = 400;
		canvasObject.height = 400;
		context = canvasObject.getContext("2d");
		drawRect();
	}

	var drawRect = function () {
		context.fillStyle = 'grey';
		context.fillRect(0,0,canvasObject.width, canvasObject.height);
	}

	var update = function() {
		context.clearRect(0, 0, canvasObject.width, canvasObject.height);
		drawRect();
	}

	function getContext() {
		return context;
	}

	function getCanvasObject() {
		return canvasObject;
	}

	return {
		init: function() {
			init();
		},
		update: function() {
			update();
		},
		canvasObject : getCanvasObject,
		getContext : getContext
	}
})();

var car = (function() {	
	var width = 74;
	var height = 56;
	var x = 200;
	var y = 100;
	var angle = 0; 
	var	mod = 0;
	var speed = 5;

	var initCar = function() {
		carImage = new Image();
		carImage.src = "http://i.imgur.com/uwApbV7.png";
	};

	var updateDirection = function() {
		/*
		* 37 = left
		* 38 = up
		* 39 = right
		* 40 = down
		*/

		// Left
		if (gameArea.keys && gameArea.keys[37]) { 
			// and backward
			if(gameArea.keys && gameArea.keys[40]) {
				angle += 2;
			} else {
				angle -= 2;
			}
		}

		// Right
		if (gameArea.keys && gameArea.keys[39]) {
			// and backward
			if(gameArea.keys && gameArea.keys[40]) {
				angle -= 2;
			} else {
				angle += 2;
			}
		}
	};	

	var updateSpeed = (function() {
		// Forwards
		if (gameArea.keys && gameArea.keys[38]) {
			mod = -1;
		}

		// Backwards
		if (gameArea.keys && gameArea.keys[40]) {
			mod = 1;
		}
	});
	
    var updatePosition = (function() {
		// right wall
		if (x + width / 2 > canvas.canvasObject().width - 1) {
			x = canvas.canvasObject().width - (width / 2 - 1);		
		}
		// bottom wall
		if (y + height / 2 > canvas.canvasObject().height - 1) {
			y = canvas.canvasObject().height - (height / 2 - 1);
		}
		// left wall
		if (x - width / 2 < 1) {
			x = width / 2 + 1;
		}
		// top wall
		if (y - height / 2 < 1) {
			y = height / 2 + 1;
		}

        x += (speed * mod) * Math.cos(Math.PI / 180 * angle);
        y += (speed * mod) * Math.sin(Math.PI / 180 * angle);
	});
	
	var update = (function() {
		console.log(x);
        ctx = canvas.getContext();
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((Math.PI / 180) * angle);
		ctx.drawImage(carImage, -(carImage.width / 2), -(carImage.height / 2));
		ctx.restore();
	});

	return {
		init: function() {
			initCar();
		},
		update: function() {
			updateDirection();
			updateSpeed();
			updatePosition();
			update();
		},
		setMod: function(newMod) {
			mod = newMod;
		}
	}
})();

var obstacles = (function() {
	var obstacles = [];
	var baseWidth = 50;
	var baseHeight = 50;
	var numberOfObstacles = 5

	var init = (function() {
		for (var i = 0; i < numberOfObstacles; i++) {
			renderBlock();
		}

		drawBlocks();
	});

	var renderBlock = (function() {
		var obstacle = [];
		obstacle['obstacleHeight'] = Math.random() * baseHeight;
		obstacle['obstacleWidth'] = Math.random() * baseWidth;
		obstacle['obstacleX'] = Math.random() * canvas.canvasObject().width;
		obstacle['obstacleY'] = Math.random() * canvas.canvasObject().height;
		obstacle['color'] = helpers.getRandomColor();
		
		obstacles.push(obstacle);
	});

	var drawBlocks = (function() {
		obstacles.forEach(function(obstacle) {
			ctx = canvas.getContext();
			ctx.save();
			ctx.fillStyle = obstacle['color'];
			ctx.fillRect(obstacle['obstacleX'], obstacle['obstacleY'], obstacle['obstacleWidth'], obstacle['obstacleHeight']); 
			ctx.restore();
		});
	});

	var checkCollision = (function(){

	});


	return {
		init: function() {
			init();
		},
		update: function() {
			drawBlocks();		
		}
	}
})();

var controls = (function(){
	var bindEvents = function() {
		window.addEventListener('keydown', function(event) {
			gameArea.keys = (gameArea.keys || []);
            gameArea.keys[event.keyCode] = true;
		});

		window.addEventListener('keyup', function(event) {

			car.setMod(0);
			gameArea.keys[event.keyCode] = false;
		});
	}

	return {
		init: function() {
			bindEvents();
		}
	}
})();

var helpers = (function() {
	getRandomColor = (function() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
		  color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	});

	return {
		getRandomColor: function() {
			return getRandomColor();
		}
	}
})();

$(function() {
	gameArea.init();
	car.init();
	controls.init();
	obstacles.init();
});