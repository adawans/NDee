/**
 * @author adawans
 */
 

NDee.Pow2Tree = function ( aabb, config, parent ) {

	this._aabb = aabb;
	this._parent = parent;
	this._items = [];
	this._children = null;
	this._config = config;
};


NDee.Pow2Tree.prototype = {

	constructor: NDee.Pow2Tree,

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
				this.split( new NDee.AABB().copy(this._aabb), 0 );
				var itemsCopy = this._items.slice( 0 );
				this._items.length = 0;
				for ( var i = 0; i < itemsCopy.length; i++ ) {
					this._add( itemsCopy[i] );
				}
				this._add( item );
			} else {
				this._items.push( item );
			}
		}

	},

	split: function ( box, n ) {

		if ( n < box.getN() ) {
			var spawn = new NDee.AABB().copy( box );
			box.max.coords[n] = box.min.coords[n] + ( box.max.coords[n] - box.min.coords[n] ) * 0.5;
			spawn.min.coords[n] = box.max.coords[n];

			this.split( box, n + 1 );
			this.split( spawn, n + 1 );
		} else {
			this._children.push( new NDee.Pow2Tree( box, this._config, this ) );
		}

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

		if ( this._aabb.distanceToPointSquared( query.point ) < ( query.maxDist * query.maxDist ) ) {
			for ( var i = 0; i < this._items.length; i++ ) {
				var distance = query.distanceTo( this._items[i], query.maxDist );
				if ( distance < query.maxDist ) {
					query.nearest = this._items[i];
					query.maxDist = distance;
				}
			}

			if ( this._children ) {
				var best = null;
				var bestDist = Infinity;
				for ( var i = 0; i < this._children.length && bestDist > 0; i++ ) {
					var distance = this._children[i]._aabb.distanceToPointSquared( query.point );
					if ( distance < bestDist ) {
						best = this._children[i];
						bestDist = distance;
					}
				}

				best.queryNearest( query );

				for ( var i = 0; i < this._children.length; i++ ) {
					if ( this._children[i] !== best ) {
						this._children[i].queryNearest( query );
					}
				}
			}
		}

	}

};