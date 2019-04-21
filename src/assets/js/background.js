
// Basic //
var scene = new THREE.Scene();

var frustumSize = 1000;
var aspect = innerWidth / innerHeight;

var camera = new THREE.OrthographicCamera(
	frustumSize * aspect / - 2, 
	frustumSize * aspect / 2, 
	frustumSize / 2, 
	frustumSize / - 2, 
	-100, 1000
);

camera.position.z = 2;

var renderer = new THREE.WebGLRenderer({antialias:true});

renderer.setClearColor("#ffffff");

renderer.setSize( innerWidth, innerHeight );

document.body.appendChild( renderer.domElement );


// Resize //
window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
	var aspect = window.innerWidth / window.innerHeight;

	camera.left = frustumSize * aspect / - 2;
	camera.right = frustumSize * aspect / 2;
	camera.top = frustumSize / 2;
	camera.bottom = frustumSize / - 2;
	
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


// // Light //
// var ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

// var spotLight = new THREE.SpotLight(0xe2e2e2);
// spotLight.position.set(0, 2, 5);
// spotLight.castShadow = true;
// spotLight.shadow.mapSize.width = 2048; // Shadow Quality
// spotLight.shadow.mapSize.height = 2048; // Shadow Quality
// scene.add(spotLight);

// Donut //
// var geometry = new THREE.TorusBufferGeometry(40,10,20,100) ;
// var material = new THREE.MeshBasicMaterial( { color: "#e2e2e2" } );
// var donut = new THREE.Mesh( geometry, material );

// scene.add( donut );

// TweenMax.set(donut.position,{x:200,y:200})


// Mouse, Raycaster
// var raycaster = new THREE.Raycaster();
// var mouse = new THREE.Vector2();

// function onMouseMove( event ) {
// 	camera.position.y=(((event.x - innerWidth / 2) / innerWidth) * 2)*Math.PI/16;
// }


// window.addEventListener( 'mousemove', onMouseMove, false );





// Atom Geometry, By Don Pinkus, codepen
function createTorus(r, tubeD, radialSegs, tubularSegs, arc, color, rotationX){
	var geometry = new THREE.TorusGeometry(r, tubeD, radialSegs, tubularSegs, arc);
	var material = new THREE.MeshBasicMaterial({ color: color });
	var torus = new THREE.Mesh(geometry, material);
	torus.rotation.x = rotationX;
	return torus;
}

function createSphere(params){
	var geometry = new THREE.SphereGeometry(params.r, 50, 50 );
	var material = new THREE.MeshBasicMaterial({
	  color: params.color,
	  });
	var sphere = new THREE.Mesh( geometry, material );
  
	sphere.position.x = params.x || 0;
	sphere.position.y = params.y || 0;
  
	return sphere;
}


function createValence(ringNumber, electronCount){
	var radius = 20 + 20 * ringNumber;
  
	var ring = createTorus(
	  radius,
	  1,
	  20,
	  100,
	  Math.PI * 2,
	  0xe6e6e6,
	  0
	);
  
	var electrons = [];
  
	var angleIncrement = (Math.PI * 2) / electronCount;
	var angle = 0;
  
	for (var i = 0; i < electronCount; i++) {
	  // Solve for x and y.
	  var posX = radius * Math.cos(angle);
	  var posY = radius * Math.sin(angle);
  
	  angle += angleIncrement;
  
	  var electron = createSphere({ r: 5, x: posX, y: posY, color: 0xD6D6D6 });
	  electrons.push(electron);
	}

	var group = new THREE.Group();

	group.add(ring);

	electrons.forEach(function(electron){
		group.add(electron);
	});
	
	return group;
}

var nucleus = createSphere({ r: 22 ,color: 0xbdbdbd });
scene.add(nucleus);

var shellCounts = [2,3];

var valences = [];

for (var i = 1; i <= shellCounts.length; i++) {
	var shellCountIndex = (i - 1) % shellCounts.length;
	var v = createValence(i, shellCounts[shellCountIndex]);

	valences.push(v);

	scene.add(v);
}

var baseRotation = 0.01;


nucleus.position.set(-200,300,0)
valences.forEach(function(v){
	v.position.set(-200,300,0);
});


// valences.forEach(function(v){
// 	TweenMax.to(v.position,3,{ease: Power1.easeInOut,y:200,x:-150,repeat:-1,yoyo:true})
// });
// TweenMax.to(nucleus.position,3,{ease: Power1.easeInOut,y:200,x:-150,repeat:-1,yoyo:true})


// Horizontal Line //
// var Lines=new THREE.Object3D();;

// function createLine(x,y,z){

// 	var material = new THREE.LineBasicMaterial({
// 		color: 0xb2b2b2
// 	});
// 	var geometry = new THREE.Geometry();
// 	for( var i = 0; i < 200000 ; i++ ) {
    
// 		var v = new THREE.Vector3( -10+i*.1+x,
//                               Math.sin(y*i), 
//                               Math.cos(z*i));
// 		geometry.vertices.push( v );
// 	}
// 	var line = new THREE.Line( geometry, material );

// 	Lines.add(line);
// }

// // Create Horizontal Lines
// for(var i=0;i<25;i++){
// 	createLine(i/5,0.08,0.08);
// }

// scene.add(Lines);

// render //
var render = function () {
	requestAnimationFrame( render );


	valences.forEach(function(v, i){
		v.rotation.x += baseRotation - (i * 0.001);
		v.rotation.y += baseRotation - (i * 0.001);
		v.rotation.z += baseRotation*2 - (i * 0.001);
	})

	// for(var i=0;i<Lines.children.length;i++){
	// 	Lines.children[i].rotation.x+=0.01;

	// }

	// raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray
	// var intersects = raycaster.intersectObjects( scene.children );
	// for ( var i = 0; i < intersects.length; i++ ) {
	// 	intersects[ i ].object.position.x+=1;
	// }

  renderer.render(scene, camera);
};

render();


