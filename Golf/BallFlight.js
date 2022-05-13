window.BallFlight = {
	BallPosition: new Vector(),
	V: new Vector(),
	deltaT: .01,
	GravForce: new Vector(0, -9.8, 0),
	M: .04593,
	NetForce: 0,
	StrikeAngle: 45,
	omegaI: 275,
	refreshV: function (Fnet){
			this.V = VecAdd(this.V, VecScalarMult(Fnet, this.deltaT/this.M));
	},
	computeFnet: function () {
		var omega = new Vector(0, this.omegaI*Math.sin(this.StrikeAngle), this.omegaI*Math.cos(this.StrikeAngle));
		var R = .04267/2;
		var nu = .000015;
		var alphaT = 280/360, n = 2.503e25, KB = 1.38e-23, T=293.15, m=4.812e-26, kappa=.4, rho=1.1347e6, Cp=519.16;
		var p = n*KB*T, chi = (alphaT*n*KB*T/kappa)*Math.sqrt(KB*T/(2*Math.PI*m)), k = kappa/(rho*Cp);
		var B = ComplexScalarMult(new ComplexNum(1, -1), Math.sqrt(VectorNorm(omega)*(R*R)/(2*k)));
		var z = new ComplexNum(besselj(1, B.r)/(chi*besselj(1, B.r)+B.r*(besselj(0, B.r)-besselj(1, B.r)/B.r)), 1);
		var xi = 1 - (chi/4)*(Re(z)+Math.sqrt(2*Math.PI*KB*T/m)*Im(z)/(4*VectorNorm(omega)*R));
		var Force = VecScalarMult(VecScalarMult(this.V,Math.PI/12*p*(R*R)*Math.sqrt(Math.PI*m/(2*KB*T))*chi*Re(z))-
					VecScalarMult(CrossProduct(omega, this.V),2/3*xi*Math.PI*(R*R*R)*m*n)-
					VecScalarMult(CrossProduct(omega, CrossProduct(omega, this.V)), Math.PI/3*(R*R*R)*m*n*chi*Im(z)/VectorNorm(omega)), -alphaT);
		var DragForce = Force;
		//The following lines alter the drag force to a less precise model
		//CD:=4*Pi*nu/(.5-.577215665+log10(4*nu/(R*VectorNorm(V, 2)))):
		//DragForce:=ScalarMultiply(V, -CD):
		//The following lines alter the drag force to the most basic model (CD=const.)
		//CD:=.29;
		//DragForce:=ScalarMultiply(V, -CD*R):
		var LiftForce = new Vector();
		this.NetForce = VecAdd(DragForce, VecAdd(this.GravForce, LiftForce));
	},
	refreshBallPos: function (){
		this.BallPosition = VecAdd(this.BallPosition, VecScalarMult(this.V, this.deltaT));
	},
	main: function (){
		var VI = 76;
		this.V = new Vector(VI * Math.cos(2*Math.PI*12/360), VI * Math.sin(2*Math.PI*12/360), 0);
		this.BallPosition.zOut();
		var MaxInt = 1000;
		var Ball = [];
		var i;
		for(i = 1; i < MaxInt; i++){
			this.refreshBallPos();
			Ball.push({x: this.BallPosition.x, y: this.BallPosition.y});
			this.computeFnet();
			this.refreshV(this.NetForce);
			//refreshSpin();
			if(this.BallPosition.y < 0)
				break;
		}
		var FlightTime = i * this.deltaT;
		var Carry = this.BallPosition.x;
		var VFinal = this.V;
		
		return Ball;
	}
}

function VecAdd(a, b){
	return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
}

function VecScalarMult(a, scalar){
	return new Vector(a.x * scalar, a.y * scalar, a.z * scalar);
}

function VectorNorm(vec){
	return Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
}

function CrossProduct(a, b){
	return new Vector(a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x);
}

function Vector(x, y, z){
	this.x = x ? x : 0;
	this.y = y ? y : 0;
	this.z = z ? z : 0;
	this.zOut = function (){
		this.x = this.y = this.z = 0;
	}
}

function Re(c){
	return c.r;
}

function Im(c){
	return c.i;
}

function ComplexScalarMult(c, scalar){
	return new ComplexNum(c.r * scalar, c.i * scalar);
}

function ComplexNum(real, imaginary){
	this.r = real ? real : 0;
	this.i = imaginary ? imaginary : 0;
}

