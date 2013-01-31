/**
 * @author adawans
 */


NDee.Vector = function () {

	if ( arguments.length > 0 ) {
		if ( arguments.length > 1 ) {
			this.coords = [];
			this.set.apply( this, arguments );
		} else {
			this.coords = [];
			for ( var i = arguments[0]; i-- ; ) {
				this.coords.push( 0 );
			}
		}
	} else {
		this.coords = [];
	}

};


NDee.Vector.prototype = {

	constructor: NDee.Vector,

	getN: function () {

		return this.coords.length;

	},

	set: function () {

		if ( this.coords.length == arguments.length ) {
			for ( var i = this.coords.length; i--; ) {
				this.coords[i] = arguments[i];
			}
		} else {
			this.coords = Array.prototype.slice.call(arguments);
		}
		
		return this;

	},

	setComponent: function ( index, value ) {

		this.coords[index] = value;
		return this;

	},

	getComponent: function ( index ) {

		return this.coords[index];

	},

	copy: function ( v ) {

		if ( this.coords.length == v.coords.length ) {
			for ( var i = this.coords.length; i--; ) {
				this.coords[i] = v.coords[i];
			}
		} else {
			this.coords = v.coords.slice(0);
		}
		
		return this;

	},

	fill: function ( val ) {

		for ( var i = this.coords.length; i--; ) {
			this.coords[i] = val;
		}
		return this;

	},

	add: function ( v ) {

		var i = Math.min(this.coords.length, v.coords.length);
		while ( i-- ) {
			this.coords[i] += v.coords[i];
		}

		return this;

	},

	addScalar: function ( s ) {

		for ( var i = this.coords.length; i--; ) {
			this.coords[i] += s;
		}

		return this;

	},

	sub: function ( v ) {

		var i = Math.min(this.coords.length, v.coords.length);
		while ( i-- ) {
			this.coords[i] -= v.coords[i];
		}

		return this;

	},

	multiply: function ( v ) {

		var i = Math.min(this.coords.length, v.coords.length);
		while ( i-- ) {
			this.coords[i] *= v.coords[i];
		}

		return this;

	},

	multiplyScalar: function ( s ) {

		for ( var i = this.coords.length; i--; ) {
			this.coords[i] *= s;
		}

		return this;

	},

	divide: function ( v ) {

		var i = Math.min(this.coords.length, v.coords.length);
		while ( i-- ) {
			divider = v.coords[i];
			this.coords[i] = divider === 0 ? (this.coords[i] / divider) : 0;
		}

		return this;

	},

	divideScalar: function ( s ) {

		if ( s !== 0 ) {

			for ( var i = this.coords.length; i--; ) {
				this.coords[i] /= s;
			}

		} else {

			for ( var i = this.coords.length; i--; ) {
				this.coords[i] = 0;
			}

		}

		return this;

	},

	min: function ( v ) {

		var i = Math.min(this.coords.length, v.coords.length);
		var buff;
		while ( i-- ) {
			if ( this.coords[i] > ( buff = v.coords[i] ) ) {
				this.coords[i] = buff;
			}
		}

		return this;

	},

	max: function ( v ) {

		var i = Math.min(this.coords.length, v.coords.length);
		var buff;
		while ( i-- ) {
			if ( this.coords[i] < ( buff = v.coords[i] ) ) {
				this.coords[i] = buff;
			}
		}

		return this;

	},

	clamp: function ( min, max ) {

		var i = Math.min( this.coords.length, Math.min( min.coords.length, max.coords.length ) );
		var buffA, buffB;
		while ( i-- ) {
			if ( ( buffA = this.coords[i] ) < ( buffB = min.coords[i] ) ) {
				this.coords[i] = buffB;
			} else if ( buffA > ( buffB = max.coords[i] ) ) {
				this.coords[i] = buffB;
			}
		}

		return this;

	},

	negate: function() {

		return this.multiplyScalar( -1 );

	},

	dot: function ( v ) {

		var result = 0;
		var i = Math.min(this.coords.length, v.coords.length);
		while ( i-- ) {
			result += this.coords[i] * v.coords[i];
		}

		return result;

	},

	lengthSq: function () {

		return this.dot( this );

	},

	length: function () {

		return Math.sqrt( this.lengthSq() );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength  ) {
			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	angleTo: function ( v ) {

		return Math.acos( this.cosTo( v ) );

	},

	cosTo: function ( v ) {

		return this.dot( v ) / this.length() / v.length();

	},


	distanceToSquared: function ( v ) {

		var result = 0;
		var i = Math.min(this.coords.length, v.coords.length);
		while ( i-- ) {
			var value = this.coords[i] - v.coords[i];
			result += value * value;
		}

		return result;

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	equals: function ( v ) {

		if ( this.coords.length !== v.coords.length ) {
			return false;
		}

		for ( var i = this.coords.length; i--; ) {
			if (this.coords[i] !== v.coords[i] ) {
				return false;
			}
		}

		return true;

	},

	clone: function () {

		return new NDee.Vector().copy( this );

	}

};

NDee.Vector.__v1 = new NDee.Vector();