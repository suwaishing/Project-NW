import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as gs from 'gsap';
import * as OrbitControls from 'three-orbitcontrols';
import GLTFLoader from 'three-gltf-loader';
// import thisWork from 'three-dragcontrols';
import { Injectable } from '@angular/core';
import { load } from '@angular/core/src/render3';

@Injectable({
    providedIn: 'root'
})

export class welcomeService{
    // THREE BASIC SETUP
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private controls;
    private scene: THREE.Scene;

    private loader: GLTFLoader;
    // CANNON BASIC SETUP
    private world = new CANNON.World();
    private NGravityWorld = new CANNON.World();

    private FireExtinguisher=new THREE.Object3D();
    private mixer;
    private clock = new THREE.Clock();
    private meshes = [];
    private bodies = [];
    private meshes02 = [];
    private bodies02 = [];
    private meshes03 = [];
    private bodies03 = [];
    private hold1=null;
    private hold2=null;
    private hold3=null;
    private hold5=null;



    // Fire Extinguisher
    smokeThree:THREE.Mesh;
    FETHREE = new THREE.Group();
    FETap = new THREE.Mesh();
    SmokePoint = new THREE.Mesh();
    MovePoint = new THREE.Mesh();
    ForcePoint = new THREE.Mesh();
    ResetPoint =new THREE.Mesh();
    FEcannon = [];
    FEthree = [];
    Pipe = new THREE.Mesh();
    PipeCannon = [];
    PipeThree = [];
    vec = new THREE.Vector3();
    pos = new THREE.Vector3();
    lastpipe;
    lastthreepipe;
    dragControl;
    directionPipe;
    DragPoint;
    DragPointThree=[];
    PipeDistance = new THREE.Vector3();
    planeMaterial: CANNON.Material;
    stuffMaterial: CANNON.Material;
    dragging:boolean=false;
    lockConstraint;
    ThreeStuff = new THREE.Mesh();

    // Smoke
    sphereShape=new CANNON.Sphere(0.068);
    tweenTime = 0.6; // seconds

    // Shadow
    RoundShadow;
    
    // Fan
    private fan = new THREE.Object3D();

    // Drag Stuffs

    private curvePipe=new THREE.Mesh();

    private plane = new THREE.Plane();
    private raycaster = new THREE.Raycaster();
  
    private mouse = new THREE.Vector2();
    private offset = new THREE.Vector3();
    private intersection = new THREE.Vector3();