//var besselj = (function() {
  var b0_a1a = [57568490574.0,-13362590354.0,651619640.7,-11214424.18,77392.33017,-184.9052456].reverse();
  var b0_a2a = [57568490411.0,1029532985.0,9494680.718,59272.64853,267.8532712,1.0].reverse();
  var b0_a1b = [1.0, -0.1098628627e-2, 0.2734510407e-4, -0.2073370639e-5, 0.2093887211e-6].reverse();
  var b0_a2b = [-0.1562499995e-1, 0.1430488765e-3, -0.6911147651e-5, 0.7621095161e-6, -0.934935152e-7].reverse();
  var W = 0.636619772; // 2 / Math.PI
var M = Math;
function _horner(arr, v) { return arr.reduce(function(z,w){return v * z + w;},0); };
function _bessel_iter(x, n, f0, f1, sign) {
  if(!sign) sign = -1;
  var tdx = 2 / x, f2;
  if(n === 0) return f0;
  if(n === 1) return f1;
  for(var o = 1; o != n; ++o) {
    f2 = f1 * o * tdx + sign * f0;
    f0 = f1; f1 = f2;
  }
  return f1;
}
  function bessel0(x) {
    var a, a1, a2, y = x * x, xx = M.abs(x) - 0.785398164;
    if(M.abs(x) < 8) {
      a1 = _horner(b0_a1a, y);
      a2 = _horner(b0_a2a, y);
      a = a1/a2;
    }
    else {
      y = 64 / y;
      a1 = _horner(b0_a1b, y);
      a2 = _horner(b0_a2b, y);
      a = M.sqrt(W/M.abs(x))*(M.cos(xx)*a1-M.sin(xx)*a2*8/M.abs(x));
    }
    return a;
  }
  var b1_a1a = [72362614232.0,-7895059235.0,242396853.1,-2972611.439, 15704.48260, -30.16036606].reverse();
  var b1_a2a = [144725228442.0, 2300535178.0, 18583304.74, 99447.43394, 376.9991397, 1.0].reverse();
  var b1_a1b = [1.0, 0.183105e-2, -0.3516396496e-4, 0.2457520174e-5, -0.240337019e-6].reverse();
  var b1_a2b = [0.04687499995, -0.2002690873e-3, 0.8449199096e-5, -0.88228987e-6, 0.105787412e-6].reverse();
  function bessel1(x) {
    var a, a1, a2, y = x*x, xx = M.abs(x) - 2.356194491;
    if(Math.abs(x)< 8) {
      a1 = x*_horner(b1_a1a, y);
      a2 = _horner(b1_a2a, y);
      a = a1 / a2;
    } else {
      y = 64 / y;
      a1=_horner(b1_a1b, y);
      a2=_horner(b1_a2b, y);
      a=M.sqrt(W/M.abs(x))*(M.cos(xx)*a1-M.sin(xx)*a2*8/M.abs(x));
      if(x < 0) a = -a;
    }
    return a;
  }
  function besselj(x, n) {
    n = Math.round(n);
    if(n === 0) return bessel0(M.abs(x));
    if(n === 1) return bessel1(M.abs(x));
    if(n < 0) throw 'BESSELJ: Order (' + n + ') must be nonnegative';
    if(M.abs(x) === 0) return 0;

    var ret, j, tox = 2 / M.abs(x), m, jsum, sum, bjp, bj, bjm;
    if(M.abs(x) > n) {
      ret = _bessel_iter(x, n, bessel0(M.abs(x)), bessel1(M.abs(x)),-1);
    } else {
      m=2*M.floor((n+M.floor(M.sqrt(40*n)))/2);
      jsum=0;
      bjp=ret=sum=0.0;
      bj=1.0;
      for (j=m;j>0;j--) {
        bjm=j*tox*bj-bjp;
        bjp=bj;
        bj=bjm;
        if (M.abs(bj) > 1E10) {
          bj *= 1E-10;
          bjp *= 1E-10;
          ret *= 1E-10;
          sum *= 1E-10;
        }
        if (jsum) sum += bj;
        jsum=!jsum;
        if (j == n) ret=bjp;
      }
      sum=2.0*sum-bj;
      ret /= sum;
    }
    return x < 0 && (n%2) ? -ret : ret;
  };
//})();