/**
 * @author adawans
 */

NDee.Plane = function ( normal, constant ) {

	this.normal = normal || new NDee.Vector();
	this.constant = constant || 0;

};

NDee.Plane.prototype = {

	constructor: NDee.Plane,

	set: function ( normal, constant ) {

		this.normal.copy( normal );
		this.constant = constant;

		return this;

	},

	setFromNormalAndCoplanarPoint: function ( normal, point ) {

		this.normal.copy( normal );
		this.constant = - point.dot( this.normal );

		return this;

	},

	copy: function ( plane ) {

		this.normal.copy( plane.normal );
		this.constant = plane.constant;

		return this;

	},

	normalize: function () {

		var inverseNormalLength = 1.0 / this.normal.length();
		this.normal.multiplyScalar( inverseNormalLength );
		this.constant *= inverseNormalLength;

		return this;

	},

	negate: function () {

		this.constant *= -1;
		this.normal.negate();

		return this;

	},

	distanceToPoint: function ( point ) {

		return this.normal.dot( point ) + this.constant;

	},

	distanceToSphere: function ( sphere ) {

		return this.distanceToPoint( sphere.center ) - sphere.radius;

	},

	projectPoint: function ( point, result ) {

		return this.orthoPoint( point, result ).sub( point ).negate();

	},

	orthoPoint: function ( point, result ) {

		var perpendicularMagnitude = this.distanceToPoint( point );

		var result = result || new NDee.Vector();
		return result.copy( this.normal ).multiplyScalar( perpendicularMagnitude );

	},

	equals: function ( plane ) {

		return plane.normal.equals( this.normal ) && ( plane.constant == this.constant );

	},

	clone: function () {

		return new NDee.Plane().copy( this );

	}

};