    InitThree(elementId:string):void{

        this.canvas = <HTMLCanvasElement>document.getElementById(elementId);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,    // transparent background
            antialias: true // smooth edges
        });
        // this.renderer.gammaInput=false;
        // this.renderer.gammaOutput=false;
        // this.renderer.gammaFactor=2;
        this.clock = new THREE.Clock();
        this.renderer.setSize(window.innerWidth*window.devicePixelRatio, window.innerHeight*window.devicePixelRatio);
        this.renderer.setClearColor("#a8b3d3",0);
        this.renderer.shadowMap.enabled=true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // create the scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 100);
        // this.camera.position.set(3,2,6);
        this.camera.position.set(0,2,6.25);
        // this.camera.position.set(0,0,7);
        this.camera.lookAt(0,0,0);
        this.scene.add(this.camera);
        //this.light = new THREE.AmbientLight(0xfafafa);
        // this.light.position.z = 10;
        //this.scene.add(this.light);
        // this.controls = new OrbitControls(this.camera,this.canvas);
        // this.controls.minAzimuthAngle=.5;
        // this.controls.maxAzimuthAngle=.5;
        
        // this.controls.autoRotate=true;
        // this.controls.autoRotateSpeed=2;
        // this.controls.minPolarAngle=Math.PI/3;
        // this.controls.maxPolarAngle=Math.PI/2-0.1;
        // this.controls.enableRotate=false;
        // this.controls.enableZoom=false;
        // this.controls.enablePan=false;
        // this.controls.rotateSpeed=0.5;

        // let amlight = new THREE.AmbientLight(0xffffff,1);
        // this.scene.add(amlight)

        // let hemiLight = new THREE.HemisphereLight(0xffffff, 0xff9396, 0.61);
        // let hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbbb, 0.58);

        let hemiLight = new THREE.HemisphereLight(0xfcfcfc, 0xdddddd, 1);
        this.scene.add(hemiLight)

        let DirectionalLight = new THREE.DirectionalLight(0xfcfcfc,.075);

        DirectionalLight.position.set(-0.4,20,-1);
        DirectionalLight.castShadow=true;
        // DirectionalLight.intensity=0.1;
        DirectionalLight.shadow.mapSize.width=2048;
        DirectionalLight.shadow.mapSize.height=2048;
        DirectionalLight.shadow.camera.near=5;
        DirectionalLight.shadow.camera.far=100;
        // DirectionalLight.shadow.radius=5;
        this.scene.add(DirectionalLight);

        // let direction01 = new THREE.DirectionalLight(0xffffff,.05);
        // direction01.position.set(5,5,5);
        // this.scene.add(direction01);

        // let direction02 = new THREE.DirectionalLight(0xffffff,.05);
        // direction02.position.set(-5,-5,-5);
        // this.scene.add(direction02);

        // let pointlight02 = new THREE.PointLight(0xffffff,0.2);
        // pointlight02.position.set(0,10,0);
        // pointlight02.castShadow=true;
        // pointlight02.shadow.mapSize.width=2048;
        // pointlight02.shadow.mapSize.height=2048;
        // pointlight02.shadow.camera.near=5;
        // pointlight02.shadow.camera.far=100;
        // this.scene.add(pointlight02);

    }

    InitStuffs():void{
        this.InitCannon();
        this.CannonPlane();
        this.CreateSmoke();
        this.CreatePipe();
        this.CreateFireExtinguisher();
        // this.CreateShadow();
        this.addEvent();
        // for(var i=0;i<10;i++){
        //   this.addRainStuffs();
        // }
        // setInterval(()=>{
        //   this.addRainStuffs();
        // },1000);
        // this.addRainStuffs();
        this.popIt();
    }

    InitCannon():void{
        this.world = new CANNON.World();
        this.world.gravity.set(0,-1,0);
        this.world.broadphase = new CANNON.NaiveBroadphase();

        this.NGravityWorld=new CANNON.World();


        this.planeMaterial = new CANNON.Material("planeMaterial");
        this.stuffMaterial = new CANNON.Material("stuffMaterial");
        let contactPlaneStuff = new CANNON.ContactMaterial(this.planeMaterial,this.stuffMaterial,{restitution:0.01,friction:0.1});
        this.world.addContactMaterial(contactPlaneStuff);
    }

    CannonPlane(){
        var shape = new CANNON.Plane();
        var body = new CANNON.Body({ mass: 0 , material:this.planeMaterial});
        body.addShape(shape);
        body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        body.position.set(0,-1,0);
        this.world.addBody(body);

        var planeGeometry = new THREE.PlaneGeometry( 100, 100 );
        planeGeometry.rotateX( - Math.PI / 2 );

        var planeMaterial = new THREE.ShadowMaterial({transparent:true});
        planeMaterial.opacity = 0.2;


        var plane = new THREE.Mesh( planeGeometry, planeMaterial);
        plane.position.set(0,-1,0);
        plane.receiveShadow = true;
        this.scene.add( plane );
    }

    CreateShadow(){
      let loader = new THREE.TextureLoader();
      let texture = loader.load('assets/images/roundshadow.png');
      let planeSize = 0.825;
      let shadowGeo = new THREE.PlaneBufferGeometry(planeSize,planeSize);
      let ShadowMat = new THREE.MeshBasicMaterial({
        map:texture,
        transparent:true,
        opacity:0.6,
        depthWrite:false,
      })
      this.RoundShadow = new THREE.Mesh(shadowGeo,ShadowMat);
      this.RoundShadow.position.set(0,-0.99,0);
      this.RoundShadow.rotation.x=-Math.PI/2;
      this.scene.add(this.RoundShadow);
    }
    
    CreateSmoke(){
        let geometry = new THREE.SphereBufferGeometry(.068);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        this.smokeThree = new THREE.Mesh(geometry,material);
        this.smokeThree.castShadow=true;
    }

    CreatePipe(){
        let geometry = new THREE.CylinderBufferGeometry(.025,.025,.048,8);
        let material = new THREE.MeshStandardMaterial({color:0xfcfcfc,metalness:0,roughness:0.5})
        this.Pipe = new THREE.Mesh(geometry,material);
        this.Pipe.castShadow=true;

        let geometry02 = new THREE.BoxBufferGeometry(.08,.04,.08);
        let material02 = new THREE.MeshStandardMaterial({color:0xffffff,metalness:0,roughness:1})
        this.ThreeStuff = new THREE.Mesh(geometry02,material02);
        this.ThreeStuff.castShadow=true;
    }
    
    CreateFireExtinguisher(){
        let N = 27;
        let lastBody = null;
        let distaince = .04;
        let x=0;
        let height = .595;
        let pipeshape = new CANNON.Cylinder(.025,.025,.04,8);
        let quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
        quat.normalize();
        for(var i=0;i<N;i++){
            var pipebody = new CANNON.Body({mass: i==0 ? 0 : 1});
            pipebody.addShape(pipeshape,new CANNON.Vec3,quat);
            pipebody.position.set(i*distaince+x,height,0);
            pipebody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),Math.PI/2);
            pipebody.angularDamping = 0.99;
            pipebody.linearDamping = 0.99;
            this.NGravityWorld.addBody(pipebody);
            this.PipeCannon.push(pipebody);

            // let pipe3 = this.Pipe.clone();
            // this.PipeThree.push(pipe3);
            // this.scene.add(pipe3);
            
            if(lastBody!==null){
                let c = new CANNON.LockConstraint(pipebody, lastBody);
                this.NGravityWorld.addConstraint(c);
            }
  
            // Keep track of the lastly added body
            lastBody = pipebody;
        }

        // LAST PIPE
        this.lastpipe = new CANNON.Body({mass:1});
        let cylinderShape = new CANNON.Cylinder(.06,.08,.16,16);
        this.lastpipe.addShape(cylinderShape,new CANNON.Vec3,quat);


        this.lastpipe.position.set(N*distaince+x+0.06,height,0);
        this.lastpipe.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),Math.PI/2);
        this.lastpipe.angularDamping = 0.99;
        this.lastpipe.linearDamping = 0.99;

        this.NGravityWorld.addBody(this.lastpipe);
        // this.PipeCannon.push(this.lastpipe);
        this.bodies02.push(this.lastpipe);

        let c = new CANNON.LockConstraint(this.lastpipe, lastBody);
        this.NGravityWorld.addConstraint(c);

        // pipe part
        let lastpipegeometry = new THREE.CylinderBufferGeometry(.06,.08,.16,16);
        let lastpipematerial = new THREE.MeshBasicMaterial({transparent:true,opacity:0})
        let lasspipethree = new THREE.Mesh(lastpipegeometry,lastpipematerial);
        lasspipethree.castShadow=true;
        let lastthreemesh = new THREE.Object3D();

        this.lastthreepipe=new THREE.Object3D();
        this.loader = new GLTFLoader();
        this.loader.load(
            'assets/model/pipe.glb',
            (gltf)=>{
                lastthreemesh=gltf.scene;
                lastthreemesh.children["0"].material.copy(
                  new THREE.MeshStandardMaterial({color: 0xf26464,metalness:0,roughness:0.5}));
                this.lastthreepipe.add(lastthreemesh)
            }
        );

        

        let boxGeo = new THREE.BoxGeometry(0.05,0.05,0.05);
        var invisible = new THREE.MeshBasicMaterial({color:0xf0f0f0,transparent:true,opacity:0});
        // smoke start
        this.FETap = new THREE.Mesh(boxGeo,invisible);
        this.FETap.position.set(0,0,0);
        // smoke end
        this.SmokePoint = new THREE.Mesh(boxGeo,invisible);
        this.SmokePoint.position.set(0,-1.5,0);
        // reset point
        this.ResetPoint = new THREE.Mesh(boxGeo,invisible);
        this.ResetPoint.position.set(0,0,0);

        
        this.lastthreepipe.add(this.SmokePoint);
        this.lastthreepipe.add(this.ResetPoint);
        this.lastthreepipe.add(this.FETap);
        this.lastthreepipe.add(lasspipethree);

        this.scene.add(this.lastthreepipe);
        // this.PipeThree.push(this.lastthreepipe)
        this.meshes02.push(this.lastthreepipe)

        let febox = new THREE.CylinderBufferGeometry(0.06,0.08,0.16,16);
        let Dragmaterial = new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0})
        // DRAG POINT THREE
        let DragPointThree = new THREE.Mesh(febox,Dragmaterial);
        DragPointThree.position.set(this.lastpipe.position.x,height,0);
        DragPointThree.rotation.set(0,0,Math.PI/2);
        this.scene.add(DragPointThree);
        this.DragPointThree.push(DragPointThree);
        

        this.loader.load(
            // 'assets/model/extinguisher.glb',
            'assets/model/shitty.glb',
            (gltf)=>{
              gltf.scene.traverse((node)=>{
                if(node instanceof THREE.Mesh){
                  node.castShadow=true;
                }
              });
                this.FireExtinguisher=gltf.scene;
                // this.FireExtinguisher.scale.set(0.32,0.32,0.32);
                // this.FireExtinguisher.position.set(0,-0.3,0);
                this.FireExtinguisher.children["0"].children["0"].material.copy(
                new THREE.MeshStandardMaterial({color: 0xf26464,metalness:0,roughness:0.5}));
                this.FireExtinguisher.children["0"].children["2"].material.copy(
                new THREE.MeshStandardMaterial({color:0xfcfcfc,metalness:0.02,roughness:0.5}));
                
                this.FETHREE.add(this.FireExtinguisher);
            }
        );
        this.FETHREE.position.set(-0.1,-0.3,0);
        this.FETHREE.rotation.set(0*Math.PI/180,-20*Math.PI/180,0*Math.PI/180);
        this.FETHREE.castShadow=true;
        this.scene.add(this.FETHREE);

        
        // CANNON FE
        var body = new CANNON.Body({ mass: 0 });
        var CylinderShape = new CANNON.Cylinder(0.3, 0.3, 1.24, 16);
        quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
        quat.normalize();

        let y=0.2;
        let sphere = new CANNON.Sphere(0.3);
        let sphere2 = new CANNON.Sphere(0.063);

        let cylinder = new CANNON.Cylinder(0.063,0.063,0.165,8);
        let cylinder02 = new CANNON.Cylinder(0.04,0.04,0.05,8);
        let cylinder03 = new CANNON.Cylinder(0.063,0.063,0.025,16);
        let top = 0.95;

        let box = new CANNON.Box(new CANNON.Vec3(0.18,0.02,0.05));
        let box02 = new CANNON.Box(new CANNON.Vec3(0.18,0.02,0.06));
        let box03 = new CANNON.Box(new CANNON.Vec3(0.05,0.05,0.01));
        let box04 = new CANNON.Box(new CANNON.Vec3(0.05,0.025,0.01));

        let box05 = new CANNON.Box(new CANNON.Vec3(0.08,0.02,0.06));

        let box06 = new CANNON.Box(new CANNON.Vec3(0.1,0.01,0.06));

        
        
        body.addShape(cylinder, new CANNON.Vec3(0,0.7+y,0), quat);

        quat = new CANNON.Quaternion(0.5, 0.5, 0.5, 0.5);
        quat.normalize();
        body.addShape(cylinder02, new CANNON.Vec3(0.09,0.694+y,0), quat);
        body.addShape(cylinder03, new CANNON.Vec3(-0.015,0.7+y,0.075));
        quat = new CANNON.Quaternion(-0.07, 0.5, 0, 0);
        quat.normalize();

        body.addShape(box, new CANNON.Vec3(-0.28,0.76+y,0), quat);

        quat = new CANNON.Quaternion(0.11, 0.5, 0, 0);
        quat.normalize();
        body.addShape(box02, new CANNON.Vec3(-0.07,0.9+y,0), quat);

        body.addShape(box03, new CANNON.Vec3(-0.05,0.84+y,0.05));
        body.addShape(box04, new CANNON.Vec3(0.05,0.815+y,0.05));

        body.addShape(box03, new CANNON.Vec3(-0.05,0.84+y,-0.05));
        body.addShape(box04, new CANNON.Vec3(0.05,0.815+y,-0.05));

        body.addShape(box05, new CANNON.Vec3(-0.31,0.98+y,0));

        body.addShape(box06, new CANNON.Vec3(0,0.79+y,0));

        for (let i = 0; i < 4; i++) {
            body.addShape(sphere2, new CANNON.Vec3(0,top,0));
            top-=0.03;
        }

        let boxCy01 = new CANNON.Box(new CANNON.Vec3(0.025,0.0275,0.0275));
        quat = new CANNON.Quaternion(0.5, 0, 0, 0.25);
        quat.normalize();
        body.addShape(boxCy01, new CANNON.Vec3(0.09,0.694+y,0),quat);
        body.addShape(boxCy01, new CANNON.Vec3(0.09,0.694+y,0));

        let boxCy02 = new CANNON.Box(new CANNON.Vec3(0.045,0.045,0.015));
        body.addShape(boxCy02, new CANNON.Vec3(-0.015,0.7+y,0.075));
        quat = new CANNON.Quaternion(0.5, 0.25, 0, 0);
        quat.normalize();
        body.addShape(boxCy02, new CANNON.Vec3(-0.015,0.7+y,0.075),quat);


        quat = new CANNON.Quaternion(0.5, 0, 0, 0.5);
        quat.normalize();
        let cylinder04 = new CANNON.Cylinder(0.3,0.26,0.15,16);
        let cylinder05 = new CANNON.Cylinder(0.26,0.1,0.15,16);
        body.addShape(cylinder04, new CANNON.Vec3(0,0.4+y,0), quat);
        body.addShape(cylinder05, new CANNON.Vec3(0,0.54+y,0), quat);

        
        body.addShape(CylinderShape, new CANNON.Vec3(0,-.28+y,0),quat)

        top = 0.525;
        for (let i=0;i<25;i++){
            body.addShape(sphere, new CANNON.Vec3(0,top,0));
            top-=0.05;
        }

        body.position.set(-0.1, -0.3, 0);
        this.NGravityWorld.addBody(body);
        this.world.addBody(body);

        // this.dragControl = new DragControls(this.DragPointThree,this.camera,this.canvas);
        body.position.copy(new CANNON.Vec3(this.FETHREE.position.x,this.FETHREE.position.y,this.FETHREE.position.z));
        body.quaternion.copy(new CANNON.Quaternion(this.FETHREE.quaternion.x,this.FETHREE.quaternion.y,this.FETHREE.quaternion.z,this.FETHREE.quaternion.w));
        
        this.PipeCannon[0].position.set(0,0.59,0.02);
        // this.PipeCannon[0].quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,0),-20*Math.PI/180);

        // this.PipeCannon[0].quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),-10*Math.PI/180);
        this.CreateFirstDirectionPipe();
    }

    addRainStuffs(){
      let quat = new CANNON.Quaternion();
      let triangle = new CANNON.Body({mass:0});
      let CylinderShape = new CANNON.Cylinder(0.35,0.35,.1,5);
      quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
      quat.normalize();
      triangle.addShape(CylinderShape,new CANNON.Vec3,quat);
      // triangle.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI/2)
      triangle.position.set(-1.5,-0.94,0);
      this.world.addBody(triangle);
      this.bodies02.push(triangle);

      let cylinderThree = new THREE.CylinderBufferGeometry(.35,.35,.1,5);
      let cylinderMaterial = new THREE.MeshStandardMaterial({metalness:0,roughness:0.5,color:0xAFE6E9});
      let cylinderMesh = new THREE.Mesh(cylinderThree,cylinderMaterial);
      cylinderMesh.castShadow=true;
      this.scene.add(cylinderMesh);
      this.meshes02.push(cylinderMesh);

      // triangle.addEventListener("collide",function(e){
      //   this.world.remove(triangle);
      // });

      var x = 0.162;
      var y = 0.0235;
      var z = 0.02;
      var shape = new CANNON.Box(new CANNON.Vec3(x, y, z));
      var hexagonBody = new CANNON.Body({ mass: 50 });

      quat = new CANNON.Quaternion(1, 0, -0.575, 0);
      quat.normalize();
      hexagonBody.addShape(shape, new CANNON.Vec3(-0.225,0,-0.13),quat);

      quat = new CANNON.Quaternion(1, 0, 0.575, 0);
      quat.normalize();
      hexagonBody.addShape(shape, new CANNON.Vec3(-0.225,0,0.13),quat);

      hexagonBody.addShape(shape, new CANNON.Vec3(0,0,-0.26));

      hexagonBody.addShape(shape, new CANNON.Vec3(0,0,0.26));

      quat = new CANNON.Quaternion(1, 0, 0.575, 0);
      quat.normalize();
      hexagonBody.addShape(shape, new CANNON.Vec3(0.225,0,-0.13),quat);

      quat = new CANNON.Quaternion(1, 0, -0.575, 0);
      quat.normalize();
      hexagonBody.addShape(shape, new CANNON.Vec3(0.225,0,0.13),quat);

      let sphere = new CANNON.Sphere(0.075);
      hexagonBody.addShape(sphere);


      hexagonBody.position.set(-1.5, 0, 0);
      this.world.addBody(hexagonBody);
      

      let hexagon = new THREE.Object3D();

      let hexagonMaterial = new THREE.MeshStandardMaterial({metalness:0,roughness:0.5,color:0xAFE6E9});
      let sphereMaterial = new THREE.MeshStandardMaterial({metalness:0,roughness:0.5,color:0xAFE6E9});

      this.loader = new GLTFLoader();
        this.loader.load(
            'assets/model/hexagon.glb',
            (gltf)=>{
              hexagon = gltf.scene;
              hexagon.children["0"].children["0"].material.copy(hexagonMaterial);
              hexagon.children["0"].children["1"].material.copy(sphereMaterial);
              hexagon.scale.set(1.5, 1.5, 1.5);
              this.scene.add(hexagon);
              this.meshes02.push(hexagon);
              this.bodies02.push(hexagonBody);
            }
        );

      let lockConstraint01 = new CANNON.PointToPointConstraint(triangle,new CANNON.Vec3(0,0.4,0),hexagonBody,new CANNON.Vec3(0,0,0));
      this.world.addConstraint(lockConstraint01);
    
    }


    private drone = new THREE.Group();
    popIt(){
      // Fan
      let quat = new CANNON.Quaternion();
      let hexagonMaterial = new THREE.MeshStandardMaterial({metalness:0,roughness:0.5,color:0xAFE6E9});
      let sphereMaterial = new THREE.MeshStandardMaterial({metalness:0,roughness:0.5,color:0xAFE6E9});
      quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
      quat.normalize();





      // var Box = new CANNON.Body({ mass: 0 });
      // var boxShape = new CANNON.Cylinder(.1,.1,.1,12);
      // Box.addShape(boxShape,new CANNON.Vec3(),quat);

      // boxShape = new CANNON.Cylinder(.2,.2,.1,24);
      // Box.addShape(boxShape,new CANNON.Vec3(0,-0.1,0),quat);

      // boxShape = new CANNON.Cylinder(.3,.3,.12,24);
      // Box.addShape(boxShape,new CANNON.Vec3(0,-0.21,0),quat);

      // boxShape = new CANNON.Cylinder(.4,.4,.25,24);
      // Box.addShape(boxShape,new CANNON.Vec3(0,-0.395,0),quat);

      // boxShape = new CANNON.Cylinder(.75,.75,.15,24);
      // Box.addShape(boxShape,new CANNON.Vec3(0,-0.595,0),quat);

      // Box.position.set(2,-0.32,0);
      // this.world.addBody(Box);

      
      // this.loader.load('assets/model/cake.glb', 
      //   (gltf)=>{
      //     gltf.scene.traverse((node)=>{
      //       if(node instanceof THREE.Mesh){
      //         node.castShadow=true;
      //       }
      //     });
      //     var cake = gltf.scene;
      //     cake.position.set(2,-0.32,0);
      //     cake.rotation.set(0,0,0);
      //     this.scene.add(cake);
      //   }
      // );

      
      var fanBody = new CANNON.Body({mass:1000,fixedRotation:true});

      let x = 0.22;
      let y = 0.012;
      let z = 0.15;
      var fanshape = new CANNON.Box(new CANNON.Vec3(x, y, z));
      var fancylinder = new CANNON.Cylinder(0.05,0.05,0.082,8);

      fanBody.addShape(fancylinder,new CANNON.Vec3(0,0.089,-0.001),quat);
      fanBody.angularVelocity.set(0,-10,0);

      quat = new CANNON.Quaternion(1, 0, 0, -0.175);
      quat.normalize();
      fanBody.addShape(fanshape, new CANNON.Vec3(0.27,0.089,.028),quat);

      quat = new CANNON.Quaternion(1, 0.075, 0.38, -0.175);
      quat.normalize();
      fanBody.addShape(fanshape, new CANNON.Vec3(0.17,0.089,0.21),quat);

      quat = new CANNON.Quaternion(1, 0.18, 1, -0.175);
      quat.normalize();
      fanBody.addShape(fanshape, new CANNON.Vec3(-.025,0.089,0.27),quat);

      quat = new CANNON.Quaternion(1, 0.075,-0.38,0.175);
      quat.normalize();
      fanBody.addShape(fanshape, new CANNON.Vec3(-.21,0.089,0.175),quat);

      quat = new CANNON.Quaternion(1, 0,0,0.175);
      quat.normalize();
      fanBody.addShape(fanshape, new CANNON.Vec3(-.27,0.089,-0.028),quat);

      quat = new CANNON.Quaternion(1, -0.075,0.38,0.175);
      quat.normalize();
      fanBody.addShape(fanshape, new CANNON.Vec3(-.17,0.089,-0.21),quat);

      quat = new CANNON.Quaternion(1, -0.18, 1, 0.175);
      quat.normalize();
      fanBody.addShape(fanshape, new CANNON.Vec3(.025,0.089,-0.27),quat);

      quat = new CANNON.Quaternion(1, -0.075,-0.38,-0.175);
      quat.normalize();
      fanBody.addShape(fanshape, new CANNON.Vec3(.21,0.089,-0.175),quat);

      fanBody.addShape(new CANNON.Box(new CANNON.Vec3(.2,.2,.2)),new CANNON.Vec3(0,-.2,0));
      this.FEcannon.push(fanBody);
      this.world.addBody(fanBody);
      
      this.loader.load('assets/model/fananimation.glb', 
        (gltf)=>{
          gltf.scene.traverse((node)=>{
            if(node instanceof THREE.Mesh){
              node.castShadow=true;
            }
          });
          this.fan = gltf.scene;
          this.fan.scale.set(.25, .25, .25);
          this.fan.children["0"].children["0"].material.copy(hexagonMaterial);
          this.fan.children["0"].children["1"].material.copy(sphereMaterial);

          this.mixer = new THREE.AnimationMixer(this.fan);
          this.mixer.clipAction(gltf.animations[0]).play();
          this.mixer.timeScale=0;
          this.drone.add(this.fan);


          gs.TweenLite.to(this.mixer,2,{timeScale:0.5,ease:gs.Power1.easeIn});
          // gs.TweenLite.to(this.drone.rotation,1,{z:,ease:gs.Power1.easeIn});
          // gs.TweenLite.to(this.drone.position,3.5,{bezier:{curviness:1.5,values:[
          //   {x:-3,y:0.3,z:1},
          //   {x:-1.5,y:0.9,z:2},
          //   {x:1.5,y:1.6,z:2},
          //   {x:3,y:2,z:1}],autoRotate:true},ease:gs.Power1.easeIn,delay:1.5});
        }
      );
      

      let presentBoxThree=new THREE.Mesh(
        new THREE.BoxBufferGeometry(.4,.4,.4),
        new THREE.MeshBasicMaterial({transparent:true,opacity:.2})
      );

      presentBoxThree.position.set(0,-.2,0);
      this.drone.add(presentBoxThree);
      

      this.drone.position.set(-2,2,1);
      // this.drone.rotation.set(Math.PI/10,0,0);
      this.scene.add(this.drone);
      this.scene.add(this.drone);
      this.FEthree.push(this.drone);


      // gs.TweenLite.to(this.drone.position,1.5,{y:1.5,delay:1,ease:gs.Power1.easeIn});
      



      let tl = new gs.TimelineMax({repeat:-1,delay:3});
       tl.to(this.drone.position,3,{x:2,y:2,z:1})
          .to(this.drone.position,3,{x:-2,y:2,z:1});
      // tl.addLabel("Right1","+=0")
        // .to(this.drone.position,2,{bezier:{curviness:1.5,values:[
        //   {x:-2,z:2},
        //   {x:-1,z:2.5},
        //   {x:1,z:1.5},
        //   {x:2,y:2,z:0}],autoRotate:true},ease:gs.Power1.easeInOut},"Right1")
        // .to(this.drone.position,2,{x:2,y:2,z:0},"Right1")
        // .to(this.drone.rotation,2,{z:0},"Right1");


      let stuffThree = new THREE.Mesh(new THREE.BoxBufferGeometry(.2,.2,.2),
        new THREE.MeshBasicMaterial({color:0x00a8f3}));
      stuffThree.castShadow=true;


      // let testShape = new CANNON.Box(new CANNON.Vec3(1,1,1));
      // let testBody = new CANNON.Body({mass:1000});
      // testBody.addShape(testShape);
      // testBody.position.set(2,2,0);
      // this.bodies03.push(testBody);
      // this.world.addBody(testBody);
      // var i=1;
      // testBody.addEventListener("collide",(e)=>{
      //     if(e.contact.bi.collisionFilterGroup==2){
      //       testThree.scale.x=i*1;
      //       testThree.scale.y=i*1;
      //       testThree.scale.z=i*1;

      //       testShape.halfExtents.set(i*1,i*1,i*1);
      //       testShape.updateConvexPolyhedronRepresentation();
      //       i-=.001;
      //     }
      // });

      // let testThree = stuffThree.clone();
      // this.scene.add(testThree);
      // this.meshes03.push(testThree);


      let tempCannon = new CANNON.Body({mass:0,material:this.stuffMaterial});
      let tempThree = stuffThree.clone();

      let collided = [];
      let unique=[];

      
      setInterval(()=>{
        if(this.meshes03.length>20){
          if(collided.length>0){
            unique = collided.filter(function(elem, index, self) {
              return index === self.indexOf(elem);
            })
  
            collided=unique;
  
            let stuff= new CANNON.Body({mass:10,material:this.stuffMaterial});
            let stuffShape = new CANNON.Box(new CANNON.Vec3(.1,.1,.1));
            stuff.addShape(stuffShape);
            stuff.position.set(this.drone.position.x,this.drone.position.y-1,this.drone.position.z);
      
            this.world.addBody(stuff);
            let stuff3 = stuffThree.clone();
            this.scene.add(stuff3);
  
            this.bodies03.splice(collided[0],1,stuff);
            this.meshes03.splice(collided[0],1,stuff3);
            var test02 = collided[0];
            stuff.addEventListener("collide",(e)=>{
              if(e.contact.bi.collisionFilterGroup==2){
                setTimeout(()=>{
                  if(stuff3.scale.x > 0.1){
                    stuff3.scale.x*=0.95;
                    stuff3.scale.y*=0.95;
                    stuff3.scale.z*=0.95;

                    stuffShape.halfExtents.set(.1*stuff3.scale.x,.1*stuff3.scale.y,.1*stuff3.scale.z);
                    stuffShape.updateConvexPolyhedronRepresentation();
                  } else {
                    this.world.remove(stuff);
                    this.scene.remove(stuff3);
                    this.meshes03.splice(test02,1,tempCannon);
                    this.bodies03.splice(test02,1,tempThree);
                    collided.push(test02);
                  }
                },50);
              }
            });
            collided.shift();
          }
        } else {
          let stuff= new CANNON.Body({mass:10,material:this.stuffMaterial});
          let stuffShape = new CANNON.Box(new CANNON.Vec3(.1,.1,.1));
          stuff.addShape(stuffShape);
          stuff.position.set(this.drone.position.x,this.drone.position.y-1,this.drone.position.z);
    
          this.world.addBody(stuff);
          let stuff3 = stuffThree.clone();
          this.scene.add(stuff3);

          this.bodies03.push(stuff);
          this.meshes03.push(stuff3);

          var test = this.bodies03.length-1;
          stuff.addEventListener("collide",(e)=>{
            if(e.contact.bi.collisionFilterGroup==2){
              setTimeout(()=>{
                if(stuff3.scale.x > 0.1){
                  stuff3.scale.x*=0.95;
                  stuff3.scale.y*=0.95;
                  stuff3.scale.z*=0.95;

                  stuffShape.halfExtents.set(.1*stuff3.scale.x,.1*stuff3.scale.y,.1*stuff3.scale.z);
                  stuffShape.updateConvexPolyhedronRepresentation();
                } else {
                  this.world.remove(stuff);
                  this.scene.remove(stuff3);
                  this.meshes03.splice(test,1,tempCannon);
                  this.bodies03.splice(test,1,tempThree);
                  collided.push(test);
                }
              },50);
            }
          });
        }
      },1000)
 
    }

    addEvent(){
      // let Interval;
      // this.dragControl.addEventListener('dragstart',() =>{
      //     // this.controls.enableRotate=false;
      //     this.dragging=true;
      //     this.RemoveDirectionPipe();
      //     this.CreateDirectionPipe();
      //     Interval=setInterval(()=>{
      //       this.DragPoint.position.copy(this.DragPointThree[0].position);
      //       this.shootSmoke();
      //     },10)
      // });
      // this.dragControl.addEventListener('dragend',() =>{
      //     // this.controls.enableRotate = true;
      //     this.dragging=false;
          
      //     clearInterval(Interval);
      // });
    }

    CreateDirectionPipe(){
      // DIRECTION PIPE
      this.directionPipe = new CANNON.Body({mass:2.5});
      let sphereshape = new CANNON.Sphere(.01);
      this.directionPipe.collisionFilterMask=4;
      
      this.directionPipe.addShape(sphereshape);
      this.directionPipe.position.set(this.lastpipe.position.x,this.lastpipe.position.y,this.lastpipe.position.z);
      this.world.addBody(this.directionPipe);
      this.FEcannon.push(this.directionPipe);

      this.lockConstraint = new CANNON.LockConstraint(this.directionPipe, this.lastpipe);
      this.world.addConstraint(this.lockConstraint);

      let directionThree = new THREE.SphereBufferGeometry(0.01);
      
      let Dragmaterial02 = new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0})
      
      this.DragPoint = new THREE.Mesh(directionThree,Dragmaterial02);
      this.DragPoint.rotation.set(0,0,Math.PI/2);
      this.DragPoint.position.set(this.lastpipe.position.x,this.lastpipe.position.y,this.lastpipe.position.z);
      this.scene.add(this.DragPoint);
      this.FEthree.push(this.DragPoint);
    }

    CreateFirstDirectionPipe(){
      // DIRECTION PIPE
      this.directionPipe = new CANNON.Body({mass:5});
      // let sphereshape = new CANNON.Box(new CANNON.Vec3(.05,.05,.05));
      let sphereshape = new CANNON.Sphere(.02);
      this.directionPipe.collisionFilterMask=4;
      
      this.directionPipe.angularDamping=0.1;
      this.directionPipe.linearDamping=0.1;
      this.directionPipe.addShape(sphereshape);
      this.directionPipe.position.set(this.lastpipe.position.x,this.lastpipe.position.y,this.lastpipe.position.z);
      this.NGravityWorld.addBody(this.directionPipe);
      this.FEcannon.push(this.directionPipe);

      this.lockConstraint = new CANNON.LockConstraint(this.directionPipe, this.lastpipe);
      this.NGravityWorld.addConstraint(this.lockConstraint);

      let directionThree = new THREE.SphereBufferGeometry(0.01);
      
      let Dragmaterial02 = new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0})
      
      this.DragPoint = new THREE.Mesh(directionThree,Dragmaterial02);
      this.DragPoint.rotation.set(0,0,Math.PI/2);
      this.DragPoint.position.set(this.lastpipe.position.x,this.lastpipe.position.y,this.lastpipe.position.z);
      this.scene.add(this.DragPoint);
      this.FEthree.push(this.DragPoint);

    }

    RemoveDirectionPipe(){
      this.world.removeConstraint(this.lockConstraint);
      this.world.remove(this.directionPipe);
      this.scene.remove(this.DragPoint);
      this.FEcannon.shift();
      this.FEthree.shift();
    }
    

    Easing = [
        'gs.Power0.easeOut',
        'gs.Power1.easeOut',
        'gs.Power2.easeOut',
        'gs.Power3.easeOut',
    ];
    

    shootSmoke(){
        var vectorF = new THREE.Vector3();
        var vectorD = new THREE.Vector3();
        vectorF.setFromMatrixPosition(this.ResetPoint.matrixWorld);
        vectorD.setFromMatrixPosition(this.SmokePoint.matrixWorld);

        let smoke = this.smokeThree.clone();
        this.scene.add(smoke);
        this.meshes.push(smoke);

        let body = new CANNON.Body({mass:.1});
        body.addShape(this.sphereShape);
        body.position.set(vectorF.x, vectorF.y, vectorF.z);

        body.collisionFilterGroup=2;
        body.collisionFilterMask=1;

        this.world.addBody(body);
        this.bodies.push(body);

        gs.TweenLite.to(smoke.scale,0.7,{x:.05,y:.05,z:.05,delay:0.5,ease: gs.Power2.easeIn});

        let startPosition = new CANNON.Vec3(vectorF.x, vectorF.y, vectorF.z);
        let endPosition = new CANNON.Vec3(
          vectorD.x+(Math.random()*0.2 * (Math.random() < 0.5 ? -1 : 1)),
          vectorD.y+(Math.random()*0.2 * (Math.random() < 0.5 ? -1 : 1)),
          vectorD.z+(Math.random()*0.2 * (Math.random() < 0.5 ? -1 : 1))
        );
        
        let direction = new CANNON.Vec3();
        endPosition.vsub(startPosition, direction);
        
        let totalLength = this.distance(direction.x,direction.y,direction.z,0,0,0);
        direction.normalize();
        

        let speed = totalLength / this.tweenTime;

        direction.scale(speed, body.velocity);

        gs.TweenLite.to(body.velocity,2.5,{x:0,y:0,z:0,ease: gs.Power0.easeIn});

        setTimeout(() => {
          this.scene.remove(smoke);
          this.world.remove(body);
          this.bodies.shift();
          this.meshes.shift();
        }, 1200);
    }

    distance(x,y,z,vx,vy,vz){
        var dx = x-vx;
        var dy = y-vy;
        var dz = z-vz;
        return Math.sqrt(dx*dx + dy * dy + dz * dz);
    }

    clearSmokeInterval(){
        clearInterval(this.hold1);
        clearInterval(this.hold3);
        clearInterval(this.hold2);
        clearInterval(this.hold5);
    }

    animate():void{
        window.addEventListener('DOMContentLoaded', () => {
            this.render();
            // setInterval(()=>{
            //   this.lastCallTime=0;
            // },1000);
        });

        window.addEventListener('mouseup', (e) => {
            this.clearSmokeInterval();
        }, false);

        window.addEventListener('mousemove', (e) => {

          e.preventDefault();

          this.raycaster.setFromCamera(this.mouse, this.camera);
      
          this.plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(this.plane.normal), this.DragPointThree[0].position);
  
          var rect = this.canvas.getBoundingClientRect();
      
          this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
          this.raycaster.setFromCamera(this.mouse, this.camera);

          if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
            this.DragPointThree[0].position.copy(this.intersection.sub(this.offset));
          }

        }, false);

        window.addEventListener('touchmove', (e) => {

          e.preventDefault();


          this.raycaster.setFromCamera(this.mouse, this.camera);
      
          this.plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(this.plane.normal), this.DragPointThree[0].position);
  
          var rect = this.canvas.getBoundingClientRect();
          
          this.mouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
          this.mouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
      
          this.raycaster.setFromCamera(this.mouse, this.camera);

          if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
            this.DragPointThree[0].position.copy(this.intersection.sub(this.offset));
          }

        }, false);
        

        window.addEventListener('mouseleave', () => {
            this.clearSmokeInterval();
        }, false);

        window.addEventListener('mousedown', (e) => {
            e.preventDefault();
            
            if(e.which == 3){
                // right
                this.hold3=setInterval(() => {
                    this.shootSmoke();
                }, 8);
            } else if(e.which == 2){
                // middle
                this.hold2=setInterval(() => {
                    this.shootSmoke();
                }, 8);
            } else if(e.which == 5){
                // next
                this.hold5=setInterval(() => {
                    this.shootSmoke();
                }, 8);
              }
             else {
                this.hold1=setInterval(() => {
                    this.shootSmoke();
                }, 8);
            }
        }, false);

        window.addEventListener('touchstart', (e) => {
          e.preventDefault();
          
          this.hold1=setInterval(() => {
            this.shootSmoke();
          }, 8);
        }, false);

        window.addEventListener('touchend', () => {
          this.clearSmokeInterval();
        }, false);
        
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    render() {
        requestAnimationFrame(() => {
          this.render();
        });
        if ( this.mixer ) this.mixer.update( this.clock.getDelta() );
        // console.log(this.clock)
        // this.lastCallTime++;
        // console.log(this.lastCallTime)
        this.world.step(1/60);
        this.NGravityWorld.step(1/60);
        this.testing();
        this.updateMeshPositions();
        this.renderer.render(this.scene, this.camera);
    }

    private PipeCurve;
    testing(){
      this.scene.remove(this.curvePipe);
      this.curvePipe.geometry.dispose();
      
      this.PipeCurve = new THREE.CatmullRomCurve3( [
        new THREE.Vector3(this.PipeCannon[0].position.x,this.PipeCannon[0].position.y,this.PipeCannon[0].position.z),
        new THREE.Vector3(this.PipeCannon[1].position.x,this.PipeCannon[1].position.y,this.PipeCannon[1].position.z),
        new THREE.Vector3(this.PipeCannon[2].position.x,this.PipeCannon[2].position.y,this.PipeCannon[2].position.z),
        new THREE.Vector3(this.PipeCannon[3].position.x,this.PipeCannon[3].position.y,this.PipeCannon[3].position.z),
        new THREE.Vector3(this.PipeCannon[4].position.x,this.PipeCannon[4].position.y,this.PipeCannon[4].position.z),
        new THREE.Vector3(this.PipeCannon[5].position.x,this.PipeCannon[5].position.y,this.PipeCannon[5].position.z),
        new THREE.Vector3(this.PipeCannon[6].position.x,this.PipeCannon[6].position.y,this.PipeCannon[6].position.z),
        new THREE.Vector3(this.PipeCannon[7].position.x,this.PipeCannon[7].position.y,this.PipeCannon[7].position.z),
        new THREE.Vector3(this.PipeCannon[8].position.x,this.PipeCannon[8].position.y,this.PipeCannon[8].position.z),
        new THREE.Vector3(this.PipeCannon[9].position.x,this.PipeCannon[9].position.y,this.PipeCannon[9].position.z),
        new THREE.Vector3(this.PipeCannon[10].position.x,this.PipeCannon[10].position.y,this.PipeCannon[10].position.z),
        new THREE.Vector3(this.PipeCannon[11].position.x,this.PipeCannon[11].position.y,this.PipeCannon[11].position.z),
        new THREE.Vector3(this.PipeCannon[12].position.x,this.PipeCannon[12].position.y,this.PipeCannon[12].position.z),
        new THREE.Vector3(this.PipeCannon[13].position.x,this.PipeCannon[13].position.y,this.PipeCannon[13].position.z),
        new THREE.Vector3(this.PipeCannon[14].position.x,this.PipeCannon[14].position.y,this.PipeCannon[14].position.z),
        new THREE.Vector3(this.PipeCannon[15].position.x,this.PipeCannon[15].position.y,this.PipeCannon[15].position.z),
        new THREE.Vector3(this.PipeCannon[16].position.x,this.PipeCannon[16].position.y,this.PipeCannon[16].position.z),
        new THREE.Vector3(this.PipeCannon[17].position.x,this.PipeCannon[17].position.y,this.PipeCannon[17].position.z),
        new THREE.Vector3(this.PipeCannon[18].position.x,this.PipeCannon[18].position.y,this.PipeCannon[18].position.z),
        new THREE.Vector3(this.PipeCannon[19].position.x,this.PipeCannon[19].position.y,this.PipeCannon[19].position.z),
        new THREE.Vector3(this.PipeCannon[20].position.x,this.PipeCannon[20].position.y,this.PipeCannon[20].position.z),
        new THREE.Vector3(this.PipeCannon[21].position.x,this.PipeCannon[21].position.y,this.PipeCannon[21].position.z),
        new THREE.Vector3(this.PipeCannon[22].position.x,this.PipeCannon[22].position.y,this.PipeCannon[22].position.z),
        new THREE.Vector3(this.PipeCannon[23].position.x,this.PipeCannon[23].position.y,this.PipeCannon[23].position.z),
        new THREE.Vector3(this.PipeCannon[24].position.x,this.PipeCannon[24].position.y,this.PipeCannon[24].position.z),
        new THREE.Vector3(this.PipeCannon[25].position.x,this.PipeCannon[25].position.y,this.PipeCannon[25].position.z),
        new THREE.Vector3(this.PipeCannon[26].position.x,this.PipeCannon[26].position.y,this.PipeCannon[26].position.z),
        // new THREE.Vector3(this.PipeCannon[27].position.x,this.PipeCannon[27].position.y,this.PipeCannon[27].position.z),
        // new THREE.Vector3(this.PipeCannon[28].position.x,this.PipeCannon[28].position.y,this.PipeCannon[28].position.z),
        // new THREE.Vector3(this.PipeCannon[29].position.x,this.PipeCannon[29].position.y,this.PipeCannon[29].position.z),
        this.lastthreepipe.position,
      ] );



      this.curvePipe = new THREE.Mesh(
        new THREE.TubeBufferGeometry(this.PipeCurve,32,0.025,8,false),
        new THREE.MeshStandardMaterial({color:0xfcfcfc,metalness:0,roughness:0.5}));
      this.curvePipe.castShadow=true;
      this.scene.add(this.curvePipe);
    }
    updateMeshPositions(){
        for(var i=0; i !== this.meshes.length; i++){
            this.meshes[i].position.copy(this.bodies[i].position);
            this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
        }
        for(var i=0; i !== this.meshes02.length; i++){
          this.meshes02[i].position.copy(this.bodies02[i].position);
          this.meshes02[i].quaternion.copy(this.bodies02[i].quaternion);
        }
        for(var i=0; i !== this.meshes03.length; i++){
          this.meshes03[i].position.copy(this.bodies03[i].position);
          this.meshes03[i].quaternion.copy(this.bodies03[i].quaternion);
          // this.bodies03[i].velocity.set(0,-1,0);
        }
        for(var i=0;i !== this.FEcannon.length;i++){
          this.FEcannon[i].position.copy(this.FEthree[i].position);
          this.FEcannon[i].quaternion.copy(this.FEthree[i].quaternion);
        }
        this.DragPoint.position.set(this.DragPointThree[0].position.x*0.7,this.DragPointThree[0].position.y*1.2,this.DragPointThree[0].position.z*1.5);
    }

    resize() {
        let width = window.innerWidth*window.devicePixelRatio;
        let height = window.innerHeight*window.devicePixelRatio;
    
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize( width, height );
    }
}


