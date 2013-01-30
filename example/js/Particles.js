var particles = [];
var colliders = [];
var tree = null;
var model = null;

function initParticles( scene ) {

	var sphere = new THREE.CubeGeometry ( 0.5, 0.5, 0.5 );		
	material = new THREE.MeshPhongMaterial( {color:0xEEFFFF, specular:0xFFFFFF , shininess: 0 ,perPixel: false} );

	for (var i = 0; i < 1200; i++) {
		var mesh = new THREE.Mesh( sphere, material );

		mesh.position.x = Math.random() * 100;
		mesh.position.y = Math.random() * 100;
		mesh.position.z = Math.random() * 100;

		mesh.matrixAutoUpdate = false;
		mesh.updateMatrix();

		scene.add( mesh );

		var particle = {};
		particle.mesh = mesh;
		particle.velocity = new THREE.Vector3((Math.random()-1) * 10, (Math.random()-1) * 10, (Math.random()-1) * 10);
		particles.push(particle);
	}

	var config = {
		"k": 3,
		"maxCapacity": 20,
		"collisionTest": function ( aabb, v ) {
			return 	v.x >= aabb.min.coords[0] && v.x <= aabb.max.coords[0] &&
					v.y >= aabb.min.coords[1] && v.y <= aabb.max.coords[1] &&
					v.z >= aabb.min.coords[2] && v.z <= aabb.max.coords[2];
		},
		"medianBounds": new NDee.AABB( new NDee.Vector( 0, 0, 0 ),  new NDee.Vector( 0, 0, 0 ) ),
		"medianVect": new NDee.Vector( 0, 0, 0 ),
		"getMedian": function ( items, dimension ) {
			var bounds = this.medianBounds;
			bounds.makeEmpty()
			for ( var i = 0; i < items.length; i++ ) {
				this.medianVect.set(items[i].x, items[i].y, items[i].z);
				bounds.expandByPoint( this.medianVect );
			}

			return bounds.min.coords[dimension] + ( ( bounds.max.coords[dimension] - bounds.min.coords[dimension] ) * 0.5 );
		}
	};

	tree = new NDee.KDTree( config );

	var loader = new THREE.JSONLoader();
	loader.load( "model/testModel.js", onModelLoaded);
}

function onModelLoaded( geometry ) {
	model = geometry;
	for ( var i = 0; i < geometry.vertices.length; i++ ) {
		vert = geometry.vertices[i];
		var vect = new THREE.Vector3( vert.x * 30 , vert.y * 30, vert.z * 30 );
		tree.add( vect );
		colliders.push(vect);
	}

	// originalMesh = new THREE.Mesh( geometry,  material  );
	// originalMesh.scale.x = originalMesh.scale.y = originalMesh.scale.z = 15;
	// scene.add( originalMesh );
}

function updateParticles() {

	var query = {
		"bounds": new NDee.Sphere( new NDee.Vector( 0, 0, 0 ),  5 ),
		"buffer": new NDee.Vector( 0, 0, 0 ),
		"collides": function ( aabb ) {
			return aabb.isIntersectionSphere( this.bounds );
		},
		"results": [],
		"addResults": function(items) {
			for ( var i = 0; i < items.length; i++ ) {
				var outside = 	items[i].x < this.bounds.center.coords[0] - this.bounds.radius ||
								items[i].x > this.bounds.center.coords[0] + this.bounds.radius ||
								items[i].y < this.bounds.center.coords[1] - this.bounds.radius ||
								items[i].y > this.bounds.center.coords[1] + this.bounds.radius ||
								items[i].z < this.bounds.center.coords[2] - this.bounds.radius ||
								items[i].z > this.bounds.center.coords[2] + this.bounds.radius;
				if ( !outside ) {
					this.results.push( items[i] );
				}
			}
		}
	};
	
	for ( var i = 0; i < particles.length; i++ ) {
		var pos = particles[i].mesh.position;
		query.bounds.center.set( pos.x, pos.y, pos.z );
		query.bounds.radius = Math.random() * 15;
		query.results = [];
		tree.queryCollision( query );
		// for ( var j = 0; j < colliders.length; j++ ) {
		// 	query.addResults( colliders[j] );
		// }
		updateParticle( particles[i], query.results );
	}
}

function updateParticle( particle, neighbors ) {
	var buffer = new THREE.Vector3( 0, 0, 0 );

	var mesh = particle.mesh;
	var position = particle.mesh.position;
	var velocity = particle.velocity;
	var veloLength = velocity.length();

	buffer.copy(position).multiplyScalar(-Math.sqrt(mesh.position.length()) / 5000);
	velocity.add(buffer, velocity);

	var bestDirection = new THREE.Vector3( 0, 0, 0 );
	var bestCos = Infinity;
	var bestDist = 2;
	for ( var i = 0; i < neighbors.length; i++ ) {
		buffer.copy( neighbors[i] );
		buffer.sub( mesh.position, buffer );

		var dot = buffer.dot( velocity );
		if ( dot < 0 ) {
			var cos = dot / buffer.length() / veloLength;
			if ( cos < bestCos ) {
				bestCos = cos;
				bestDirection.copy( buffer );
			}
		}
	}

	if ( neighbors.length > 0 ) {
		if ( mesh.scale.x < 1 )
			mesh.scale.multiplyScalar( 1.0005 );
	} else {
		if ( mesh.scale.x > 0.2 )
			mesh.scale.multiplyScalar( 0.9985 );
	}

	bestDirection.multiplyScalar(-0.2);
	velocity.add( bestDirection, velocity );

	buffer.copy( velocity ).multiplyScalar( 0.02 );
	mesh.position.add(buffer, mesh.position);

	buffer.copy(mesh.position);
	buffer.add(velocity, buffer);
	mesh.lookAt(buffer);

	velocity.setLength( veloLength );
	mesh.updateMatrix();

}