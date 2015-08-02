(function (width, height, blocksize) {
    'use strict';
    var c          = document.getElementById('canvas'),
        canvas     = c.getContext('2d'),
        directions = [
        {x :   0 , y : - 1}, // up
        {x :   1 , y :   0}, // right
        {x :   0 , y :   1}, // down
        {x : - 1 , y :   0}  // left
    ];

    var Labyrinth = function (width, height, blocksize) {
        this.width     = width;
        this.height    = height;
        this.blocksize = blocksize;
        this.map       = [];
        this.rooms     = [];
        this.deadends  = [];

        this.init();
    };
    Labyrinth.prototype.init = function () {
        for (var i = 0; i < this.height; i++) {
            this.map[i] = [];
            for (var j = 0; j < this.width; j++) {
                this.map[i][j] = 0;
            }
        }
    };
    Labyrinth.prototype.write = function () {
        var string = '';
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                string += ' ' + this.map[x][y];
            }
            console.log(string);
            string = '';
        }
    };
    Labyrinth.prototype.generateRooms = function (roomAttempts, pRoomWidthMax, pRoomWidthMin, pRoomHeightMax, pRoomHeightMin) {
		var room 		  = {},
			that		  = this,
			roomWidthMax  = pRoomWidthMax  || 10,
			roomWidthMin  = pRoomWidthMin  || 5,
			roomHeightMax = pRoomHeightMax || 10,
			roomHeightMin = pRoomHeightMin || 5;

		var checkRoomCollision = function (room) {
			if (that.rooms.length === 0) {
				return false;
			}
			for (var i = 0; i < that.rooms.length; i++) {
                if (room.x < that.rooms[i].x + that.rooms[i].width &&
					room.x + room.width > that.rooms[i].x &&
					room.y < that.rooms[i].y + that.rooms[i].height &&
					room.y + room.height > that.rooms[i].y) {
				   	return true;
				}
			}
			return false;
		};

		for (var i = 0; i < roomAttempts; i++) {
			room.width  = Math.round(Math.random() * (roomWidthMax  - roomWidthMin))  + roomWidthMin;
			room.height = Math.round(Math.random() * (roomHeightMax - roomHeightMin)) + roomHeightMin;
			room.x      = Math.round(Math.random() * (that.width - room.width - 6) + 3);
			room.y      = Math.round(Math.random() * (that.height - room.height - 6) + 3);

			if (checkRoomCollision(room) === false) {
				that.rooms.push({
					width : room.width,
					height : room.height,
					x : room.x,
					y : room.y
				});

				for (var x = room.x; x < room.x + room.width; x++) {
					for (var y = room.y; y < room.y + room.height; y++) {
						that.map[x][y] = 2;
					}
				}

				canvas.fillStyle = 'rgb(' + Math.round(Math.random() * 100) + ', ' + Math.round(Math.random() * 100) + ', ' + Math.round(Math.random() * 100) + ')';
				canvas.fillRect(
					room.x * that.blocksize,
					room.y * that.blocksize,
					room.width * that.blocksize,
					room.height * that.blocksize
				);
			}
		}
	};
    Labyrinth.prototype.generateLabyrinth = function (start) {
        var roadStack  = [],
            that       = this;

        function recGenerate (currentTile, canPushMoreDeadEnds) {
            var possibleDirections = [],
                nextBlock,
                direction;

            // that.map[currentTile.x][currentTile.y] = 1;

            // if (currentTile.y > 1) {
            //     var isGoingUpPossible = true;
            //     for (var y = -2; y < 0; y++) {
            //         for (var x = -1; x < 2; x++) {
            //             isGoingUpPossible = isGoingUpPossible && (that.map[currentTile.x + x][currentTile.y + y] !== 1) && (that.map[currentTile.x + x][currentTile.y + y] !== 2);
            //         }
            //     }
            //     if (isGoingUpPossible) {
            //         possibleDirections.push(directions[0]);
            //     }
            // }

            if (currentTile.y > 2 &&
                (that.map[currentTile.x - 1][currentTile.y - 3] !== 1) &&
                (that.map[currentTile.x    ][currentTile.y - 3] !== 1) &&
                (that.map[currentTile.x + 1][currentTile.y - 3] !== 1) &&
                (that.map[currentTile.x - 1][currentTile.y - 2] !== 1) && (that.map[currentTile.x - 1][currentTile.y - 2] !== 2) &&
                (that.map[currentTile.x    ][currentTile.y - 2] !== 1) && (that.map[currentTile.x    ][currentTile.y - 2] !== 2) &&
                (that.map[currentTile.x + 1][currentTile.y - 2] !== 1) && (that.map[currentTile.x + 1][currentTile.y - 2] !== 2) &&
                (that.map[currentTile.x - 1][currentTile.y - 1] !== 1) && (that.map[currentTile.x - 1][currentTile.y - 1] !== 2) &&
                (that.map[currentTile.x    ][currentTile.y - 1] !== 1) && (that.map[currentTile.x    ][currentTile.y - 1] !== 2) &&
                (that.map[currentTile.x + 1][currentTile.y - 1] !== 1) && (that.map[currentTile.x + 1][currentTile.y - 1] !== 2)
            ) {
                possibleDirections.push(directions[0]);
            }
            // maximum call stack size exceeded

            if (currentTile.x < that.width - 3 &&
                (that.map[currentTile.x + 1][currentTile.y - 1] !== 1) && (that.map[currentTile.x + 1][currentTile.y - 1] !== 2) &&
                (that.map[currentTile.x + 1][currentTile.y    ] !== 1) && (that.map[currentTile.x + 1][currentTile.y    ] !== 2) &&
                (that.map[currentTile.x + 1][currentTile.y + 1] !== 1) && (that.map[currentTile.x + 1][currentTile.y + 1] !== 2) &&
                (that.map[currentTile.x + 2][currentTile.y - 1] !== 1) && (that.map[currentTile.x + 2][currentTile.y - 1] !== 2) &&
                (that.map[currentTile.x + 2][currentTile.y    ] !== 1) && (that.map[currentTile.x + 2][currentTile.y    ] !== 2) &&
                (that.map[currentTile.x + 2][currentTile.y + 1] !== 1) && (that.map[currentTile.x + 2][currentTile.y + 1] !== 2) &&
                (that.map[currentTile.x + 3][currentTile.y - 1] !== 1) &&
                (that.map[currentTile.x + 3][currentTile.y    ] !== 1) &&
                (that.map[currentTile.x + 3][currentTile.y + 1] !== 1)
            ) {
                possibleDirections.push(directions[1]);
            }
            if (currentTile.y < that.height - 3 &&
                (that.map[currentTile.x - 1][currentTile.y + 3] !== 1) &&
                (that.map[currentTile.x    ][currentTile.y + 3] !== 1) &&
                (that.map[currentTile.x + 1][currentTile.y + 3] !== 1) &&
                (that.map[currentTile.x - 1][currentTile.y + 2] !== 1) && (that.map[currentTile.x - 1][currentTile.y + 2] !== 2) &&
                (that.map[currentTile.x    ][currentTile.y + 2] !== 1) && (that.map[currentTile.x    ][currentTile.y + 2] !== 2) &&
                (that.map[currentTile.x + 1][currentTile.y + 2] !== 1) && (that.map[currentTile.x + 1][currentTile.y + 2] !== 2) &&
                (that.map[currentTile.x - 1][currentTile.y + 1] !== 1) && (that.map[currentTile.x - 1][currentTile.y + 1] !== 2) &&
                (that.map[currentTile.x    ][currentTile.y + 1] !== 1) && (that.map[currentTile.x    ][currentTile.y + 1] !== 2) &&
                (that.map[currentTile.x + 1][currentTile.y + 1] !== 1) && (that.map[currentTile.x + 1][currentTile.y + 1] !== 2)
            ) {
                possibleDirections.push(directions[2]);
            }
            if (currentTile.x > 2 &&
                (that.map[currentTile.x - 1][currentTile.y - 1] !== 1) && (that.map[currentTile.x - 1][currentTile.y - 1] !== 2) &&
                (that.map[currentTile.x - 1][currentTile.y    ] !== 1) && (that.map[currentTile.x - 1][currentTile.y    ] !== 2) &&
                (that.map[currentTile.x - 1][currentTile.y + 1] !== 1) && (that.map[currentTile.x - 1][currentTile.y + 1] !== 2) &&
                (that.map[currentTile.x - 2][currentTile.y - 1] !== 1) && (that.map[currentTile.x - 2][currentTile.y - 1] !== 2) &&
                (that.map[currentTile.x - 2][currentTile.y    ] !== 1) && (that.map[currentTile.x - 2][currentTile.y    ] !== 2) &&
                (that.map[currentTile.x - 2][currentTile.y + 1] !== 1) && (that.map[currentTile.x - 2][currentTile.y + 1] !== 2) &&
                (that.map[currentTile.x - 3][currentTile.y - 1] !== 1) &&
                (that.map[currentTile.x - 3][currentTile.y    ] !== 1) &&
                (that.map[currentTile.x - 3][currentTile.y + 1] !== 1)
            ) {
                possibleDirections.push(directions[3]);
            }

            if (possibleDirections.length === 0) {
                nextBlock = roadStack.pop();
                if (canPushMoreDeadEnds === true) {
                    that.deadends.push(currentTile);
                    canPushMoreDeadEnds = false;
                }
            } else {
                roadStack.push(currentTile);
                direction = _.sample(possibleDirections);
                nextBlock = {
                    x : currentTile.x + direction.x,
                    y : currentTile.y + direction.y
                };
                that.map[nextBlock.x][nextBlock.y] = 1;
                nextBlock = {
                    x : nextBlock.x + direction.x,
                    y : nextBlock.y + direction.y
                };
                that.map[nextBlock.x][nextBlock.y] = 1;
                canPushMoreDeadEnds = true;
            }
            if (nextBlock !== undefined) {
                // canvas.fillStyle = '#575757';
                // canvas.fillRect(nextBlock.x * that.blocksize, nextBlock.y * that.blocksize, that.blocksize, that.blocksize);
                recGenerate(nextBlock, canPushMoreDeadEnds);
            }
        }

        that.map[start.x][start.y] = 1;
        // that.deadends.push(start);
        recGenerate(start, true);
    };
    Labyrinth.prototype.generateDoors = function () {
        for (var i = 0; i < this.rooms.length; i++) {
            this.rooms[i].thinWalls = [];
            this.rooms[i].doors     = [];

            for (var northEdge = 0; northEdge < this.rooms[i].width; northEdge++) {
                if (this.map[this.rooms[i].x + northEdge][this.rooms[i].y - 1] === 0 &&
                    (this.map[this.rooms[i].x + northEdge][this.rooms[i].y - 2] === 1 || this.map[this.rooms[i].x + northEdge][this.rooms[i].y - 2] === 2)) {
                    this.rooms[i].thinWalls.push({
                        x : this.rooms[i].x + northEdge,
                        y : this.rooms[i].y - 1
                    });
                }
            }
            for (var eastEdge = 0; eastEdge < this.rooms[i].height; eastEdge++) {
                if (this.map[this.rooms[i].x + this.rooms[i].width][this.rooms[i].y + eastEdge] === 0 &&
                    (this.map[this.rooms[i].x + this.rooms[i].width + 1][this.rooms[i].y + eastEdge] === 1 || this.map[this.rooms[i].x + this.rooms[i].width + 1][this.rooms[i].y + eastEdge] === 2)) {
                    this.rooms[i].thinWalls.push({
                        x : this.rooms[i].x + this.rooms[i].width,
                        y : this.rooms[i].y + eastEdge
                    });
                }
            }
            for (var southEdge = 0; southEdge < this.rooms[i].width; southEdge++) {
                if (this.map[this.rooms[i].x + southEdge][this.rooms[i].y + this.rooms[i].height] === 0 &&
                    (this.map[this.rooms[i].x + southEdge][this.rooms[i].y + this.rooms[i].height + 1] === 1 || this.map[this.rooms[i].x + southEdge][this.rooms[i].y + this.rooms[i].height + 1] === 2)) {
                    this.rooms[i].thinWalls.push({
                        x : this.rooms[i].x + southEdge,
                        y : this.rooms[i].y + this.rooms[i].height
                    });
                }
            }
            for (var westEdge = 0; westEdge < this.rooms[i].height; westEdge++) {
                if (this.map[this.rooms[i].x - 1][this.rooms[i].y + westEdge] === 0 &&
                    (this.map[this.rooms[i].x - 2][this.rooms[i].y + westEdge] === 1 || this.map[this.rooms[i].x - 2][this.rooms[i].y + westEdge] === 2)) {
                    this.rooms[i].thinWalls.push({
                        x : this.rooms[i].x - 1,
                        y : this.rooms[i].y + westEdge
                    });
                }
            }

            this.rooms[i].doors = _.sample(this.rooms[i].thinWalls, Math.round(Math.random() * 2) + 1);
            for (var j = 0; j < this.rooms[i].doors.length; j++) {
                this.map[this.rooms[i].doors[j].x][this.rooms[i].doors[j].y] = 3;
            }

        }
    };
    Labyrinth.prototype.drawDeadEnds = function () {
        canvas.fillStyle = '#333333';
        for (var i = 0; i < this.deadends.length; i++) {
            canvas.fillRect(this.deadends[i].x * this.blocksize, this.deadends[i].y * this.blocksize, this.blocksize, this.blocksize);
        }
    };
    Labyrinth.prototype.ereaseDeadEnds = function (depth) {
        var isDoorFound,
            isCurrentReallyDeadEnd,
            newDeadEndCandidate,
            blockNextToPotentialDeadEnd,
            newDeadEndCandidates,
            deleteThemNow,
            counter;
        // for (var d = 0; d < depth; d++) { // going trough the dead ends :depth: times
            counter = 0;
        do {
            newDeadEndCandidates = [];
            deleteThemNow        = [];

            for (var i = 0; i < this.deadends.length; i++) {
                isDoorFound            = false;
                isCurrentReallyDeadEnd = 0;


                for (var j = 0; j < directions.length; j++) { // check if the block is actually a dead end: are there more than 2 path tiles in any direction?
                    blockNextToPotentialDeadEnd = {
                        x : this.deadends[i].x + directions[j].x,
                        y : this.deadends[i].y + directions[j].y
                    };
                    if (this.map[blockNextToPotentialDeadEnd.x][blockNextToPotentialDeadEnd.y] === 3) {
                        isDoorFound = true;
                    }
                    if (this.map[blockNextToPotentialDeadEnd.x][blockNextToPotentialDeadEnd.y] === 1) {
                        isCurrentReallyDeadEnd++;
                        newDeadEndCandidate = {
                            x : blockNextToPotentialDeadEnd.x,
                            y : blockNextToPotentialDeadEnd.y
                        };
                    }
                }
                if (!isDoorFound && isCurrentReallyDeadEnd === 1) { // if there was more than 1 way from a dead end then it wasn't a dead end
                    newDeadEndCandidates.push(newDeadEndCandidate);
                    deleteThemNow.push({
                        x : this.deadends[i].x,
                        y : this.deadends[i].y
                    });
                    canvas.fillStyle = '#FF6B22';
                    canvas.fillRect(this.deadends[i].x * this.blocksize, this.deadends[i].y * this.blocksize, this.blocksize, this.blocksize);
                }

            }


            for (var k = 0; k < deleteThemNow.length; k++) {
                this.map[deleteThemNow[k].x][deleteThemNow[k].y] = 0;
            }
            this.deadends = newDeadEndCandidates;

            console.log(newDeadEndCandidates.length);
            counter++;
        } while (depth > counter);// || newDeadEndCandidates.length !== 0

        // }
    };

    Labyrinth.prototype.draw = function () {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (this.map[x][y] === 0) { // wall
                    canvas.fillStyle = '#C7C7C7';
                    canvas.fillRect(x * this.blocksize, y * this.blocksize, this.blocksize, this.blocksize);
                }
                if (this.map[x][y] === 1) { // road
                    canvas.fillStyle = '#FFFFFF';
                    canvas.fillRect(x * this.blocksize, y * this.blocksize, this.blocksize, this.blocksize);
                }
                if (this.map[x][y] === 2) { // room
                    canvas.fillStyle = '#F1F1F1';
                    canvas.fillRect(x * this.blocksize, y * this.blocksize, this.blocksize, this.blocksize);
                }
                if (this.map[x][y] === 3) { // door
                    canvas.fillStyle = '#FFC8AD';
                    canvas.fillRect(x * this.blocksize, y * this.blocksize, this.blocksize, this.blocksize);
                }
            }
        }
    };

    var labyrinth = new Labyrinth(width, height, blocksize);
    labyrinth.generateRooms(10, 6, 3, 6, 3); // roomAttempts, pRoomWidthMax, pRoomWidthMin, pRoomHeightMax, pRoomHeightMin
    labyrinth.generateLabyrinth({
        x : 1,
        y : 1
    });
    labyrinth.generateDoors();
    labyrinth.drawDeadEnds();
    // labyrinth.ereaseDeadEnds(3); // param : depth of dead end ereasing; if not given, erease all
    labyrinth.draw();
    // labyrinth.write();

})(50, 50, 10);
