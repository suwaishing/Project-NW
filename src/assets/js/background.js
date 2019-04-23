
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

camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({antialias:true});

renderer.setClearColor("#f5f5f5");

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


// Create Molocule 1
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

var moloculePositionX=Math.random()*200+300;
var moloculePositionY=Math.random()*200+300;

nucleus.position.set(-moloculePositionX,moloculePositionY,0)
valences.forEach(function(v){
	v.position.set(-moloculePositionX,moloculePositionY,0);
});

// Molocule 1 animation
valences.forEach(function(v){
	TweenMax.to(v.position,2,{ease: Sine.easeOut,y:v.position.y-75,x:v.position.x+75})
});
TweenMax.to(nucleus.position,2,{ease: Sine.easeOut,y:nucleus.position.y-75,x:nucleus.position.x+75})


// Create Molocule 2
var nucleus02 = createSphere({ r: 18 ,color: 0xbdbdbd });
scene.add(nucleus02);

var shellCounts = [3];

var valences02 = [];

for (var i = 1; i <= shellCounts.length; i++) {
	var shellCountIndex = (i - 1) % shellCounts.length;
	var v = createValence(i, shellCounts[shellCountIndex]);

	valences02.push(v);

	scene.add(v);
}

var moloculePositionX=Math.random()*200+300;
var moloculePositionY=Math.random()*200+300;

nucleus02.position.set(moloculePositionX,-moloculePositionY,0)
valences02.forEach(function(v){
	v.position.set(moloculePositionX,-moloculePositionY,0);
});

// Molocule 2 animation
valences02.forEach(function(v){
	TweenMax.to(v.position,2,{ease: Sine.easeOut,y:v.position.y+75,x:v.position.x-75})
});
TweenMax.to(nucleus02.position,2,{ease: Sine.easeOut,y:nucleus02.position.y+75,x:nucleus02.position.x-75})


// Create Line between

pivots=[];

// Create Shitty Molecules 
for(i=0;i<1;i++){
	var Molecule = new THREE.Object3D();

	var geometry = new THREE.SphereBufferGeometry( 8, 32, 32 );
	var material = new THREE.MeshBasicMaterial( { color: 0xBDBDBD } );
	var sphere01 = new THREE.Mesh( geometry, material );
	var sphere02 = new THREE.Mesh( geometry, material );
	var sphere03 = new THREE.Mesh( geometry, material );
	var sphere04 = new THREE.Mesh( geometry, material );
	var randomx = Math.random()*200+300 * (Math.random() < 0.5 ? -1 : 1);
	var randomy = Math.random()*200+300 * (Math.random() < 0.5 ? -1 : 1);
	sphere01.position.set(randomx,randomy,0);
	sphere02.position.set(randomx+(15*1.732),randomy-15,0);
	sphere03.position.set(randomx,randomy+(15*1.732),0);
	sphere04.position.set(randomx-(15*1.732),randomy-15,0);

	var material = new THREE.LineBasicMaterial({
		color: 0xbdbdbd,
	});

	var sphereG = new THREE.Geometry();
	sphereG.vertices.push(
		sphere01.position,
		sphere02.position
	);
	var sphereL = new THREE.Line( sphereG, material );
	Molecule.add(sphereL);

	var sphereG = new THREE.Geometry();
	sphereG.vertices.push(
		sphere01.position,
		sphere03.position
	);
	var sphereL = new THREE.Line( sphereG, material );
	Molecule.add(sphereL);

	var sphereG = new THREE.Geometry();
	sphereG.vertices.push(
		sphere01.position,
		sphere04.position
	);
	var sphereL = new THREE.Line( sphereG, material );
	Molecule.add(sphereL);

	Molecule.add(sphere01)
	Molecule.add(sphere02)
	Molecule.add(sphere03)
	Molecule.add(sphere04)

	var pivot = new THREE.Group();
	scene.add(pivot);
	pivot.add(Molecule);
	Molecule.position.set(-randomx,-randomy,0)
	pivot.position.set(randomx,randomy,0)
	pivots.push(pivot);
}

// valences02.forEach(function(v){
// 	TweenMax.to(v.position,2,{ease: Sine.easeOut,y:v.position.y+75,x:v.position.x-75})
// });
// TweenMax.to(nucleus02.position,2,{ease: Sine.easeOut,y:nucleus02.position.y+75,x:nucleus02.position.x-75})

