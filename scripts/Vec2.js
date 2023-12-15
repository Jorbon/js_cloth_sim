class Vec2 {
	constructor(x=0, y=0) {
        if (typeof x == "number") this.x = x, this.y = y;
		else this.x = x.x, this.y = x.y;
	}
	abs2() { return this.x * this.x + this.y * this.y; }
	abs() { return Math.sqrt(this.x*this.x + this.y*this.y); }
	add(v) { return new Vec2(this.x + v.x, this.y + v.y); }
	sub(v) { return new Vec2(this.x - v.x, this.y - v.y); }
	mult(s) { return new Vec2(this.x * s, this.y * s); }
	dot(v) { return this.x * v.x + this.y * v.y; }
	cross(v) { return this.x * v.y - this.y * v.x; }
	normalize() { return this.mult(1/this.abs()); }
	angle(v) { return Math.acos(this.dot(v) / Math.sqrt((this.x*this.x + this.y*this.y) * (v.x*v.x + v.y*v.y))); }
	fullAngle(v) {
		if (this.x*v.y < this.y*v.x) return this.angle(v);
		return 2*Math.PI - this.angle(v);
	}
	rotate(angle=0) {
        let c = Math.cos(angle), s = Math.sin(angle);
		return new V(this.x * c - this.y * s, this.y * c + this.x * s);
	}
	toString(space=true) { return "(" + this.x + (space?", ":",") + this.y + ")"; }
	moveHere() { ctx.moveTo(this.c[0], this.c[1]); }
	lineHere() { ctx.lineTo(this.c[0], this.c[1]); }
	static lerp(v1, v2, t) {
		return v2.sub(v1).mult(t).add(v1);
	}
	static fromPolar(r, a) {
		return new Vec2(Math.cos(a), Math.sin(a)).mult(r);
	}
	static NORTH = new Vec2(0, -1);
	static SOUTH = new Vec2(0, 1);
	static EAST = new Vec2(1, 0);
	static WEST = new Vec2(-1, 0);
	
	opposite() { return new Vec2(-this.x, -this.y); }
}
