class Island {
    constructor (x, y) {
        this.rng = new Rnd((x & 0xFFFF) << 16 | (y & 0xFFFF));

        let isNegative = this.rng.getInt(0, 1);
        this.x = x + (this.rng.getInt(0, 6) * (isNegative == 1 ? -1 : 1));
        this.y = y + (this.rng.getInt(0, 6) * (isNegative == 1 ? -1 : 1));
        
        let sizeScew = this.rng.getInt(1, 10);
        if (sizeScew < 5) {
            this.diameter = this.rng.getDouble(4.0, 10.0);
        } else if (sizeScew < 9) {
            this.diameter = this.rng.getDouble(11.0, 25.0);
        } else {
            this.diameter = this.rng.getDouble(26.0, 40.0);
        }

        //Create initial coast points
		let aveRad = Math.random() * paper.view.bounds.width/3 + paper.view.bounds.width/3;
		for(let i = 0; i < 8; i++){
			let cpx = (Math.random() * aveRad / 2 - aveRad / 4 + aveRad/2) * Math.cos(.698 * i) + paper.view.bounds.width/2;
			let cpy = (Math.random() * aveRad / 2 - aveRad / 4 + aveRad/2) * Math.sin(.698 * i) + paper.view.bounds.width/2;
			coastPoints.push({x: cpx, y: cpy, tension: .5});
		}
        //set all point tangents
		for(let i = 0; i < 8; i++){
			let point = coastPoints[i];
			let prevPoint = coastPoints[i - 1] ? coastPoints[i - 1] : coastPoints[4 - 1];
			let nextPoint = coastPoints[i + 1] ? coastPoints[i + 1] : coastPoints[0];
			
			let tangentX = (1 - point.tension)*(nextPoint.x - prevPoint.x);
			let tangentY = (1 - point.tension)*(nextPoint.y - prevPoint.y);
			let tanPoint = new tangentPoint(tangentX/2, tangentY/2, point);
			point.tangentPoint = tanPoint;
		}
    }

    draw (ctx, scale, minX, maxX, minY, maxY) {
        ctx.fillStyle = "#4F1";

        ctx.beginPath();

        let radius = this.diameter / 2;

        if (((this.x - radius < maxX && this.x - radius > minX) || 
            (this.x + radius > minX && this.x + radius < maxX)) &&
            ((this.y - radius < maxY && this.y - radius > minY) || 
            (this.y + radius > minY && this.y + radius < maxY))) {
            ctx.arc((this.x - minX) * scale, (this.y - minY) * scale, radius * scale, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        //ctx.fillCirc(this.x, this.y, 10, 10);
    }
}