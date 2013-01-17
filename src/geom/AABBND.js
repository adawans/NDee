NDI.AABBND = function () {

	this.min = new NDI.VectorND();
	this.max = new NDI.VectorND();

};

NDI.AABBND.prototype = {

	constructor: NDI.AABBND,

	getN: function () {

		return this.min.getN();

	},

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.fill(Infinity);
		this.max.fill(-Infinity);

		return this;

	},

	empty: function () {

		for ( var i = 0; i < this.min.getN(); i++ ) {
			if ( this.min.coords[i] > this.max.coords[i] ) {
				return true;
			}
		}

		return false;

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;

	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;

	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( -scalar );
		this.max.addScalar( scalar );

		return this;

	},

	containsPoint: function ( point ) {

		for ( var i = 0; i < this.min.getN(); i++ ) {
			if ( point.coords[i] < this.min.coords[i] || point.coords[i] > this.min.coords[i] ) {
				return false;
			}
		}

		return true;

	},

	containsBox: function ( box ) {

		for ( var i = 0; i < this.min.getN(); i++ ) {
			if ( box.min.coords[i] < this.min.coords[i] || box.max.coords[i] > this.max.coords[i] ) {
				return false;
			}
		}

		return true;

	},

	isIntersectionBox: function ( box ) {

		for ( var i = 0; i < this.min.getN(); i++ ) {
			if ( box.max.coords[i] < this.min.coords[i] || box.min.coords[i] > this.max.coords[i] ) {
				return false;
			}
		}

		return true;

	},

	clampPoint: function ( point ) {

		return new NDI.VectorND().copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function ( point ) {

		return this.clampPoint( point ).sub( point ).length();

	},


	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	},

	clone: function () {

		return new NDI.AABBND().copy( this );

	}

};