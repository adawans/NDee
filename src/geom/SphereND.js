NDI.SphereND = function ( center, radius ) {

	this.center = center ? center : new NDI.VectorND();
	this.radius = radius ? radius : 0;

};

NDI.SphereND.prototype = {

	constructor: NDI.SphereND,

	getN: function () {

		return this.center.getN();

	},

	set: function ( center, radius ) {

		this.center.copy( center );
		this.radius = radius;

		return this;
	},

	copy: function ( sphere ) {

		this.center.copy( sphere.center );
		this.radius = sphere.radius;

		return this;

	},

	empty: function () {

		return ( this.radius <= 0 );

	},

	containsPoint: function ( point ) {

		return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

	},

	distanceToPoint: function ( point ) {

		return ( point.distanceTo( this.center ) - this.radius );

	},

	intersectsSphere: function ( sphere ) {

		var radiusSum = this.radius + sphere.radius;

		return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

	},

	clampPoint: function ( point ) {

		var deltaLengthSq = this.center.distanceToSquared( point );

		if ( deltaLengthSq > ( this.radius * this.radius ) ) {

			point.sub( this.center ).normalize();
			point.multiplyScalar( this.radius ).add( this.center );

		}

		return point;

	},

	getBoundingBox: function ( optionalTarget ) {

		var box = new NDI.AABBND();

		box.set( this.center, this.center );
		box.expandByScalar( this.radius );

		return box;

	},

	translate: function ( offset ) {

		this.center.add( offset );

		return this;

	},

	equals: function ( sphere ) {

		return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

	},

	clone: function () {

		return new NDI.SphereND().copy( this );

	}

};