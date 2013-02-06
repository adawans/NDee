
NDee.PlaneGeometry = function () {

	THREE.Geometry.call( this );
	var scope = this;
	
	this.materials = [];

	var planeLength = 1;
	var foldSpan = 0.15;
	var foldHeight = 0.2;
	var wingSpan = 0.3;
	
	//FOLD
	this.vertices.push(new THREE.Vector3(0, 0, -planeLength));
	this.vertices.push(new THREE.Vector3(0, 0, 0));
	this.vertices.push(new THREE.Vector3(foldSpan, foldHeight, -planeLength));

	this.vertices.push(new THREE.Vector3(0, 0, -planeLength));
	this.vertices.push(new THREE.Vector3(0, 0, 0));
	this.vertices.push(new THREE.Vector3(-foldSpan, foldHeight, -planeLength));

	this.vertices.push(new THREE.Vector3(0, 0, -planeLength));
	this.vertices.push(new THREE.Vector3(0, 0, 0));
	this.vertices.push(new THREE.Vector3(foldSpan, foldHeight, -planeLength));

	this.vertices.push(new THREE.Vector3(0, 0, -planeLength));
	this.vertices.push(new THREE.Vector3(0, 0, 0));
	this.vertices.push(new THREE.Vector3(-foldSpan, foldHeight, -planeLength));


	//WINGS
	this.vertices.push(new THREE.Vector3(0, 0, 0));
	this.vertices.push(new THREE.Vector3(foldSpan, foldHeight, -planeLength));
	this.vertices.push(new THREE.Vector3(foldSpan + wingSpan, foldHeight, -planeLength));

	this.vertices.push(new THREE.Vector3(0, 0, 0));
	this.vertices.push(new THREE.Vector3(-foldSpan, foldHeight, -planeLength));
	this.vertices.push(new THREE.Vector3(-foldSpan - wingSpan, foldHeight, -planeLength));

	this.vertices.push(new THREE.Vector3(0, 0, 0));
	this.vertices.push(new THREE.Vector3(foldSpan, foldHeight, -planeLength));
	this.vertices.push(new THREE.Vector3(foldSpan + wingSpan, foldHeight, -planeLength));
	
	this.vertices.push(new THREE.Vector3(0, 0, 0));
	this.vertices.push(new THREE.Vector3(-foldSpan, foldHeight, -planeLength));
	this.vertices.push(new THREE.Vector3(-foldSpan - wingSpan, foldHeight, -planeLength));

	
	var face = new THREE.Face3( 0, 1, 2 );
	this.faces.push(face);

	face = new THREE.Face3( 3, 5, 4 );
	this.faces.push(face);

	face = new THREE.Face3( 8, 7, 6 );
	this.faces.push(face);

	face = new THREE.Face3( 10, 11, 9 );
	this.faces.push(face);

	face = new THREE.Face3( 12, 14, 13 );
	this.faces.push(face);

	face = new THREE.Face3( 15, 16, 17 );
	this.faces.push(face);

	face = new THREE.Face3( 19, 20, 18 );
	this.faces.push(face);

	face = new THREE.Face3( 23, 22, 21 );
	this.faces.push(face);


	//face = new THREE.Face3(3,1,0);
	// face.normal = new THREE.Vector3(0, 1, 0) ;
	// face.vertexNormals.push( face.normal.clone(), face.normal.clone(), face.normal.clone(), face.normal.clone() );
	//this.faces.push(face);
	
	// face = new THREE.Face3(0, 3, 2);
	// face.normal = new THREE.Vector3(0, 1, 0) ;
	// face.vertexNormals.push( face.normal.clone(), face.normal.clone(), face.normal.clone(), face.normal.clone() );
	// this.faces.push(face);

	// face = new THREE.Face3(0, 2, 3);
	// face.normal = new THREE.Vector3(0, -1, 0) ;
	// face.vertexNormals.push( face.normal.clone(), face.normal.clone(), face.normal.clone(), face.normal.clone() );
	// this.faces.push(face);

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();
	this.mergeVertices();

};

NDee.PlaneGeometry.prototype = Object.create( THREE.Geometry.prototype );
