

var Colors = [
	0x000000,
	0x000000,
	0x000000,
];

var world;
var fixedTimeStep = 1 / 60;
var maxSubSteps = 3;
var mass = 5;
var lastTime;

var camera, scene, renderer, controls;
var geometry, material, mesh;
var container, camera, scene, renderer, cannonDebugRenderer;
var goal = new THREE.Object3D;
var tempGoal = new THREE.Vector3;

// To be synced
var meshes = [];
var bodies = [];
var rotationX = [];
var rotationY = [];
var baseRotation=0.01;
var testing;

var texture = new THREE.TextureLoader().load('assets/images/envMap.png');
texture.mapping=305;

var StandardMaterial= new THREE.MeshStandardMaterial({
	color:0xF36058,
	roughness:1,
	metalness:0
});

// Train stuffs
var TrainFront=new THREE.Object3D();
var TrainMiddle=new THREE.Object3D();
var TrainTail;
var TrainMiddleClone;
var loader = new THREE.GLTFLoader();

// Create Curve, Rail stuffs
var CurvePoints=[
	new THREE.Vector3(0, 0, 12),

	new THREE.Vector3(-11, 0, 10),
	new THREE.Vector3(-13, 0, 0),
	new THREE.Vector3(-11, 0, -10),
	new THREE.Vector3(0, 0, -12),

	new THREE.Vector3(10, 0, -10),
	new THREE.Vector3(13.2, 0, 0),
	new THREE.Vector3(10, 0,10),
];
var height=0;
// for(i=0;i<Math.PI*2-0.001;i+=Math.PI/100){
// 	// height+=0.01;
// 	CurvePoints.push(new THREE.Vector3((Math.cos(i)*12),0,(Math.sin(i)*12)));
// }

var railCurve = new THREE.CatmullRomCurve3(CurvePoints);
railCurve.closed=true;

var geometry = new THREE.BoxGeometry( 0.12, 0.02, 0.3 );
var material = new THREE.MeshStandardMaterial( { color: 0xB8927E,wireframe:false } );
var railBottom = new THREE.Mesh( geometry, material );

var desTrain=0.9;
var midTrain=0.885;
var tTrain=0.9,ptTrain,radians;
var axis=new THREE.Vector3();
var up = new THREE.Vector3( 1, 0, 0 );


initCannon();
initThree();
// addBox();
addPlane();
CreateRail();
addTrain();

animate();




// Basic //
function initThree(){
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 1000);
	
	renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
	
	renderer.setClearColor("#5AA9E9",1);
	renderer.shadowMap.enabled=true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize( innerWidth, innerHeight );
	document.body.appendChild( renderer.domElement );


	// controls = new THREE.OrbitControls( camera,renderer.domElement );
	
	camera.position.set(1,4,4);
	goal.position.set(-4,3,4);
	// controls.update();

	cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);

	// lights

	// var light =  new THREE.AmbientLight( 0xffffff );
	// light.intensity=0.1;
	// scene.add( light );

	hemiLight = new THREE.HemisphereLight(0xffffff, 0x808080, 1);
	scene.add(hemiLight)

	dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
	dirLight.position.set(-100, -100, 200);
	dirLight.castShadow = true;
	scene.add(dirLight);

	dirLight.shadow.mapSize.width = 1024;
	dirLight.shadow.mapSize.height = 1024;
	var d = 500;
	dirLight.shadow.camera.left = - d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = - d;

	// backLight = new THREE.DirectionalLight(0x000000, 1);
	// backLight.position.set(200, 200, 50);
	// backLight.castShadow = true;
	// scene.add(backLight)

}

// Resize //
window.addEventListener('resize', _.debounce(onWindowResize,100), false);

function onWindowResize(){
	camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
	renderer.setSize( innerWidth, innerHeight );
}



function animate() {
	requestAnimationFrame( animate );
	// controls.update();
	cannonDebugRenderer.update();
	updateMeshPositions();

	//Train Move
	if(tTrain.toFixed(2) != desTrain){
		var ptTrain = railCurve.getPoint(tTrain);
		TrainFront.position.set( ptTrain.x, ptTrain.y, ptTrain.z );

		tangent = railCurve.getTangent( tTrain ).normalize();
		axis.crossVectors( up, tangent ).normalize();
		radians = Math.acos( up.dot( tangent ) );
	
		TrainFront.quaternion.setFromAxisAngle( axis, radians+3.14 );

		var ptTrain = railCurve.getPoint(midTrain);
		TrainMiddle.position.set( ptTrain.x, ptTrain.y, ptTrain.z );
		
		tangent = railCurve.getTangent( midTrain ).normalize();
		axis.crossVectors( up, tangent ).normalize();
		radians = Math.acos( up.dot( tangent ) );
	
		TrainMiddle.quaternion.setFromAxisAngle( axis, radians );

		tTrain = (tTrain >= 0.999) ? 0 : tTrain += 0.001;
		midTrain = (midTrain >= 0.999) ? 0 : midTrain += 0.001;

		followTrain();
	}
	
	renderer.render(scene,camera);
}

