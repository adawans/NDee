/**
 * @author adawans
 */


 NDee.AABB = function ( min, max ) {

	this.min = min || new NDee.Vector();
	this.max = max || new NDee.Vector();

};


NDee.AABB.__v1 = new NDee.Vector();


NDee.AABB.prototype = {

	constructor: NDee.AABB,

	getN: function () {

		return this.min.getN();

	},

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	copy: function ( aabb ) {

		this.min.copy( aabb.min );
		this.max.copy( aabb.max );

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
			if ( point.coords[i] < this.min.coords[i] || point.coords[i] > this.max.coords[i] ) {
				return false;
			}
		}

		return true;

	},

	containsAABB: function ( aabb ) {

		for ( var i = 0; i < this.min.getN(); i++ ) {
			if ( aabb.min.coords[i] < this.min.coords[i] || aabb.max.coords[i] > this.max.coords[i] ) {
				return false;
			}
		}

		return true;

	},

	isIntersectionAABB: function ( aabb ) {

		for ( var i = 0; i < this.min.getN(); i++ ) {
			if ( aabb.max.coords[i] < this.min.coords[i] || aabb.min.coords[i] > this.max.coords[i] ) {
				return false;
			}
		}

		return true;

	},

	isIntersectionSphere: function ( sphere ) {

		for ( var i = 0; i < this.min.getN(); i++ ) {
			if ( sphere.center.coords[i] + sphere.radius < this.min.coords[i] || 
				sphere.center.coords[i] - sphere.radius > this.max.coords[i] ) {
				return false;
			}
		}

		buffer = NDee.AABB.__v1;
		buffer = this.clampPoint( buffer.copy( sphere.center ) );
		return buffer.distanceTo( sphere.center ) <= sphere.radius ;

	},

	clampPoint: function ( point ) {

		return point.clamp( this.min, this.max );

	},

	distanceToPoint: function ( point ) {

		return Math.sqrt( this.distanceToPointSquared(point) );

	},

	distanceToPointSquared: function ( point ) {

		var buffer = NDee.AABB.__v1.copy( point );
		return this.clampPoint( buffer ).sub( point ).lengthSq();

	},


	intersect: function ( aabb ) {

		this.min.max( aabb.min );
		this.max.min( aabb.max );

		return this;

	},

	union: function ( aabb ) {

		this.min.min( aabb.min );
		this.max.max( aabb.max );

		return this;

	},

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( aabb ) {

		return aabb.min.equals( this.min ) && aabb.max.equals( this.max );

	},

	clone: function () {

		return new NDee.AABB().copy( this );

	}

};