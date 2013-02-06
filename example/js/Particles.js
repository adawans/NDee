var particles = [];
var colliders = [];
var tree = null;

var materialModel = new THREE.MeshLambertMaterial( {color:0x76BDDA} );
//materialModel.opacity = 0.2;

function initParticles() {

	var cube = new NDee.PlaneGeometry ( 0.5, 0.5, 0.5 );		
	material = new THREE.MeshPhongMaterial( {color:0xEEFFFF, specular:0xFFFFFF , shininess: 0 ,perPixel: false} );

	for (var i = 0; i < 800; i++) {
		var mesh = new THREE.Mesh( cube, material );

		mesh.position.x = ( Math.random() - 0.5 ) * 100;
		mesh.position.y = ( Math.random() - 0.5 ) * 100;
		mesh.position.z = ( Math.random() - 0.5 ) * 100;

		mesh.matrixAutoUpdate = false;
		mesh.updateMatrix();

		scene.add( mesh );

		var particle = {};
		particle.mesh = mesh;
		particle.velocity = new THREE.Vector3((Math.random()-1) * 8, (Math.random()-1) * 8, (Math.random()-1) * 8) ;
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
		"medianBounds": new NDee.AABB( new NDee.Vector( 3 ),  new NDee.Vector( 3 ) ),
		"medianVect": new NDee.Vector( 3 ),
		"getMedian": function ( items, dimension ) {
			var bounds = this.medianBounds;
			bounds.makeEmpty()
			for ( var i = items.length; i--; ) {
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
	for ( var i = geometry.vertices.length; i--; ) {
		vert = geometry.vertices[i];
		var vect = new THREE.Vector3( vert.x , vert.y, vert.z ).multiplyScalar( 25 );
		vect.isMesh = true;
		tree.add( vect );
		colliders.push(vect);
	}

	for ( var i = particles.length; i--; ) {
		tree.add( particles[i].mesh.position );
	}

	// var originalMesh = new THREE.Mesh( geometry,  materialModel  );
	// originalMesh.scale.x = originalMesh.scale.y = originalMesh.scale.z = 23;
	// scene.add( originalMesh );
}

function updateParticles() {

	var query = {
		"bounds": new NDee.AABB( new NDee.Vector( 3 ),  new NDee.Vector( 3 ) ),
		"buffer": new NDee.Vector( 3 ),
		"collides": function ( aabb ) {
			return aabb.isIntersectionAABB( this.bounds );
		},
		"results": [],
		"addResults": function(items) {
			var min = this.bounds.min.coords;
			var max = this.bounds.max.coords;
			var item;
			for ( var i = items.length; i--; ) {
				item = items[i];
				var outside = 	item.x < min[0] ||
								item.x > max[0] ||
								item.y < min[1] ||
								item.y > max[1] ||
								item.z < min[2] ||
								item.z > max[2];
				if ( !outside ) {
					this.results.push( item );
				}
			}
		}
	};
	
	for ( var i = particles.length; i--; ) {
		var pos = particles[i].mesh.position;
		var radius = Math.random() * 7;
		query.bounds.min.set( pos.x - radius , pos.y - radius, pos.z - radius );
		query.bounds.max.set( pos.x + radius , pos.y + radius, pos.z + radius );
		query.results = [];

		if ( radius > 0.1 ) {
			tree.queryCollision( query );
			//query.addResults( colliders );
		}
			
		updateParticle( particles[i], query.results );
	}
}

function updateParticle( particle, neighbors ) {
	var buffer = new THREE.Vector3( 3 );
	var oldPos = new THREE.Vector3( 3 ).copy( particle.mesh.position );

	var mesh = particle.mesh;
	var position = particle.mesh.position;
	var velocity = particle.velocity;
	var veloLength = velocity.length();

	buffer.copy(position).multiplyScalar(-Math.sqrt(mesh.position.length()) / 5000);
	velocity.add(buffer, velocity);

	var bestDirection = new THREE.Vector3( 0, 0, 0 );
	var bestCos = Infinity;
	var bestDist = 2;
	var isMesh = false;
	for ( var i = 0; i < neighbors.length; i++ ) {
		if ( !isMesh || neighbors[i].isMesh ) {
			buffer.copy( neighbors[i] );
			buffer.sub( mesh.position, buffer );

			var dot = buffer.dot( velocity );
			if ( dot < 0.3 ) {
				var cos = dot / buffer.length() / veloLength;
				if ( cos < bestCos || ( neighbors[i].isMesh && !isMesh ) ) {
					bestCos = cos;
					bestDirection.copy( buffer );
					isMesh = neighbors[i].isMesh;
				}
			}
		}
	}

	if ( isMesh ) {
		if ( mesh.scale.x < 0.9 )
			mesh.scale.multiplyScalar( 1.0009 );
	} else {
		if ( mesh.scale.x > 0.4 )
			mesh.scale.multiplyScalar( 0.9985 );
	}

	bestDirection.multiplyScalar( isMesh ? -0.1 : -0.1 );
	velocity.add( bestDirection, velocity );

	velocity.setLength( veloLength );

	buffer.copy( velocity ).multiplyScalar( 0.02 );
	mesh.position.add(buffer, mesh.position);

	var matrix = new THREE.Matrix4();
	matrix.extractRotation( mesh.matrix );
	var direction = new THREE.Vector3( 0, 0, 1 );
	matrix.multiplyVector3( direction );

	buffer.copy(mesh.position);
	buffer.add(velocity, buffer);
	buffer.add(direction.multiplyScalar( 80 ), buffer);
	mesh.lookAt(buffer);

	mesh.updateMatrix();

	tree.move( mesh.position, oldPos );
}