function followTrain(){
	tempGoal.setFromMatrixPosition(goal.matrixWorld);
	camera.position.lerp(tempGoal, 1);
	camera.lookAt( TrainFront.position.x,TrainFront.position.y,TrainFront.position.z );
}

function updateMeshPositions(){
	world.step(1/60);
	for(var i=0; i !== meshes.length; i++){
		meshes[i].position.copy(bodies[i].position);
		meshes[i].quaternion.copy(bodies[i].quaternion);
	}
}

function initCannon(){
	world = new CANNON.World();
	world.gravity.set(0,-10,0);
	world.broadphase = new CANNON.NaiveBroadphase();
}

function addPlane(){

	// Physics
	var shape = new CANNON.Plane();
	var body = new CANNON.Body({ mass: 0 });
	body.addShape(shape);
	body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
	world.addBody(body);

	// geometry = new THREE.CircleGeometry( 100, 8);
	// var planeMaterial = new THREE.MeshStandardMaterial({
	// 	color:0x7AD2F7,
	// 	roughness:1,
	// 	metalness:0.05
	// });
	// mesh = new THREE.Mesh( geometry, planeMaterial );
	// mesh.position.set(0,0,0);
	// mesh.rotation.set(-Math.PI/2,0,0)
	// scene.add(mesh);


	geometry = new THREE.CircleGeometry( 25,32 );
	var planeMaterial = new THREE.MeshStandardMaterial({
		// color:0xD0FF5F,
		// color:0xa0db48,
		color: 0xA0D085,
		roughness:1,
		metalness:0
	});
	mesh = new THREE.Mesh( geometry, planeMaterial );
	mesh.position.set(0,0,0);
	mesh.rotation.set(-Math.PI/2,0,0)
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);


	geometry = new THREE.PlaneGeometry( 2,2 );
	var planeMaterial = new THREE.MeshStandardMaterial({
		// color:0xD0FF5F,
		// color:0xa0db48,
		color: 0xEAD8C1,
		roughness:1,
		metalness:0
	});
	mesh = new THREE.Mesh( geometry, planeMaterial );
	mesh.position.set(0,0.01,0);
	mesh.rotation.set(-Math.PI/2,0,0)
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);

}


function CreateRail(){
	var extrudeSettings = {
		steps : 200,
		bevelEnabled: false,
		extrudePath: railCurve
	};
	
	var shapeLength=0.05
	var sqLength=0.15;
	
	var railShape = new THREE.Shape();
	railShape.moveTo( 0, 0 );
	railShape.lineTo( 0, sqLength/2 );
	railShape.lineTo( -0.04, sqLength/2 );
	railShape.lineTo( -0.04, sqLength/2+shapeLength );
	railShape.lineTo( 0.02, sqLength/2+shapeLength );
	railShape.lineTo( 0.02, -sqLength/2-shapeLength );
	railShape.lineTo( -0.04, -sqLength/2-shapeLength );
	railShape.lineTo( -0.04, -sqLength/2);
	railShape.lineTo( 0, -sqLength/2);
	railShape.lineTo( 0, 0);
	
	var geometry = new THREE.ExtrudeGeometry( railShape, extrudeSettings );
	var material = new THREE.MeshStandardMaterial( { color: 0xd1d1d1,roughness:1,metalness:0 } );
	var testingextrude = new THREE.Mesh( geometry, material );
	testingextrude.position.set(0,-0.01,0)
	// testingextrude.castShadow=true;
	scene.add(testingextrude);	

	for(i=-0.002;i<0.995;i+=0.003){
		ptTrain = railCurve.getPoint(i);
		var railCopy=railBottom.clone();
		railCopy.position.set( ptTrain.x, ptTrain.y, ptTrain.z );
		tangent = railCurve.getTangent( i ).normalize();
		axis.crossVectors( up, tangent ).normalize();
		radians = Math.acos( up.dot( tangent ) );
		railCopy.quaternion.setFromAxisAngle( axis, radians );
		scene.add(railCopy);
	}

	
}