pivots.forEach(function(v,i){

	if(v.position.x>0){
		TweenMax.to(v.position,2,{ease: Sine.easeOut,x:v.position.x-75})
	} else {
		TweenMax.to(v.position,2,{ease: Sine.easeOut,x:v.position.x+75})
	}
	if(v.position.y>0){
		TweenMax.to(v.position,2,{ease: Sine.easeOut,y:v.position.y-75})
	} else {
		TweenMax.to(v.position,2,{ease: Sine.easeOut,y:v.position.y+75})
	}
})


// Box Group
// var BoxGroup = new THREE.Object3D();
// var BoxArray = [];

// var geometry = new THREE.BoxBufferGeometry( 50, 50, 10 );
// var material = new THREE.MeshBasicMaterial( {color: 0xdbdbdb} );
// var cube = new THREE.Mesh( geometry, material );

// BoxGroup.add(cube);
// var geometry = new THREE.BoxBufferGeometry( 25, 25, 10.01 );
// var material = new THREE.MeshBasicMaterial( {color: 0xf5f5f5} );
// var cube = new THREE.Mesh(geometry,material);

// BoxGroup.add(cube);
// scene.add(BoxGroup);
// BoxArray.push(BoxGroup);

var Colors = [
	0x8c9eff,
	0xc0cfff,
	0x5870cb,
	0xb388ff,
	0xe7b9ff,
	0x805acb,
];
// Sphere Group
var SphereArray = [];
function SpherePosition(radius,x,y) {
	this.radius=radius;
	this.x=x;
	this.y=y;
}
var SphereInforArray = [];

var protection = 1000;
var counter = 0;
while(SphereInforArray.length<30 && counter < protection){
	
	var radius = Math.random()*7+5;

	var geometry = new THREE.SphereBufferGeometry( radius, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: Colors[Math.floor(Math.random()*5)]} );
	var sphere = new THREE.Mesh( geometry, material );

	var x = (Math.random()*950) * (Math.random() < 0.5 ? -1 : 1) ;
	var y = (Math.random()*400+200) * (Math.random() < 0.5 ? -1 : 1) ;
	
	var overlay=false;
	
	SphereInforArray.forEach(function(v,i){
		if(distance(x,y,v.x,v.y)<100){
			overlay=true;
		}
	})

	if(overlay==false){
		sphere.position.set(x,y,0);
		SphereInforArray.push(new SpherePosition(radius,x,y));
		scene.add(sphere);
		SphereArray.push(sphere);
	}
	counter++;
}

function distance(x,y,vx,vy){
	var dx = x-vx;
	var dy = y-vy;
	return Math.sqrt(dx*dx + dy * dy)
}

var baseRotation = 0.005;
var pivotRotation = 0.007;
var RingThetaLength=0;
var RingThetaSpeed=0.1;
var Theta=0;

// render //
var render = function () {
	requestAnimationFrame( render );
	geometry.verticesNeedUpdate = true

	// BoxGroup.rotation.x+=0.01;
	// BoxGroup.rotation.y+=0.005;



	// Group Ring
	// RingThetaLength+=RingThetaSpeed;
	// if(RingThetaLength>40||RingThetaLength<-40){
	// 	RingThetaSpeed=-RingThetaSpeed;
	// }
	// if(RingThetaLength<6.3){
	// 	Theta=RingThetaLength;
	// } else {
	// 	Theta=6.3;
	// }
	// RingArray.forEach(function(v,i){
	// 	v.geometry.dispose(); 
	// 	progressGeo = new THREE.RingBufferGeometry(RingLocationArray[i]*0.9,RingLocationArray[i],40,1,0, Theta); 
	// 	v.geometry = progressGeo;
	// })

	// Pivot
	pivots.forEach(function(v,i){
		v.rotation.x+=pivotRotation;
		v.rotation.y+=pivotRotation;
		v.rotation.z+=pivotRotation;
	})

	valences.forEach(function(v, i){
		v.rotation.x += baseRotation - (i * 0.002);
		v.rotation.y += baseRotation - (i * 0.001);
		v.rotation.z += baseRotation*2 - (i * 0.001);
	})
	valences02.forEach(function(v, i){
		v.rotation.x += baseRotation - (i * 0.002);
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


