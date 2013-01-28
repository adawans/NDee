/**
 * @author adawans
 */


NDee.KDTree = function ( config, parent ) {

	this._aabb = new NDee.AABB();
	this._parent = parent;
	this._items = [];
	this._children = null;
	this._config = config;

	if ( this._parent ) {
		this._aabb.copy( parent._aabb );
	} else {
		this._aabb.set( new NDee.Vector( config.k ), new NDee.Vector( config.k ) );
		this._aabb.min.fill( -Infinity );
		this._aabb.max.fill( Infinity );
	}

	this._dimension = parent ? parent._dimension + 1 : 0;
	if ( this._dimension >= this._config.k ) {
		this._dimension = 0;
	}
};


NDee.KDTree.prototype = {

	constructor: NDee.KDTree,

	add: function ( item ) {

		if ( this._config.collisionTest( this._aabb, item ) ) {
			this._add( item );
			return true;
		}

		return false;

	},

	_add: function ( item ) {

		if ( this._children ) {
			if ( this._config.collisionTest( this._children[0]._aabb, item ) ) {
				if ( this._config.collisionTest( this._children[1]._aabb, item ) ) {
					this._items.push( item );
				} else {
					this._children[0]._add( item );
				}
			} else {
				if ( this._config.collisionTest( this._children[1]._aabb, item ) ) {
					this._children[1]._add( item );
				} else {
					this._items.push( item );
				}
			}
		} else {
			this._items.push( item );

			if ( this._items.length >= this._config.maxCapacity ) {
				this._split( new NDee.AABB().copy(this._aabb), 0 );
				var itemsCopy = this._items.slice( 0 );
				this._items.length = 0;
				for ( var i = 0; i < itemsCopy.length; i++ ) {
					this._add( itemsCopy[i] );
				}
			}
		}

	},

	_split: function () {
		
		var median = this._config.getMedian( this._items, this._dimension );
		
		var childLeft = new NDee.KDTree( this._config, this );
		var childRight = new NDee.KDTree( this._config, this );

		childLeft._aabb.max.coords[this._dimension] = median;
		childRight._aabb.min.coords[this._dimension] = median;

		this._children = [childLeft, childRight];

	},

	remove: function ( item ) {

		if ( this._config.collisionTest( this._aabb, item ) ) {
			for ( var i = 0; i < this._items.length; i++ ) {
				if ( this._items[i] === item ) {
					this._items.splice(i, 1);
					this._cleanup();
					return true;
				}
			}

			for ( var i = 0; i < this._children.length; i++ ) {
				if ( this._children[i].remove( item ) ) {
					return true;
				}
			}

			return false;
		}

	},

	move: function ( item, oldVersion ) {

		if ( this._config.collisionTest( this._aabb, oldVersion ) ) {
			var found = false;
			for ( var i = 0; i < this._items.length; i++ ) {
				if ( this._items[i] === item ) {
					if ( this._config.collisionTest( this._aabb, item ) ) {
						return;
					}

					this._items.splice(i, 1);
					this._cleanup();

					var parent = this._parent;
					while ( parent != null && !parent.add( item ) ) {
						parent = parent._parent;
					}
					return;
				}
			}

			for ( var i = 0; i < this._children.length; i++ ) {
				if ( this._children[i].move( item, oldVersion ) ) {
					return;
				}
			}
		}

	},

	clear: function () {

		this._items = [];
		this._children = null;

	},

	_cleanup: function () {

		for ( var i = 0; this._children && i < this._children.length; i++ ) {
			if ( this._children[i]._items.length > 0 || this._children[i]._children ) {
				return;
			}
		}

		this._children = null;
		if ( this._items.length == 0 && this._parent ) {
			this._parent._cleanup();
		}
	},

	queryCollision: function ( query ) {

		if ( query.collides( this._aabb ) ) {
			if ( this._items.length > 0 ) {
				query.addResults(this._items);
			}

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

				sorted.sort( function( a, b ) {
					return a.distance - b.distance;
				} );

				for ( var i = 0; i < sorted.length; i++ ) {
					sorted[i].child.queryNearest( query );
				}
			}
		}

	}

};