function addTrain(){
	
	loader.load( 'assets/model/NewTrain.glb', function ( gltf ) {
		gltf.scene.traverse( function( node ) {

			if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
	
		} );
		TrainFront=gltf.scene;
		var ptTrain = railCurve.getPoint( desTrain );
		TrainFront.position.set( ptTrain.x, ptTrain.y, ptTrain.z );
		tangent = railCurve.getTangent( desTrain ).normalize();
		axis.crossVectors( up, tangent ).normalize();
		radians = Math.acos( up.dot( tangent ) );
		TrainFront.castShadow=true;
		TrainFront.quaternion.setFromAxisAngle( axis, radians+3.14 );
		TrainFront.add(goal);
		scene.add( TrainFront );
	} );
	// loader.load( 'assets/model/TrainMid.glb', function ( gltf ) {
	// 	gltf.scene.traverse( function( node ) {

	// 		if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
	
	// 	} );
	// 	TrainMiddle=gltf.scene;
	// 	var ptTrain = railCurve.getPoint( midTrain );
	// 	TrainMiddle.position.set( ptTrain.x, ptTrain.y, ptTrain.z );
	// 	tangent = railCurve.getTangent( midTrain ).normalize();
	// 	axis.crossVectors( up, tangent ).normalize();
	// 	radians = Math.acos( up.dot( tangent ) );
	// 	TrainMiddle.castShadow=true;
	// 	TrainMiddle.quaternion.setFromAxisAngle( axis, radians );
	// 	scene.add( TrainMiddle );
	// } );

}



var heightplus=0.02
var rMinus=0.007;
var OuterRadius=1.2;
var InnerRadius=1;
var FenchUp=0;
var FenchDown=0.1;

addSlide(OuterRadius,InnerRadius,heightplus,rMinus,FenchUp,FenchDown);

function addSlide(OuterRadius,InnerRadius,heightplus,rMinus){
	var oRadius=OuterRadius;
	var iRadius=InnerRadius;
	var height=0;
	var vertTest=[];
	var numberI=0;

	for(var i=0;i<Math.PI*4+0.7;i+=Math.PI/50){
		if(numberI%2==0){
			height+=heightplus;
			oRadius-=rMinus;
			iRadius-=rMinus;
			vertTest.push(new CANNON.Vec3(Math.cos(-i)*oRadius,height,Math.sin(-i)*oRadius));
		} else {
			vertTest.push(new CANNON.Vec3(Math.cos(-i)*iRadius,height,Math.sin(-i)*iRadius));
		}
		numberI++;
	}

	var faceTest=[];
	faceTest.push([0,1,2]);
	faceTest.push([2,1,3]);// 2
	faceTest.push([2,3,4]);
	var zero=3,one=4,two=5;
	for(var i=0;i<vertTest.length-2-3;i++){
		if(i%2==0){
			faceTest.push([zero,one,two]);
		} else {
			faceTest.push([one,zero,two]);
		}
		zero++;
		one++;
		two++;
	}
	// faceTest.push([0,1,2]);
	// faceTest.push([2,1,3]);// 2
	// faceTest.push([2,3,4]);
	// faceTest.push([3,4,5]);
	// faceTest.push([5,4,6]);// 5
	// faceTest.push([5,6,7]);
	// faceTest.push([7,6,8]);// 6
	// faceTest.push([7,8,9]);
	// faceTest.push([9,8,10]);// 7
	// faceTest.push([9,10,11]);
	// faceTest.push([11,10,12]);//9
	// faceTest.push([11,12,13]);
	// faceTest.push([13,12,14]);//11

	var cannonShape = new CANNON.ConvexPolyhedron(vertTest,faceTest);
	var cannonBody = new CANNON.Body({ mass: 0 });
	cannonBody.addShape(cannonShape);
	cannonBody.position.set(0,0,-10);
	// cannonBody.quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI )
	world.addBody(cannonBody);


	addSlide02(InnerRadius,FenchUp,FenchDown,heightplus,rMinus);
	addSlide03(OuterRadius,FenchUp,FenchDown,heightplus,rMinus);
}


