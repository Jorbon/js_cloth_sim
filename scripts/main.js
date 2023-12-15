const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const imageInput = document.getElementById("image-input");
const dndmapInput = document.getElementById("dndmap-input");


window.addEventListener("contextmenu", event => { event.stopPropagation(); event.preventDefault(); });
window.addEventListener("dragenter", event => { event.stopPropagation(); event.preventDefault(); });
window.addEventListener("dragover", event => { event.stopPropagation(); event.preventDefault(); });

const mouse = new Mouse();
mouse.setParent(canvas);


canvas.addEventListener("mousedown", event => {
	for (let i = 0; i < dc; i++) {
		if (dots[i].sub(inp(mouse)).abs2() <= sizes[i]*sizes[i]) {
			drag = i;
			break;
		}
	}
});

window.addEventListener("mouseup", event => {
	vs[drag] = lastv;
	drag = null;
});

canvas.addEventListener("mousemove", event => {
	if (drag != null) {
		dots[drag] = inp(mouse);
		lastv = new Vec2(ind(event.movementX), ind(event.movementY)).mult(1/(speed * reps));
	}
});

canvas.addEventListener("wheel", event => {
	
});

const keys = [];
for (let i = 0; i < 256; i++) { keys[i] = false; }
window.addEventListener("keydown", event => {
	if (!(event.metaKey || event.ctrlKey))
		keys[event.which || event.keyCode] = true;

	switch (event.key) {
	case " ":
		for (let i = 0; i < dc-1; i++)
			for (let j = i+1; j < dc; j++)
				if (dots[i].sub(dots[j]).abs2() <= Math.pow(distance * (sizes[i] + sizes[j]), 2))
					link(i, j, distance * (sizes[i] + sizes[j]));
		break;
	case "Backspace":
		for (let i = 0; i < links.length; i++)
			links[i] = 0;
		break;
	case "m":
		mode = 1-mode;
		break;
	case "f":
		if (friction != 0.02)
			friction = 0.02;
		else friction = 0.5;
		break;
	case "r":
		if (friction > 0)
			friction = 0;
		else friction = 0.02;
		break;
	case "s":
		sticky = !sticky;
		break;
	case "b":
		breaky = !breaky;
		break;
	}
});

window.addEventListener("keyup", event => {
	keys[event.which || event.keyCode] = false;
});




let cam = new LocalSpace(0.04);

function outx(x) { return cam.outx(x); }
function outy(y) { return cam.outy(y); }
function outd(d) { return cam.outd(d); }
function inx(x)  { return cam.inx(x);  }
function iny(y)  { return cam.iny(y);  }
function ind(d)  { return cam.ind(d);  }
function outp(v) { return cam.outp(v); }
function inp(v)  { return cam.inp(v);  }
function inv(v)  { return cam.inv(v);  }




let timestampnow = performance.now(), timestampprev = performance.now();
const SMOL = 0.0001;


function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.size = new Vec2(canvas.width, canvas.height);
	cam.pos = inv(new Vec2(-0.5 * canvas.width, -0.5 * canvas.height));
}
resize();
window.addEventListener("resize", resize);




const dots = [], vs = [], links = [];
const sizes = [], masses = [], charges = [];

let mode = 0;
let sticky = false;
let breaky = false;
let friction = 0.02;
let limit = 4;
let distance = 2;
let speed = 0.02;
let reps = 10;

let drag = null;
let lastv = new Vec2();


for (let y = -5; y < 5; y++) {
	for (let x = -5; x < 5; x++) {
		dots.push(new Vec2(x + mod(y%2, 2)/2, y));
		vs.push(new Vec2());
		sizes.push(0.4);
		masses.push(1);
		charges.push(1);
	}
}






const dc = dots.length;

for (let i = 0; i < dc*dc; i++)
	links[i] = 0;



for (let i = 0; i < dc-1; i++)
	for (let j = i+1; j < dc; j++)
		if (dots[i].sub(dots[j]).abs2() <= Math.pow(distance * (sizes[i] + sizes[j]), 2))
			link(i, j, distance * (sizes[i] + sizes[j]));



function tick() {
	for (let i = 0; i < dc-1; i++) {
		for (let j = i+1; j < dc; j++) {
			let v = dots[i].sub(dots[j]);
			let len = v.abs();
			if (breaky && len > limit * (sizes[i] + sizes[j]))
				unlink(i, j);
			else if (sticky && len < distance * (sizes[i] + sizes[j]))
				link(i, j, distance * (sizes[i] + sizes[j]));

			let f = v.mult(force(len, sizes[i], sizes[j], charges[i], charges[j]) / len * speed);
			if (links[dc*i+j] > 0)
				f = f.add(v.mult(linkforce(len, links[dc*i+j]) / len * speed));

			vs[i] = vs[i].add(f);
			vs[j] = vs[j].add(f.opposite());
		}
	}

	for (let i = 0; i < dc; i++) {
		if (i == drag) continue;
		dots[i] = dots[i].add(vs[i].mult(speed / (masses[i])));
		vs[i] = vs[i].mult(1 - friction);
	}
};

function link(i, j, n) {
	links[dc*i+j] = n;
	links[dc*j+i] = n;
};
function unlink(i, j) {
	links[dc*i+j] = 0;
	links[dc*j+i] = 0;
};



function linkforce(d, l) {
	d /= l;
	return 100 * (1 - d*d) / d;
};

function force(d, s1, s2, c1, c2) {
	if (mode == 0) {
		if (d > s1+s2) return 0;
		d /= s1+s2;
		return (1 - d*d) / d;
	}
	//d /= s1+s2;
	return 5*c1*c2 * (1-0.2*d) / (d*d);
};



function draw() {
	requestAnimationFrame(draw);

	// physics step

	for (let i = 0; i < reps; i++) tick();




	// background
	ctx.fillStyle = "#1f1f1f";
	ctx.fillRect(0, 0, canvas.width, canvas.height);


	timestampnow = performance.now();
	let delta = timestampnow - timestampprev;

	// animation step

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "12px Verdana";

	for (let i = 0; i < dc; i++) {
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#5f6fdf";
		for (let j = i+1; j < dc; j++) {
			if (links[dc*i+j] != 0) {
				ctx.beginPath();
				ctx.moveTo(outx(dots[i].x), outy(dots[i].y));
				ctx.lineTo(outx(dots[j].x), outy(dots[j].y));
				ctx.stroke();
			}
		}

		ctx.fillStyle = "rgb(127, " + charges[i]*192 + ", 127)";
		ctx.beginPath();
		ctx.arc(outx(dots[i].x), outy(dots[i].y), outd(sizes[i]), 0, 2*pi);
		ctx.fill();

		ctx.fillStyle = "#000000";
		ctx.fillText(i, outx(dots[i].x), outy(dots[i].y));
	}
	
	timestampprev = timestampnow;

}

requestAnimationFrame(draw);




