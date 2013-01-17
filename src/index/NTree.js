NDI.NTree = function ( aabb, parent, maxCapacity, collides ) {

	this.aabb = aabb;
	this.parent = parent;
	this.maxCapacity = maxCapacity;
	this.collides = collides;
	this.items = [];
	this.children = null;
};


NDI.NTree.prototype = {

	constructor: NDI.NTree,

	add: function ( item ) {

		if ( this.collides( this.aabb, item ) ) {
			if ( this.children ) {
				for ( var i = 0; i < this.children.length; i++ ) {
					this.children[i].add( item );
				}
			} else {
				if ( this.items.length >= this.maxCapacity ) {
					this.split( new NDI.AABBND().copy(this.aabb), 0 );
					for ( var j = 0; j < this.items.length; j++ ) {
						this.add( this.items[i] );
					}
					this.add( item );
					this.items = [];
				} else {
					this.items.push( item );
				}
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
			this.children.push( new NDI.NTree( box, this, this.maxCapacity, this.collides ) );
		}

	}

};