function addSlide02(InnerRadius,FenchUp,FenchDown,heightplus,rMinus){
	var iRadius=InnerRadius;
	var height01=FenchUp;
	var height02=FenchDown;
	var vertTest=[];
	var number=0;

	for(var i=0;i<Math.PI*4+0.7;i+=Math.PI/50){
		if(number%2==0){
			height01+=heightplus;
			height02+=heightplus;
			iRadius-=rMinus;
			vertTest.push(new CANNON.Vec3(Math.cos(-i)*iRadius,height01,Math.sin(-i)*iRadius));
		} else {
			vertTest.push(new CANNON.Vec3(Math.cos(-i)*iRadius,height02,Math.sin(-i)*iRadius));
		}
		number++;
	}


	var faceTest=[];
	faceTest.push([0,2,1]);
	faceTest.push([1,2,3]);// 2
	faceTest.push([3,2,4]);
	var zero=3,one=4,two=5;
	for(var i=0;i<vertTest.length-2-3;i++){
		if(i%2==0){
			faceTest.push([zero,one,two]);
		} else {
			faceTest.push([one,zero,two]);
		}
		zero++;
		one++;
		two++;
	}
	var cannonShape = new CANNON.ConvexPolyhedron(vertTest,faceTest);
	var cannonBody = new CANNON.Body({ mass: 0 });
	cannonBody.addShape(cannonShape);
	cannonBody.position.set(0,0,-10);
	world.addBody(cannonBody);
}

function addSlide03(OuterRadius,FenchUp,FenchDown,heightplus,rMinus){
	var oRadius=OuterRadius;
	var height01=FenchUp;
	var height02=FenchDown;
	var vertTest=[];
	var number=0;

	for(var i=0;i<Math.PI*4+0.7;i+=Math.PI/50){
		if(number%2==0){
			height01+=heightplus;
			height02+=heightplus;
			oRadius-=rMinus;
			vertTest.push(new CANNON.Vec3(Math.cos(-i)*oRadius,height01,Math.sin(-i)*oRadius));
		} else {
			vertTest.push(new CANNON.Vec3(Math.cos(-i)*oRadius,height02,Math.sin(-i)*oRadius));
		}
		number++;
	}


	var faceTest=[];
	faceTest.push([0,2,1]);
	faceTest.push([1,2,3]);// 2
	faceTest.push([3,2,4]);
	var zero=3,one=4,two=5;
	for(var i=0;i<vertTest.length-2-3;i++){
		if(i%2==0){
			faceTest.push([zero,one,two]);
		} else {
			faceTest.push([one,zero,two]);
		}
		zero++;
		one++;
		two++;
	}
	var cannonShape = new CANNON.ConvexPolyhedron(vertTest,faceTest);
	var cannonBody = new CANNON.Body({ mass: 0 });
	cannonBody.addShape(cannonShape);
	cannonBody.position.set(0,0,-10);
	world.addBody(cannonBody);
}

function addBox(){
	for(var i=0;i<4;i++){
		// Physics
		var shape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));
		var body = new CANNON.Body({ mass: Math.random()*10 });
		body.addShape(shape);
		body.position.set(Math.random()*10-5,Math.random()*10,Math.random()*10-5);
		// body.position.set(1,1,1);
		body.linearDamping = body.angularDamping = 0.5;
		world.addBody(body);
		bodies.push(body);

		
		// Graphics
		var cubeGeo = new THREE.BoxGeometry( 1, 1, 1 );
		// var cubeMaterial = new THREE.MeshPhongMaterial( { color: 0x212121 } );
		var cubeMaterial = new THREE.MeshStandardMaterial( { color: 0x212121, } );
		cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial);
		cubeMesh.castShadow=true;
		meshes.push(cubeMesh);
		scene.add(cubeMesh);

		rotationX.push(baseRotation);
		rotationY.push(baseRotation);
	}
}

var TestMaterial = new THREE.MeshStandardMaterial( { color: 0x212121 } );

var wireframe = new THREE.MeshStandardMaterial( { wireframe:true } );

var FMaterial = new THREE.MeshStandardMaterial({ 
	side: THREE.DoubleSide,
	// color:0xDABFF0,
	emissive:0xff0000,
	envMap:texture,
	envMapIntensity:1,
	roughness:0.2,
	metalness:0.9 
});


// var geometry = new THREE.BoxGeometry( 3, 3, 3 );
// var box = new THREE.Mesh( geometry,FMaterial );
// box.position.set(0,1.5,0);
// boxCSG = THREE.CSG.fromMesh(box);
// scene.add(box);

