NDI.VectorND = function () {

	if ( arguments.length > 0 ) {
		if ( arguments.length > 1 ) {
			this.set.apply( this, arguments );
		} else {
			this.coords = [];
			for ( var i = 0; i < arguments[0] ; i++ ) {
				this.coords.push( 0 );
			}
		}
	} else {
		this.coords = [];
	}

};


NDI.VectorND.prototype = {

	constructor: NDI.VectorND,

	getN: function () {

		return this.coords.length;

	},

	set: function () {

		this.coords = Array.prototype.slice.call(arguments);
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

		this.coords = v.coords.slice(0);
		return this;

	},

	fill: function ( val ) {

		for ( var i = 0; i < this.coords.length; i++ ) {
			this.coords[i] = val;
		}
		return this;

	},

	add: function ( v ) {

		var length = Math.min(this.coords.length, v.coords.length);
		for ( var i = 0; i < length; i++ ) {
			this.coords[i] += v.coords[i];
		}

		return this;

	},

	addScalar: function ( s ) {

		for ( var i = 0; i < this.coords.length; i++ ) {
			this.coords[i] += s;
		}

		return this;

	},

	sub: function ( v ) {

		var length = Math.min(this.coords.length, v.coords.length);
		for ( var i = 0; i < length; i++ ) {
			this.coords[i] -= v.coords[i];
		}

		return this;

	},

	multiply: function ( v ) {

		var length = Math.min(this.coords.length, v.coords.length);
		for ( var i = 0; i < length; i++ ) {
			this.coords[i] *= v.coords[i];
		}

		return this;

	},

	multiplyScalar: function ( s ) {

		for ( var i = 0; i < this.coords.length; i++ ) {
			this.coords[i] *= s;
		}

		return this;

	},

	divide: function ( v ) {

		var length = Math.min(this.coords.length, v.coords.length);
		for ( var i = 0; i < length; i++ ) {
			divider = v.coords[i];
			this.coords[i] = divider === 0 ? (this.coords[i] / divider) : 0;
		}

		return this;

	},

	divideScalar: function ( s ) {

		if ( s !== 0 ) {

			for ( var i = 0; i < this.coords.length; i++ ) {
				this.coords[i] /= s;
			}

		} else {

			for ( var i = 0; i < this.coords.length; i++ ) {
				this.coords[i] = 0;
			}

		}

		return this;

	},

	min: function ( v ) {

		var length = Math.min(this.coords.length, v.coords.length);
		for ( var i = 0; i < length; i++ ) {
			if ( this.coords[i] > v.coords[i] ) {
				this.coords[i] = v.coords[i];
			}
		}

		return this;

	},

	max: function ( v ) {

		var length = Math.min(this.coords.length, v.coords.length);
		for ( var i = 0; i < length; i++ ) {
			if ( this.coords[i] < v.coords[i] ) {
				this.coords[i] = v.coords[i];
			}
		}

		return this;

	},

	clamp: function ( min, max ) {

		var length = Math.min( this.coords.length, Math.min( min.coords.length, max.coords.length ) );
		for ( var i = 0; i < length; i++ ) {
			if ( this.coords[i] < min.coords[i] ) {
				this.coords[i] = min.coords[i];
			} else if ( this.coords[i] > max.coords[i] ) {
				this.coords[i] = max.coords[i];
			}
		}

		return this;

	},

	negate: function() {

		return this.multiplyScalar( - 1 );

	},

	dot: function ( v ) {

		result = 0;
		var length = Math.min(this.coords.length, v.coords.length);
		for ( var i = 0; i < length; i++ ) {
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

		return Math.acos( this.dot( v ) / this.length() / v.length() );

	},

	distanceToSquared: function ( v ) {

		return this.clone().sub( v ).lengthSq();

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	equals: function ( v ) {

		if ( this.coords.length !== v.coords.length ) {
			return false;
		}

		for ( var i = 0; i < this.coords.length; i++ ) {
			if (this.coords[i] !== v.coords[i] ) {
				return false;
			}
		}

		return true;

	},

	clone: function () {

		return new NDI.VectorND().copy( this );

	}

};