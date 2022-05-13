window.PG = {
    screenWidth: 1000,
    screenHeight: 600,
    sectorsWidthNum: 50,
    sectorsHeightNum: 30,
    ctx: null,
    scale: 1,
    currentSectorWidth: 0,
    currentSectorHeight: 0,

    islands: [],

    main: function () {
        let tglMapBtn = document.getElementById("tglmap");
        tglMapBtn.addEventListener("click", this.toggleMap.bind(this));

        this.sectorWidth = this.screenWidth / this.sectorsWidthNum;
        this.sectorHeight = this.screenHeight / this.sectorsHeightNum;
        this.currentScreenWidth = this.screenWidth / this.scale;
        this.currentScreenHeight = this.screenHeight / this.scale;

        let canvas = document.getElementById("canvas");

        window.addEventListener("keyup", this.changeSector.bind(this));

		canvas.setAttribute("width", this.screenWidth);
		canvas.setAttribute("height", this.screenHeight);
		this.ctx = canvas.getContext("2d");

        this.rng = new Rnd(01012021 * 17);

        for (let i = 1; i < this.sectorsWidthNum; i++) {
            for (let j = 1; j < this.sectorsHeightNum; j++) {
                //Rnd.seed = (i & 0xFFFF) << 16 | (j & 0xFFFF);

                let rndInt = this.rng.getInt(0,20);
                let createIsland = (rndInt <= 1);
                if (createIsland) {
                    this.islands.push(new Island(i * this.sectorWidth, j * this.sectorHeight));
                }

                /*this.ctx.beginPath();
                this.ctx.moveTo(i * this.sectorWidth, j * this.sectorHeight);
                this.ctx.lineTo((i + 1) * this.sectorWidth, j * this.sectorHeight);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(i * this.sectorWidth, j * this.sectorHeight);
                this.ctx.lineTo(i * this.sectorWidth, (j + 1) * this.sectorHeight);
                this.ctx.stroke();*/
            }
        }

        this.draw();
    },

    toggleMap: function () {
        if (this.scale == 1) {
            this.scale = 10;
        } else {
            this.scale = 1;
        }

        this.currentScreenWidth = this.screenWidth / this.scale;
        this.currentScreenHeight = this.screenHeight / this.scale;

        this.draw();
    },

    changeSector: function (e) {
        switch (e.keyCode) {
            case 37: //left
                this.currentSectorWidth--;
                if (this.currentSectorWidth < 0) {
                    this.currentSectorWidth = 0;
                }
                break;
            case 38: //up
                this.currentSectorHeight--;
                if (this.currentSectorHeight < 0) {
                    this.currentSectorHeight = 0;
                }
                break;
            case 39: //right
                this.currentSectorWidth++;
                if (this.currentSectorWidth > this.scale - 1) {
                    this.currentSectorWidth = this.scale - 1;
                }
                break;
            case 40: //down
                this.currentSectorHeight++;
                if (this.currentSectorHeight > this.scale - 1) {
                    this.currentSectorHeight = this.scale - 1;
                }
                break;
        }

        this.draw();
    },

    draw: function () {
        this.ctx.fillStyle = "#04E";
        this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

        for (let island of this.islands) {
            island.draw(
                this.ctx, 
                this.scale, 
                this.scale == 1 ? 0: this.currentSectorWidth * this.currentScreenWidth, 
                this.scale == 1 ? this.screenWidth : this.currentSectorWidth * this.currentScreenWidth + this.currentScreenWidth,
                this.scale == 1 ? 0: this.currentSectorHeight * this.currentScreenHeight,
                this.scale == 1 ? this.screenHeight : this.currentSectorHeight * this.currentScreenHeight + this.currentScreenHeight
            );
        }
    }
};

window.PG.main();