var cylinderCSG;
function cylinderPart(){
	var geometry = new THREE.Geometry();
	var h=1,space=0.1;
	// CSG 
	geometry.vertices.push(
		new THREE.Vector3(0,0,0),
		new THREE.Vector3(-h-space,0,0),
		new THREE.Vector3(0,0,-h-space),
		new THREE.Vector3(0,-h-space,0),
	);
	geometry.faces.push(
		new THREE.Face3(0,1,2),
		new THREE.Face3(0,1,3),
		new THREE.Face3(0,2,3),
		new THREE.Face3(1,2,3),
	)
	var mesh = new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({
		side: THREE.DoubleSide,wireframe:true,
	}));
	mesh.position.set(1.5,1.5,1.5);
	cylinderCSG = THREE.CSG.fromMesh(mesh);
	scene.add(mesh);

	// Normal
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(0,0,0),
		new THREE.Vector3(-h,0,0),
		new THREE.Vector3(0,0,-h),
		new THREE.Vector3(0,-h,0),
	);
	geometry.faces.push(
		new THREE.Face3(0,1,2),
		new THREE.Face3(0,1,3),
		new THREE.Face3(0,2,3),
		new THREE.Face3(1,2,3),
	)
	geometry.computeFaceNormals();

	var mesh = new THREE.Mesh(geometry,FMaterial);

	console.log(mesh);
	meshes.push(mesh);
	scene.add(mesh);


	// CANNON
	var verts = [new CANNON.Vec3(0,0,0),
		new CANNON.Vec3(0,0,-h),
		new CANNON.Vec3(0,-h,0),
		new CANNON.Vec3(-h,0,0),
		];
	var cannonShape = new CANNON.ConvexPolyhedron(verts,
	[
		[0,3,2], // -x
		[0,1,3], // -y
		[0,2,1], // -z
		[1,2,3], // +xyz
	]);
	var cannonBody = new CANNON.Body({ mass: 10 });
	cannonBody.addShape(cannonShape);
	cannonBody.position.set(4,0,0);
	cannonBody.quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI )
	bodies.push(cannonBody);
	world.addBody(cannonBody);
}
// cylinderPart();

// function addOuterShape(){
// 	var geometry = new THREE.TorusBufferGeometry( 3, 0.1, 16, 100 );
// 	var torus = new THREE.Mesh( geometry, FMaterial );
// 	torus.position.set(0,0,0);
// 	scene.add( torus );
// }
// addOuterShape();

// var result=boxCSG.subtract(cylinderCSG);
// var mesh=THREE.CSG.toMesh(result);
// mesh.position.set(0,3,0);
// scene.add(mesh);


// TestMesh.castShadow=true;
// scene.add(TestMesh);




function distance(x,y,z,vx,vy,vz){
	var dx = x-vx;
	var dy = y-vy;
	var dz = z-vz;
	return Math.sqrt(dx*dx + dy * dy + dz * dz);
}


var vec = new THREE.Vector3();
var pos = new THREE.Vector3();

MouseColor=0x222222;

// Mouse object
// var geometry = new THREE.RingBufferGeometry( 2.9,3, 50 );
// var material = new THREE.MeshBasicMaterial( {color: MouseColor} );
// material.transparent=true;
// var mouse = new THREE.Mesh( geometry, material );
// mouse.position.set(0,100,0);
// scene.add(mouse);


// var geometry = new THREE.CircleBufferGeometry( 2.7, 50 );
// var material = new THREE.MeshBasicMaterial( {color: MouseColor} );
// material.transparent=true;
// var mouse02 = new THREE.Mesh( geometry, material );
// mouse02.scale.set(0.18,0.18,0.18);
// mouse02.position.set(0,100,0);
// scene.add(mouse02);


// var geometry = new THREE.CircleBufferGeometry( 3, 100 );
// var material = new THREE.MeshBasicMaterial( {color: MouseColor} );
// material.transparent=true;
// var layer01=new THREE.Mesh(geometry,material);
// layer01.material.opacity=0;
// layer01.position.set(0,100,0);
// scene.add(layer01);

// var geometry = new THREE.CircleBufferGeometry( 3, 100 );
// var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
// material.transparent=true;
// var layer02=new THREE.Mesh(geometry,material);
// layer02.material.opacity=1;
// layer02.position.set(0,100,0);
// scene.add(layer02);

// window.addEventListener( 'mousemove',_.throttle(onMouseMove,10), false );

// function onMouseMove( event ) {

// 	vec.set(
// 		( event.clientX / window.innerWidth ) * 2 - 1,
// 		- ( event.clientY / window.innerHeight ) * 2 + 1,
// 		0.5 );
	
