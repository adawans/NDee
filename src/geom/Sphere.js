/**
 * @author adawans
 */
 

NDee.Sphere = function ( center, radius ) {

	this.center = center ? center : new NDee.Vector();
	this.radius = radius ? radius : 0;

};

NDee.Sphere.prototype = {

	constructor: NDee.Sphere,

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

		var center = this.center.coords;
		var buffA, buffB;
		for ( var i = center.length; i--; ) {
			if ( ( buffA = point.coords[i] ) < ( buffB = center[i] ) - this.radius || buffA > buffB + this.radius ) {
				return false;
			}
		}

		return point.distanceToSquared( this.center ) <= ( this.radius * this.radius );

	},

	distanceToPoint: function ( point ) {

		return ( point.distanceTo( this.center ) - this.radius );

	},

	intersectsSphere: function ( sphere ) {

		for ( var i = this.center.coords.length; i--; ) {
			if ( sphere.center.coords[i] + sphere.radius < this.center.coords[i] - this.radius || 
				sphere.center.coords[i] - sphere.radius > this.center.coords[i] + this.radius ) {
				return false;
			}
		}

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

	getBoundingBox: function ( result ) {

		var box = result || new NDee.AABBND();

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

		return new NDee.Sphere().copy( this );

	}

};