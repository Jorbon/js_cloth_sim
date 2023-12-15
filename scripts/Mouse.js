class Mouse extends Vec2 {
	constructor(initialize=true) {
		super(0, 0);
		this.button = {
			l: false,
			m: false,
			r: false
		}
		this.enabled = true;
		this.drag = {
			l: { start: new Vec2(), end: new Vec2() },
			m: { start: new Vec2(), end: new Vec2() },
			r: { start: new Vec2(), end: new Vec2() }
		};
		this.d = new Vec2();
		this.setParent();
		if (initialize) this.initialize();
	}
	setParent(parent={offsetLeft: 0, offsetTop: 0}) { this.parent = parent; }
	getParent() { return this.parent; }
	initialize() {
		window.addEventListener("mousemove", e => { if (this.enabled) this.onMove(e.x, e.y) });
		window.addEventListener("mousedown", e => { if (this.enabled) this.onDown(e.button, e.x, e.y) });
		window.addEventListener("mouseup", e => { if (this.enabled) this.onUp(e.button, e.x, e.y) });
	}
	onMove(x, y) {
		this.d.x = x - this.parent.offsetLeft - this.x;
		this.d.y = y - this.parent.offsetTop - this.y;
		this.x = x - this.parent.offsetLeft;
		this.y = y - this.parent.offsetTop;
		if (this.button.l) this.drag.l.end = new Vec2(this);
		if (this.button.m) this.drag.m.end = new Vec2(this);
		if (this.button.r) this.drag.r.end = new Vec2(this);
	}
	onDown(button, x, y) {
		switch (button) {
			case 0:
				this.button.l = true;
				this.drag.l.start = new Vec2(this);
				this.drag.l.end = new Vec2(this);
				break;
			case 1:
				this.button.m = true;
				this.drag.m.start = new Vec2(this);
				this.drag.m.end = new Vec2(this);
				break;
			case 2:
				this.button.r = true;
				this.drag.r.start = new Vec2(this);
				this.drag.r.end = new Vec2(this);
				break;
			}
	}
	onUp(button, x, y) {
		switch (button) {
			case 0:
				this.button.l = false;
				break;
			case 1:
				this.button.m = false;
				break;
			case 2:
				this.button.r = false;
				break;
		}
	}
}