// 	vec.unproject( camera );
// 	vec.sub( camera.position ).normalize();
// 	var distance = - camera.position.z / vec.z;
// 	pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
// 	TweenLite.to(mouse.position,0.4,{ease: Power1.easeOut,x:pos.x,y:pos.y,z:pos.z})
// 	TweenLite.to(mouse02.position,0.32,{ease: Power1.easeOut,x:pos.x,y:pos.y,z:pos.z})
// 	TweenLite.to(layer01.position,0.4,{ease: Power1.easeOut,x:pos.x,y:pos.y,z:pos.z-0.2})
// 	TweenLite.to(layer02.position,0.4,{ease: Power1.easeOut,x:pos.x,y:pos.y,z:pos.z-0.1})
// }

var holdTime=null;
var x=0,y=0,z=0;

window.addEventListener('mousedown',function(e){
	holdTime=setInterval(() => {


		// var worldPoint = new CANNON.Vec3(vehicle.position.x,0,0);
		// var force = new CANNON.Vec3(10,0,0);
		// vehicle.applyForce(force,worldPoint);

		// if(mouse02.scale.x<=1){
		// 	mouse02.scale.x+=0.01;
		// 	mouse02.scale.y+=0.01;
		// 	TweenLite.to(mouse.scale,0.2,{ease: Power0.easeNone,x:0.9,y:0.9});
		// 	TweenLite.to(layer02.scale,0.2,{ease: Power0.easeNone,x:0.9,y:0.9});
		// } else {
		// 	layer01.material.opacity=1;
		// 	TweenLite.to(layer01.scale,1,{ease: Power0.easeNone,x:70,y:70});
		// 	setTimeout(()=>{
		// 		layer02.material.opacity=1;
		// 	},1000)
		// 	TweenLite.to(layer02.scale,1,{ease: Power0.easeNone,x:70,y:70,delay:1});
		// 	setTimeout(() => {
		// 		layer01.material.opacity=0;
		// 		layer01.scale.x=1;
		// 		layer01.scale.y=1;
		// 		layer02.scale.x=1;
		// 		layer02.scale.y=1;
		// 	}, 2000);
		// }
	}, 10);
})

window.addEventListener('mouseup',function(e){
	world.gravity.set(0,-10,0);
	z=0;
	// var worldPoint = new CANNON.Vec3(0,0,0);
    // var force = new CANNON.Vec3(500*1/60,0,0);
    // for(var i=0;i<bodies.length;i++){
	// 	bodies[i].applyImpulse(impulse,worldPoint);
	// }
	clearInterval(holdTime);
	// TweenLite.to(mouse02.scale,0.3,{x:0.18,y:0.18})
	// TweenLite.to(mouse.scale,0.2,{x:1,y:1})
	// TweenLite.to(layer02.scale,0.2,{x:1,y:1})
})

// var geometry = new THREE.RingGeometry( 20, 10, 32,8,2,5 );
// var material = new THREE.MeshBasicMaterial( { color: 0xffffff, } );
// var shape = new THREE.Mesh( geometry, material );
// scene.add( shape );




// var geometry = new THREE.BoxBufferGeometry(10, 10, 10);
const meshParams = {
	emissive: '#212121',
	roughness: 0.4,
};
// var material = new THREE.MeshStandardMaterial(meshParams);
// var mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

var GeometryArrays=[];
function CreateCubeShapes(){
	var meshGroup=new THREE.Object3D();
	var random=Math.floor(Math.random()*3+3);
	// var width=Math.random()*5+5;
	// var height=Math.random()*25+25;
	// var depth=Math.random()*5+5;
	var Fx=0;
	var Fy=0;
	var Fz=0;

	var material = new THREE.MeshStandardMaterial(meshParams);

	// var geometry = new THREE.BoxBufferGeometry(width,height,depth);
	// var mesh = new THREE.Mesh(geometry, material);
	// mesh.rotation.z=-Math.PI/4;
	// meshGroup.add(mesh);

	// var width=Math.random()*5+5;
	// var height=Math.random()*25+25;
	// var depth=Math.random()*5+5;

	// var geometry = new THREE.BoxBufferGeometry(width,height,depth);
	// var mesh = new THREE.Mesh(geometry, material);
	// mesh.position.y=Math.random()*5 * (Math.random() < 0.5 ? 1 : -1);
	// mesh.position.z=-Math.random()*(depth/2)+5;
	// mesh.rotation.z=Math.PI/4;
	// meshGroup.add(mesh);

	for(var i=0;i<random;i++){
		var width=Math.random()*7+3;
		var height=Math.random()*40+10;
		var depth=Math.random()*7+3;
		var geometry = new THREE.BoxBufferGeometry(width,height,depth);
		var mesh = new THREE.Mesh(geometry, material);
		var x=Math.random()*14-7;
		var y=Math.random()*15 * (Math.random() < 0.5 ? 1 : -1);
		var z=Math.random()*14-7;
		mesh.position.set(Fx,Fy,Fz);
		mesh.rotation.z=Math.PI/4 * (Math.random() < 0.5 ? 1 : -1);
		if(distance(x,y,z,Fx,Fy,Fz)>1){
			meshGroup.add(mesh);
			Fx=x;
			Fy=y;
			Fz=z;
		}
	}
	GeometryArrays.push(meshGroup);
	scene.add(meshGroup);
}

