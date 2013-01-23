NDI.KDTree = function ( config, parent ) {

	this._aabb = new NDI.AABBND();
	this._parent = parent;
	this._items = [];
	this._children = null;
	this._config = config;

	if ( this._parent ) {
		this._aabb.copy( parent._aabb );
	} else {
		this._aabb.set( new NDI.VectorND( config.k ), new NDI.VectorND( config.k ) );
		this._aabb.min.fill( -Infinity );
		this._aabb.max.fill( Infinity );
	}

	this._dimension = parent ? parent._dimension + 1 : 0;
	if ( this._dimension >= this._config.k ) {
		this._dimension = 0;
	}
};


NDI.KDTree.prototype = {

	constructor: NDI.KDTree,

	add: function ( item ) {

		if ( this._config.collisionTest( this._aabb, item ) ) {
			this._add( item );
		}

	},

	_add: function ( item ) {

		if ( this._children ) {
			var collided = [];
			for ( var i = 0; i < this._children.length; i++ ) {
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
			this._items.push( item );

			if ( this._items.length >= this._config.maxCapacity ) {
				this.split( new NDI.AABBND().copy(this._aabb), 0 );
				var itemsCopy = this._items.slice( 0 );
				this._items = [];
				for ( var i = 0; i < itemsCopy.length; i++ ) {
					this._add( itemsCopy[i] );
				}
			}
		}

	},

	split: function () {
		
		var median = this._config.getMedian( this._items, this._dimension );
		
		var childLeft = new NDI.KDTree( this._config, this );
		var childRight = new NDI.KDTree( this._config, this );

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