NDI.NTree = function ( aabb, config, parent ) {

	this._aabb = aabb;
	this._parent = parent;
	this._items = [];
	this._children = null;
	this._config = config;
};


NDI.NTree.prototype = {

	constructor: NDI.NTree,

	add: function ( item ) {

		if ( this._config.collisionTest( this._aabb, item ) ) {
			this._add( item );
		}

	},

	_add: function ( item ) {

		if ( this._children ) {
			var collided = [];
			for ( var i = 0; i < this._children.length && collided.length < 2; i++ ) {
				if ( this._config.collisionTest( this._children[i]._aabb, item ) ) {
					collided.push( this._children[i] );
				}
			}

			if ( collided.length === 1 ) {
				collided[0]._add( item );
			} else {
				this._items.push( item );
			}
		} else {
			if ( this._items.length >= this._config.maxCapacity ) {
				this._children = [];
				this.split( new NDI.AABBND().copy(this._aabb), 0 );
				var itemsCopy = this._items.slice( 0 );
				this._items = [];
				for ( var j = 0; j < itemsCopy.length; j++ ) {
					this._add( itemsCopy[j] );
				}
				this._add( item );
			} else {
				this._items.push( item );
			}
		}

	},

	split: function ( box, n ) {

		if ( n < box.getN() ) {
			var spawn = new NDI.AABBND().copy( box );
			box.max.coords[n] = box.min.coords[n] + ( box.max.coords[n] - box.min.coords[n] ) * 0.5;
			spawn.min.coords[n] = box.max.coords[n];

			this.split( box, n + 1 );
			this.split( spawn, n + 1 );
		} else {
			this._children.push( new NDI.NTree( box, this._config, this ) );
		}

	},

	clear: function () {

		this._items = [];
		this._children = null;

	},

	queryCollision: function ( query ) {

		if ( query.collides( this._aabb ) ) {
			query.addResults(this._items);

			if ( this._children ) {
				for ( var i = 0; i < this._children.length; i++ ) {
					this._children[i].queryCollision( query );
				}
			}
		}

	},

	queryNearest: function ( query ) {

		if ( ! query.maxDist ) {
			query.maxDist = Infinity;
		}

		if ( this._aabb.distanceToPoint( query.point ) < query.maxDist ) {
			for ( var i = 0; i < this._items.length; i++ ) {
				var distance = query.distanceTo( this._items[i] );
				if ( distance < query.maxDist ) {
					query.nearest = this._items[i];
					query.maxDist = distance;
				}
			}

			if ( this._children ) {
				var sorted = [];
				for ( var i = 0; i < this._children.length; i++ ) {
					var weighed = {};
					weighed.child = this._children[i];
					weighed.distance = this._children[i]._aabb.distanceToPoint( query.point );
					sorted.push( weighed );
				}

				sorted.sort

				this._children.sort( function( a, b ) {
					return a.distance - b.distance;
				} );

				for ( var i = 0; i < sorted.length; i++ ) {
					sorted[i].child.queryNearest( query );
				}
			}
		}

	}

};