// CreateCubeShapes();

var w=10;
var h=10;
var d=10;
var space=0.2;

// FORMING SHAPE
var ShapeArrays=[];
var CubeMeshArrays=[];
var meshGroup=new THREE.Object3D();
function FormCubeShape(){
	
	var material = new THREE.MeshStandardMaterial(meshParams);
	
	// for(var i=0;i<8;i++){
	// }


		var geometry = new THREE.BoxBufferGeometry(w,h,d);
		var mesh = new THREE.Mesh(geometry, material);
		var randomX=60;
		var randomY=35;
		var randomZ=-20;
		mesh.position.set(randomX,randomY,randomZ)
		meshGroup.add(mesh);

		var geometry = new THREE.BoxBufferGeometry(w,h,d);
		var mesh = new THREE.Mesh(geometry, material);
		var randomX=Math.random()*100-50;
		var randomY=Math.random()*100-50;
		var randomZ=Math.random()*100-50;
		mesh.position.set(randomX,randomY,randomZ)
		meshGroup.add(mesh);

		var geometry = new THREE.BoxBufferGeometry(w,h,d);
		var mesh = new THREE.Mesh(geometry, material);
		var randomX=Math.random()*100-50;
		var randomY=Math.random()*100-50;
		var randomZ=Math.random()*100-50;
		mesh.position.set(randomX,randomY,randomZ)
		meshGroup.add(mesh);

		var geometry = new THREE.BoxBufferGeometry(w,h,d);
		var mesh = new THREE.Mesh(geometry, material);
		var randomX=Math.random()*100-50;
		var randomY=Math.random()*100-50;
		var randomZ=Math.random()*100-50;
		mesh.position.set(randomX,randomY,randomZ)
		meshGroup.add(mesh);


		// behind
		var geometry = new THREE.BoxBufferGeometry(w,h,d);
		var mesh = new THREE.Mesh(geometry, material);
		var randomX=Math.random()*100-50;
		var randomY=Math.random()*100-50;
		var randomZ=Math.random()*100-50;
		mesh.position.set(randomX,randomY,randomZ)
		meshGroup.add(mesh);

		var geometry = new THREE.BoxBufferGeometry(w,h,d);
		var mesh = new THREE.Mesh(geometry, material);
		var randomX=Math.random()*100-50;
		var randomY=Math.random()*100-50;
		var randomZ=Math.random()*100-50;
		mesh.position.set(randomX,randomY,randomZ)
		meshGroup.add(mesh);

		var geometry = new THREE.BoxBufferGeometry(w,h,d);
		var mesh = new THREE.Mesh(geometry, material);
		var randomX=Math.random()*100-50;
		var randomY=Math.random()*100-50;
		var randomZ=Math.random()*100-50;
		mesh.position.set(randomX,randomY,randomZ)
		meshGroup.add(mesh);

		var geometry = new THREE.BoxBufferGeometry(w,h,d);
		var mesh = new THREE.Mesh(geometry, material);
		var randomX=Math.random()*100-50;
		var randomY=Math.random()*100-50;
		var randomZ=Math.random()*100-50;
		mesh.position.set(randomX,randomY,randomZ)
		meshGroup.add(mesh);

		ShapeArrays.push(meshGroup);
		ShapeArrays[0].rotation.x=0.2;
		scene.add(meshGroup);
}

// FormCubeShape()


