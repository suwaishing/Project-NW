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

// Mouse
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var pointOfIntersection = new THREE.Vector3();

// To be synced
var meshes = [];
var bodies = [];
var rotationX = [];
var rotationY = [];
var baseRotation=0.01;
var testing;

var texture = new THREE.TextureLoader().load('assets/images/envMap.png');
texture.mapping=305;

var hiddenMaterial = new THREE.MeshStandardMaterial( {transparent:true,opacity:0.2} );
var StandardMaterial= new THREE.MeshStandardMaterial({
	color:0xF36058,
	roughness:1,
	metalness:0
});


initCannon();
initThree();
addPlane();
var heightplus=0.02
var rMinus=0.007;
var OuterRadius=1.2;
var InnerRadius=1;
var FenchUp=0;
var FenchDown=0.1;

var compoundBody;
// addSlide02(InnerRadius,FenchUp,FenchDown,heightplus,rMinus);



// Basic //
function initThree(){
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 1000);
	
	renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
	
	renderer.setClearColor("#5AA9E9",0);
	renderer.shadowMap.enabled=true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize( innerWidth, innerHeight );
	document.body.appendChild( renderer.domElement );


	controls = new THREE.OrbitControls( camera,renderer.domElement );
	
	camera.position.set(0,2,10);
	controls.update();

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
	body.position.set(0,0,0);
	world.addBody(body);
}

// addInnerSphere();
function addInnerSphere(){
	var sphereShape = new CANNON.Sphere(0.5);
	var sphereBody = new CANNON.Body({ mass: 10 });
	sphereBody.addShape(sphereShape);
	sphereBody.position.set(0,0.5,0);
	world.add(sphereBody);
}

// function distance(x,y,z,vx,vy,vz){
// 	var dx = x-vx;
// 	var dy = y-vy;
// 	var dz = z-vz;
// 	return Math.sqrt(dx*dx + dy * dy + dz * dz);
// }


// Testingbox();
function Testingbox(){
	var TestingBody = new CANNON.Body({ mass: 0 });

	var size = 0.6;
	var sizeZ = 0.4;
	var boxShape = new CANNON.Cylinder(size,size,sizeZ,10);
	var q = new CANNON.Quaternion();
	q.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI / 2);
	boxShape.transformAllPoints(new CANNON.Vec3(),q);
	TestingBody.addShape(boxShape, new CANNON.Vec3(0,-sizeZ,0));

	var boxShape = new CANNON.Cylinder(size*1.5,size*1.5,sizeZ,10);
	var q = new CANNON.Quaternion();
	q.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI / 2);
	boxShape.transformAllPoints(new CANNON.Vec3(),q);
	TestingBody.addShape(boxShape, new CANNON.Vec3(0,-sizeZ*2,0));

	var boxShape = new CANNON.Cylinder(size*2,size*2,sizeZ,10);
	var q = new CANNON.Quaternion();
	q.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI / 2);
	boxShape.transformAllPoints(new CANNON.Vec3(),q);
	TestingBody.addShape(boxShape, new CANNON.Vec3(0,-sizeZ*3,0));

	var boxShape = new CANNON.Cylinder(size*2.5,size*2.5,sizeZ,10);
	var q = new CANNON.Quaternion();
	q.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI / 2);
	boxShape.transformAllPoints(new CANNON.Vec3(),q);
	TestingBody.addShape(boxShape, new CANNON.Vec3(0,-sizeZ*4,0));
	
	TestingBody.position.set(0,-0.1,0);
	world.add(TestingBody);

	setTimeout(() => {
		TweenLite.to(TestingBody.position,2,{y:1.8});
	}, 1000);
}


function CreateNSphere(){
	var i=0;
	var N=50;
	setInterval(()=>{
		i++;
		if(i<N){
			var sphereShape = new CANNON.Sphere(0.2);
			var sphereBody = new CANNON.Body({ mass: 1 });
			sphereBody.addShape(sphereShape);
			sphereBody.position.set(0,5,0);
			world.add(sphereBody);
		}
	},100);
}