function DragControls(_objects, _camera, _domElement) {

    if (_objects instanceof THREE.Camera) {
  
      console.warn('THREE.DragControls: Constructor now expects ( objects, camera, domElement )');
      var temp = _objects;
      _objects = _camera;
      _camera = temp;
  
    }
  
    var _plane = new THREE.Plane();
    var _raycaster = new THREE.Raycaster();
  
    var _mouse = new THREE.Vector2();
    var _offset = new THREE.Vector3();
    var _intersection = new THREE.Vector3();
  
    var _selected = null,
      _hovered = null;
  
    //
  
    var scope = this;
  
    function activate() {
  
      _domElement.addEventListener('mousemove', onDocumentMouseMove, false);
      _domElement.addEventListener('mousedown', onDocumentMouseDown, false);
      _domElement.addEventListener('mouseup', onDocumentMouseCancel, false);
      _domElement.addEventListener('mouseleave', onDocumentMouseCancel, false);
      _domElement.addEventListener('touchmove', onDocumentTouchMove, false);
      _domElement.addEventListener('touchstart', onDocumentTouchStart, false);
      _domElement.addEventListener('touchend', onDocumentTouchEnd, false);
  
    }
  
    function deactivate() {
  
      _domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
      _domElement.removeEventListener('mousedown', onDocumentMouseDown, false);
      _domElement.removeEventListener('mouseup', onDocumentMouseCancel, false);
      _domElement.removeEventListener('mouseleave', onDocumentMouseCancel, false);
      _domElement.removeEventListener('touchmove', onDocumentTouchMove, false);
      _domElement.removeEventListener('touchstart', onDocumentTouchStart, false);
      _domElement.removeEventListener('touchend', onDocumentTouchEnd, false);
  
    }
  
    function dispose() {
  
      deactivate();
  
    }
  
    function onDocumentMouseMove(event) {
  
      event.preventDefault();
  
      var rect = _domElement.getBoundingClientRect();
  
      _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
      _raycaster.setFromCamera(_mouse, _camera);
  
      if (_selected && scope.enabled) {
  
        if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
  
          _selected.position.copy(_intersection.sub(_offset));

        }
  
        scope.dispatchEvent({
          type: 'drag',
          object: _selected
        });
  
        return;
  
      }
  
      _raycaster.setFromCamera(_mouse, _camera);
  
      var intersects = _raycaster.intersectObjects(_objects);
  
      if (intersects.length > 0) {
  
        var object = intersects[0].object;
  
        _plane.setFromNormalAndCoplanarPoint(_camera.getWorldDirection(_plane.normal), object.position);
  
        if (_hovered !== object) {
  
          scope.dispatchEvent({
            type: 'hoveron',
            object: object
          });
  
          _domElement.style.cursor = 'pointer';
          _hovered = object;
  
        }
  
      } else {
  
        if (_hovered !== null) {
  
          scope.dispatchEvent({
            type: 'hoveroff',
            object: _hovered
          });
  
          _domElement.style.cursor = 'auto';
          _hovered = null;
  
        }
  
      }
  
    }
  
    function onDocumentMouseDown(event) {
  
      event.preventDefault();
  
      _raycaster.setFromCamera(_mouse, _camera);
  
      var intersects = _raycaster.intersectObjects(_objects);
  
      if (intersects.length > 0) {
  
        _selected = intersects[0].object;
  
        if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
  
          _offset.copy(_intersection).sub(_selected.position);
          console.log(_selected.position)
        }
  
        _domElement.style.cursor = 'move';
  
        scope.dispatchEvent({
          type: 'dragstart',
          object: _selected
        });
  
      }
  
  
    }
  
    function onDocumentMouseCancel(event) {
  
      event.preventDefault();
  
      if (_selected) {
  
        scope.dispatchEvent({
          type: 'dragend',
          object: _selected
        });
  
        _selected = null;
  
      }
  
      _domElement.style.cursor = 'auto';
  
    }
  
    function onDocumentTouchMove(event) {
  
      event.preventDefault();
      event = event.changedTouches[0];
  
      var rect = _domElement.getBoundingClientRect();
  
      _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
      _raycaster.setFromCamera(_mouse, _camera);
  
      if (_selected && scope.enabled) {
  
        if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
  
          _selected.position.copy(_intersection.sub(_offset));
  
        }
  
        scope.dispatchEvent({
          type: 'drag',
          object: _selected
        });
  
        return;
  
      }
  
    }
  
    function onDocumentTouchStart(event) {
  
      event.preventDefault();
      event = event.changedTouches[0];
  
      var rect = _domElement.getBoundingClientRect();
  
      _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
      _raycaster.setFromCamera(_mouse, _camera);
  
      var intersects = _raycaster.intersectObjects(_objects);
  
      if (intersects.length > 0) {
  
        _selected = intersects[0].object;
  
        _plane.setFromNormalAndCoplanarPoint(_camera.getWorldDirection(_plane.normal), _selected.position);
  
        if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
  
          _offset.copy(_intersection).sub(_selected.position);
  
        }
  
        _domElement.style.cursor = 'move';
  
        scope.dispatchEvent({
          type: 'dragstart',
          object: _selected
        });
  
      }
  
  
    }
  
    function onDocumentTouchEnd(event) {
  
      event.preventDefault();
  
      if (_selected) {
  
        scope.dispatchEvent({
          type: 'dragend',
          object: _selected
        });
  
        _selected = null;
  
      }
  
      _domElement.style.cursor = 'auto';
  
    }
  
    activate();
  
    // API
  
    this.enabled = true;
  
    this.activate = activate;
    this.deactivate = deactivate;
    this.dispose = dispose;
  
    // Backward compatibility
  
    this.setObjects = function() {
  
      console.error('THREE.DragControls: setObjects() has been removed.');
  
    };
  
    this.on = function(type, listener) {
  
      console.warn('THREE.DragControls: on() has been deprecated. Use addEventListener() instead.');
      scope.addEventListener(type, listener);
  
    };
  
    this.off = function(type, listener) {
  
      console.warn('THREE.DragControls: off() has been deprecated. Use removeEventListener() instead.');
      scope.removeEventListener(type, listener);
  
    };
  
    this.notify = function(type) {
  
      console.error('THREE.DragControls: notify() has been deprecated. Use dispatchEvent() instead.');
      scope.dispatchEvent({
        type: type
      });
  
    };
  
  }
  
  DragControls.prototype = Object.create(THREE.EventDispatcher.prototype);
  DragControls.prototype.constructor = DragControls;