function SummonCubeShape(){

	// console.log(ShapeArrays[0].children[0].position);
	// tl01X=ShapeArrays[0].children[0].position.x;
	// tl01Y=ShapeArrays[0].children[0].position.y;
	// tl01Z=ShapeArrays[0].children[0].position.z;
	// TweenLite.to(ShapeArrays[0].children[0].position,1.5,{ease: Power0.easeNone,x:-tl01X*80/100});
	// TweenLite.to(ShapeArrays[0].children[0].position,1.5,{ease: Power0.easeNone,y:tl01Y*60/100});
	// TweenLite.to(ShapeArrays[0].children[0].position,1.5,{ease: Power0.easeNone,z:-tl01Z*60/100});
	// tl01.add(TweenLite.to(ShapeArrays[0].children[0].position,1,{ease: Power0.easeNone,x:tl01X*70/100}) );
	// tl01.add(TweenLite.to(ShapeArrays[0].children[0].position,1,{ease: Power0.easeNone,x:15}) );

	TweenLite.to(ShapeArrays[0].children[0].position,2.5,{ease: Power1.easeInOut,x:w/2+space,y:h/2+space,z:d/2+space})
	TweenLite.to(ShapeArrays[0].children[1].position,2.5,{ease: Power1.easeInOut,x:-w/2,y:h/2+space,z:d/2+space})
	TweenLite.to(ShapeArrays[0].children[2].position,2.5,{ease: Power1.easeInOut,x:w/2+space,y:-h/2,z:d/2+space})
	TweenLite.to(ShapeArrays[0].children[3].position,2.5,{ease: Power1.easeInOut,x:-w/2,y:-h/2,z:d/2+space})

	// back
	TweenLite.to(ShapeArrays[0].children[4].position,2.5,{ease: Power1.easeInOut,x:w/2+space,y:h/2+space,z:-d/2});
	TweenLite.to(ShapeArrays[0].children[5].position,2.5,{ease: Power1.easeInOut,x:-w/2,y:h/2+space,z:-d/2})
	TweenLite.to(ShapeArrays[0].children[6].position,2.5,{ease: Power1.easeInOut,x:w/2+space,y:-h/2,z:-d/2})
	TweenLite.to(ShapeArrays[0].children[7].position,2.5,{ease: Power1.easeInOut,x:-w/2,y:-h/2,z:-d/2})

	TweenLite.to(ShapeArrays[0].rotation,3,{ease: Power1.easeNone,z:Math.PI});
	TweenLite.to(targetRotationX,3,{ease: Power1.easeNone,var:targetRotationX.var+38})
}


// DRAG
// var targetRotationX = {var: 0};
// var targetRotationOnMouseDownX = 0;

// var targetRotationY = 0;
// var targetRotationOnMouseDownY = 0;

// var mouseX = 0;
// var mouseXOnMouseDown = 0;

// var mouseY = 0;
// var mouseYOnMouseDown = 0;

// var windowHalfX = window.innerWidth / 2;
// var windowHalfY = window.innerHeight / 2;

// var finalRotationY;

// document.addEventListener( 'mousedown', onDocumentMouseDown, false );
// document.addEventListener( 'touchstart', onDocumentTouchStart, false );
// document.addEventListener( 'touchmove', onDocumentTouchMove, false );


// function onDocumentMouseDown( event ) {

// 	event.preventDefault();

// 	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
// 	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
// 	document.addEventListener( 'mouseout', onDocumentMouseOut, false );

// 	mouseXOnMouseDown = event.clientX - windowHalfX;
// 	targetRotationOnMouseDownX = targetRotationX.var;

// 	mouseYOnMouseDown = event.clientY - windowHalfY;
// 	targetRotationOnMouseDownY = targetRotationY;

// }

// function onDocumentMouseMove( event ) {

// 	mouseX = event.clientX - windowHalfX;
// 	mouseY = event.clientY - windowHalfY;

// 	targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
// 	targetRotationX.var = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;

// }

// function onDocumentMouseUp( event ) {

// 	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
// 	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
// 	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

// }

// function onDocumentMouseOut( event ) {

// 	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
// 	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
// 	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

// }

// function onDocumentTouchStart( event ) {

// 	if ( event.touches.length == 1 ) {

// 					event.preventDefault();

// 					mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
// 					targetRotationOnMouseDownX = targetRotationX.var;

// 					mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
// 					targetRotationOnMouseDownY = targetRotationY;

// 	}

// }

// function onDocumentTouchMove( event ) {

// 	if ( event.touches.length == 1 ) {

// 					event.preventDefault();

// 					mouseX = event.touches[ 0 ].pageX - windowHalfX;
// 					targetRotationX.var = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.05;

// 					mouseY = event.touches[ 0 ].pageY - windowHalfY;
// 					targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;

// 	}

// }









// tube
// var geometry = new THREE.TubeGeometry( curve, 64, .1, 8, true );
// var material = new THREE.MeshBasicMaterial( { color : 0xff0000 } );
// var curveObject = new THREE.Mesh( geometry, material );
// scene.add(curveObject)