FirstTube();
function FirstTube(){

	var slipperyMaterial = new CANNON.Material();
	slipperyMaterial.friction = 0.3;
	slipperyMaterial.restitution = 1;

	var slipperyMaterial01 = new CANNON.Material();
	slipperyMaterial01.friction = 0;
	slipperyMaterial01.restitution = 0.5;

	var sphereShape = new CANNON.Sphere(0.2);
	var sphereBody = new CANNON.Body({ mass: 1 ,material: slipperyMaterial01});
	sphereBody.addShape(sphereShape);
	sphereBody.position.set(-2,0.2,-2);
	world.add(sphereBody);


	var elasticBox = new CANNON.Box(new CANNON.Vec3(.5,.1,.5));
	var elasticBody = new CANNON.Body({mass:0});
	elasticBody.addShape(elasticBox);
	elasticBody.position.set(-2,-1,-2);
	world.add(elasticBody);
	TweenMax.fromTo(elasticBody.position,0.55,{y:-0.1},{y:1.4,yoyo:true,repeat:-1,delay:1,repeatDelay:1,ease: Power2.easeIn});


	var iRadius=1.2;
	var vertTest=[];
	var number=0;
	for(var i=Math.PI/2.7;i<Math.PI+0.1;i+=Math.PI/40){
		if(number%2==0){
			vertTest.push(new CANNON.Vec3(Math.cos(-i)*iRadius,0,Math.sin(-i)*iRadius));
		} else {
			vertTest.push(new CANNON.Vec3(Math.cos(-i)*iRadius,0.1,Math.sin(-i)*iRadius));
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
	compoundBody = new CANNON.Body({mass:0});
	compoundBody.addShape(cannonShape);
	compoundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI/2);
	compoundBody.position.set(-1,2.4,-2);
	world.add(compoundBody);

	

	var conveyorBox = new CANNON.Box(new CANNON.Vec3(2,.1,.5));
	var conveyorBody = new CANNON.Body({mass:0,material: slipperyMaterial});
	conveyorBody.addShape(conveyorBox);
	conveyorBody.position.set(2,2,-2);
	world.add(conveyorBody);
	// TweenMax.fromTo(conveyorBody.position,2,{x:2},{x:-1,yoyo:true,repeat:-1,ease: Power0.easeNone});


	// setInterval(()=>{
	// 	var sphereShape = new CANNON.Sphere(0.2);
	// 	var sphereBody = new CANNON.Body({ mass: 1 });
	// 	sphereBody.addShape(sphereShape);
	// 	sphereBody.position.set(-2,5,-2);
	// 	world.add(sphereBody);
	// },100);
}




function addSlide02(InnerRadius,FenchUp,FenchDown,heightplus,rMinus){
	var iRadius=InnerRadius;
	var vertTest=[];
	var number=0;

	for(var i=0;i<Math.PI*4+0.2;i+=Math.PI/5){
		if(number%2==0){
			vertTest.push(new CANNON.Vec3(Math.cos(-i)*iRadius,0,Math.sin(-i)*iRadius));
		} else {
			vertTest.push(new CANNON.Vec3(Math.cos(-i)*iRadius,1,Math.sin(-i)*iRadius));
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
	compoundBody = new CANNON.Body({mass:0});
	compoundBody.addShape(cannonShape);
	compoundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI/2);
	compoundBody.position.set(0,-0.5,-0.5);
	world.add(compoundBody);
}



// renderer.domElement.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event){
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	// raycaster.ray.intersectPlane(plane, pointOfIntersection);
	var intersects = raycaster.intersectObject(hiddenPlane);
    if ( intersects.length > 0 )
    {
        pointOfIntersection = intersects[0].point;
    }
	BoxMesh.lookAt(pointOfIntersection);
}

animate();

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	cannonDebugRenderer.update();

	updateMeshPositions();
	renderer.render(scene,camera);
}

function updateMeshPositions(){
	world.step(1/120);
	for(var i=0; i !== meshes.length; i++){
		meshes[i].position.copy(bodies[i].position);
		meshes[i].quaternion.copy(bodies[i].quaternion);
	}
}