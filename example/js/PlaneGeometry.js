
NDee.PlaneGeometry = function () {

	THREE.Geometry.call( this );
	var scope = this;
	
	this.materials = [];
	
	this.vertices.push(new THREE.Vector3(0, 0, 0));
	this.vertices.push(new THREE.Vector3(0.5, 0.5, 0));
	this.vertices.push(new THREE.Vector3(-0.5, 0.5, 0));
	this.vertices.push(new THREE.Vector3(0, 0, 1));
	this.vertices.push(new THREE.Vector3(0, 0, 0));
	this.vertices.push(new THREE.Vector3(0.5, 0.5, -0.1));
	this.vertices.push(new THREE.Vector3(-0.5, 0.5, -0.1));
	this.vertices.push(new THREE.Vector3(0, 0, 1));
	
	var face = new THREE.Face3( 4, 5, 7 );
	this.faces.push(face);

	face = new THREE.Face3( 7, 6, 4 );
	this.faces.push(face);

	face = new THREE.Face3( 3, 1, 0 );
	this.faces.push(face);

	face = new THREE.Face3( 0, 2, 3 );
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
	//this.computeVertexNormals();
	this.mergeVertices();

};

NDee.PlaneGeometry.prototype = Object.create( THREE.Geometry.prototype );
