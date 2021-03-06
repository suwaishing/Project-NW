import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as gs from 'gsap';
import * as OrbitControls from 'three-orbitcontrols';
import GLTFLoader from 'three-gltf-loader';
// import thisWork from 'three-dragcontrols';
import { Injectable } from '@angular/core';
import * as dat from 'dat.gui';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'

class LetterProperty {
  Object3D: THREE.Object3D
  ObjectBody: CANNON.Body
  Scene: THREE.Scene
  SetPoint: THREE.Mesh
  AttachPoint: THREE.Mesh
  AttachPointV: THREE.Vector3
  letterArray: CANNON.Body[]
  LConstraint: CANNON.LockConstraint
  DConstraint: CANNON.DistanceConstraint
  StringC: THREE.LineCurve3
  StringT: THREE.Mesh
  StringCA: THREE.LineCurve3
  StringTA: THREE.Mesh
  StringCAB: THREE.LineCurve3
  StringTAB: THREE.Mesh
  letterArrayA: CANNON.Body[]
  letterArrayAB: CANNON.Body[]
}

@Injectable({
  providedIn: 'root'
})

export class welcomeService {
  // THREE BASIC SETUP
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private scene: THREE.Scene;

  private loader: GLTFLoader;
  private dracoLoader;
  // CANNON BASIC SETUP
  private world = new CANNON.World();
  private world02 = new CANNON.World();

  private FireExtinguisher = new THREE.Object3D();
  private mixer: THREE.AnimationMixer;
  private clock = new THREE.Clock();

  private hold1 = null;
  private hold2 = null;
  private hold3 = null;
  private hold5 = null;

  // FPS
  private times = [];
  private fps:number;
  private now:number;

  // Fire Extinguisher
  private meshes = [];
  private bodies = [];
  private meshes02 = [];
  private bodies02 = [];
  private meshes03 = [];
  private bodies03 = [];
  smokeThree: THREE.Mesh;
  FETHREE = new THREE.Group();
  FETap = new THREE.Mesh();
  SmokePoint = new THREE.Mesh();
  MovePoint = new THREE.Mesh();
  ForcePoint = new THREE.Mesh();
  ResetPoint = new THREE.Mesh();
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
  DragPointThree = [];
  PipeDistance = new THREE.Vector3();
  dragging: boolean = false;
  lockConstraint;
  ThreeStuff = new THREE.Mesh();

  // Smoke
  sphereShape = new CANNON.Sphere(0.068);
  tweenTime = 0.6; // seconds
  boop;

  // GUI
  private gui = new dat.GUI();

  // Balloon Cursor
  private StringM = new THREE.MeshBasicMaterial();
  private BalloonM = new THREE.MeshLambertMaterial();
  private FirstCursor = new THREE.Vector3();
  private LastCursor = new THREE.Vector3();
  private LetterArray = [];
  private collided: boolean = false;

  // Drag Stuffs
  private curvePipe = new THREE.Mesh();

  private plane = new THREE.Plane();
  private raycaster = new THREE.Raycaster();

  private mouse = new THREE.Vector2();
  private offset = new THREE.Vector3();
  private intersection = new THREE.Vector3();

  InitThree(elementId: string): void {
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
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor("#a8b3d3", 0);
    // this.renderer.shadowMap.enabled=true;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // create the scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
    // this.camera.position.set(3,2,6);
    // this.camera.position.set(0,2,6.25);
    this.camera.position.set(0, 0, 4);
    this.camera.lookAt(new THREE.Vector3(0, 5, 0));
    this.scene.add(this.camera);

    // loader 
    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('assets/draco/');
    this.loader.setDRACOLoader(this.dracoLoader);


    //this.light = new THREE.AmbientLight(0xfafafa);
    // this.light.position.z = 10;
    //this.scene.add(this.light);
    this.controls = new OrbitControls(this.camera, this.canvas);
    // this.controls.target.set(0,3,0);

    // this.controls.minAzimuthAngle=.5;
    // this.controls.maxAzimuthAngle=.5;

    // this.controls.autoRotate=true;
    // this.controls.autoRotateSpeed=2;
    // this.controls.minPolarAngle=Math.PI/3;
    // this.controls.maxPolarAngle=Math.PI/2-0.1;
    this.controls.enableRotate = false;
    // this.controls.enableZoom=false;
    // this.controls.enablePan=false;
    // this.controls.rotateSpeed=0.5;

    // let amlight = new THREE.AmbientLight(0xffffff,1);
    // this.scene.add(amlight)

    // let hemiLight = new THREE.HemisphereLight(0xffffff, 0xff9396, 0.61);
    // let hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbbb, 0.58);

    // let hemiLight = new THREE.HemisphereLight(0xffffff, 0xdddddd, .5);
    // this.scene.add(hemiLight)

    // let hemiLight = new THREE.HemisphereLight(0xbbd0ec,0x8694ba, .2);
    // this.scene.add(hemiLight)

    // let shadow = new THREE.SpotLight(0xffffff,0);
    // shadow.shadow.mapSize.width=2048;
    // shadow.shadow.mapSize.height=2048;
    // shadow.castShadow=true;
    // shadow.lookAt(0,0,0);
    // shadow.position.set(0,10,-.25);
    // shadow.angle=0.35;
    // shadow.distance=50;

    // this.scene.add(shadow);

    // var shadowGUI={
    //   intensity:0,
    //   color:"#ffffff",
    //   x:0,
    //   y:10,
    //   z:-0.25,
    //   angle:.35,
    //   distance:50,
    //   penumbra:0.05,
    //   decay:2
    // }

    // var s = this.gui.addFolder("shadow");
    // s.addColor(shadowGUI,"color")
    //   .onChange(()=>{
    //     shadow.color.set(shadowGUI.color);
    //   });
    // s.add(shadowGUI,"intensity",0,1)
    //   .onChange(()=>{
    //     shadow.intensity=shadowGUI.intensity;
    //   });
    //   s.add(shadowGUI,"x",-20,20)
    //   .onChange(()=>{
    //     shadow.position.x=shadowGUI.x;
    //   });
    //   s.add(shadowGUI,"y",-20,20)
    //   .onChange(()=>{
    //     shadow.position.y=shadowGUI.y;
    //   });
    //   s.add(shadowGUI,"z",-20,20)
    //   .onChange(()=>{
    //     shadow.position.z=shadowGUI.z;
    //   });
    //   s.add(shadowGUI,"angle",0,1)
    //   .onChange(()=>{
    //     shadow.angle=shadowGUI.angle;
    //   });
    //   s.add(shadowGUI,"distance",50,500)
    //   .onChange(()=>{
    //     shadow.distance=shadowGUI.distance;
    //   });
    //   s.add(shadowGUI,"penumbra",0,1)
    //   .onChange(()=>{
    //     shadow.penumbra=shadowGUI.penumbra;
    //   });
    //   s.add(shadowGUI,"decay",1,2)
    //   .onChange(()=>{
    //     shadow.decay=shadowGUI.decay;
    //   });

    var params00 = {
      color: "#ffffff",
      intensity: 1,
    }
    let AmbientLight = new THREE.AmbientLight(params00.color, params00.intensity);
    this.scene.add(AmbientLight);
    var l0 = this.gui.addFolder("AmbientLight");
    l0.addColor(params00, "color")
      .onChange(() => {
        AmbientLight.color.set(params00.color);
      });
    l0.add(params00, "intensity", 0, 1)
      .onChange(() => {
        AmbientLight.intensity = params00.intensity;
      });

    var params = {
      color: "#ffffff",
      intensity: .3,
      x: 0,
      y: 0,
      z: 1.5,
    }

    let DirectionalLight = new THREE.DirectionalLight(params.color, params.intensity);
    DirectionalLight.position.set(params.x, params.y, params.z);
    DirectionalLight.lookAt(0, 0, 0);
    this.scene.add(DirectionalLight);

    var l1 = this.gui.addFolder("Directionlight 1");
    l1.addColor(params, "color")
      .onChange(() => {
        DirectionalLight.color.set(params.color);
      });
    l1.add(params, "intensity", 0, 1)
      .onChange(() => {
        DirectionalLight.intensity = params.intensity;
      });
    l1.add(params, "x", -20, 20)
      .onChange(() => {
        DirectionalLight.position.x = params.x;
      });
    l1.add(params, "y", -20, 20)
      .onChange(() => {
        DirectionalLight.position.y = params.y;
      });
    l1.add(params, "z", -20, 20)
      .onChange(() => {
        DirectionalLight.position.z = params.z;
      });



    var params02 = {
      color: "#ffffff",
      intensity: 0,
      x: 1,
      y: 1,
      z: -.5,
    }

    let DirectionalLight02 = new THREE.DirectionalLight(params02.color, params02.intensity);
    DirectionalLight02.position.set(params02.x, params02.y, params02.z);
    DirectionalLight02.lookAt(0, 0, 0);
    this.scene.add(DirectionalLight02);

    var l2 = this.gui.addFolder("Directionlight 2");
    l2.addColor(params02, "color")
      .onChange(() => {
        DirectionalLight02.color.set(params02.color);
      });
    l2.add(params02, "intensity", 0, 1)
      .onChange(() => {
        DirectionalLight02.intensity = params02.intensity;
      });
    l2.add(params02, "x", -20, 20)
      .onChange(() => {
        DirectionalLight02.position.x = params02.x;
      });
    l2.add(params02, "y", -20, 20)
      .onChange(() => {
        DirectionalLight02.position.y = params02.y;
      });
    l2.add(params02, "z", -20, 20)
      .onChange(() => {
        DirectionalLight02.position.z = params02.z;
      });


    var params03 = {
      width:1,
      height:1,
      intensity: 1,
      color: "#ffffff",
      x:0,
      y:0,
      z:2,
      Lx:0,
      Ly:0,
      Lz:0,
    }

    RectAreaLightUniformsLib.init();

    let rectLight = new THREE.RectAreaLight( params03.color, params03.intensity, params03.width, params03.height );
    rectLight.position.set( params03.x, params03.y, params03.z);
    rectLight.lookAt( params03.Lx, params03.Ly, params03.Lz);
    this.scene.add( rectLight )
          
    // var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.BackSide } ) );
    // rectLightMesh.scale.x = rectLight.width;
    // rectLightMesh.scale.y = rectLight.height;
    // rectLight.add( rectLightMesh );
    // var rectLightMeshBack = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: 0x080808 } ) );
    // rectLightMesh.add( rectLightMeshBack );

    var rl = this.gui.addFolder("RectLight 2");
    rl.addColor(params03, "color")
      .onChange(() => {
        rectLight.color.set(params03.color);
      });
    rl.add(params03, "intensity", 0, 1)
      .onChange(() => {
        rectLight.intensity = params03.intensity;
      });
    rl.add(params03, "width", 0, 10)
      .onChange(() => {
        rectLight.width = params03.width;
        // rectLightMesh.scale.x = params03.width;
      });
    rl.add(params03, "height", 0, 10)
      .onChange(() => {
        rectLight.height = params03.height;
        // rectLightMesh.scale.y = params03.height;
      });
    rl.add(params03, "x", -20, 20)
      .onChange(() => {
        rectLight.position.x = params03.x;
      });
    rl.add(params03, "y", -20, 20)
      .onChange(() => {
        rectLight.position.y = params03.y;
      });
    rl.add(params03, "z", -20, 20)
      .onChange(() => {
        rectLight.position.z = params03.z;
      });
    rl.add(params03, "Lx", -20, 20)
      .onChange(() => {
        rectLight.lookAt(params03.x,params03.y,params03.z)
      });
    rl.add(params03, "Ly", -20, 20)
      .onChange(() => {
        rectLight.lookAt(params03.x,params03.y,params03.z)
      });
    rl.add(params03, "Lz", -20, 20)
      .onChange(() => {
        rectLight.lookAt(params03.x,params03.y,params03.z)
      });
  }

  FirstInit(): void {
    this.AddEvent();
    this.InitBalloonCannon();
    this.StringM = new THREE.MeshBasicMaterial({ color: 0xffffff});

    var params = {
      roughness: 0,
      metalness: 0,
      color: "#c54444",
      emissive: "#e65a5a",
    }

    this.BalloonM = new THREE.MeshLambertMaterial({ color:params.color, emissive: params.emissive, emissiveIntensity:0,})

    var f1 = this.gui.addFolder("Balloon");
    // f1.add(params, 'metalness', 0, 1)
    //   .onChange(() => {
    //     this.BalloonM.metalness = params.metalness;
    //     for(var i=0;i<this.LetterArray.length;i++){
    //       this.LetterArray[i].Scene.children["0"].material.copy(this.BalloonM);
    //     }
    //   });
    // f1.add(params, 'roughness', 0, 1)
    //   .onChange(() => {
    //     this.BalloonM.roughness = params.roughness;
    //     for(var i=0;i<this.LetterArray.length;i++){
    //       this.LetterArray[i].Scene.children["0"].material.copy(this.BalloonM);
    //     }
    //   });
    f1.addColor(params, 'color')
      .onChange(() => {
        this.BalloonM.color.set(params.color);
        for(var i=0;i<this.LetterArray.length;i++){
          this.LetterArray[i].Scene.children["0"].material.copy(this.BalloonM);
        }
      });
    f1.addColor(params, 'emissive')
      .onChange(() => {
        this.BalloonM.emissive.set(params.emissive);
        for(var i=0;i<this.LetterArray.length;i++){
          this.LetterArray[i].Scene.children["0"].material.copy(this.BalloonM);
        }
      });

    
    this.CreateLetterL();
    this.CreateLetterL2();
    this.CreateLetterE();
    this.CreateLetterH();
    this.CreateLetterO();
    this.canvas.addEventListener("mousemove", (e) => {
      this.renderThreePosition(e.x, e.y);
    });
    this.canvas.addEventListener("touchmove", (e) => {
      this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
    });
    this.canvas.addEventListener("mousedown", (e) => {
      if (e.which == 1) {
        this.BalloonTouch();
        this.CursorBegin();
        this.canvas.onmousemove = () => {
          this.BalloonCursor();
        };
      }
    });
    this.canvas.addEventListener("touchstart", (e) => {
      this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
        this.BalloonTouch();
        this.CursorBegin();
        this.canvas.ontouchmove = () => {
          this.BalloonCursor();
        };
    });
    this.canvas.addEventListener("mouseup", (e) => {
      if (e.which == 1) {
        this.canvas.onmousemove = null;
        if (this.collided) {
          this.FirstCursor.copy(this.LastCursor);
        } else {
          gs.TweenLite.to(this.FirstCursor, .5, {
            x: this.LastCursor.x,
            y: this.LastCursor.y, z: this.LastCursor.z
          })
          this.CheckLetterIntersect()
        }
      }
    });
    this.canvas.addEventListener("touchend", (e) => {
      // this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
        this.canvas.ontouchmove = null;
        if (this.collided) {
          this.FirstCursor.copy(this.LastCursor);
        } else {
          gs.TweenLite.to(this.FirstCursor, .5, {
            x: this.LastCursor.x,
            y: this.LastCursor.y, z: this.LastCursor.z
          })
          this.CheckLetterIntersect()
        }
    });
  }

  AddEvent(): void {
    window.addEventListener('DOMContentLoaded', () => {
      this.render();
      setTimeout(() => {
        for (var i = 0; i < this.LetterArray.length; i++) {
          gs.TweenLite.to(this.LetterArray[i].letterArray[0].position, .8, {y: -1.7,ease:gs.Power1.easeOut });
          gs.TweenLite.to(this.LetterArray[i].SetPoint.position, .8, {y: -1.7,ease:gs.Power1.easeOut });
          gs.TweenLite.to(this.LetterArray[i].letterArray[0].position, 4, {delay:.8,y:-1.9,ease:gs.Elastic.easeOut.config(1, 0.15)});
          gs.TweenLite.to(this.LetterArray[i].SetPoint.position, 4, {delay:.8,y:-1.9,ease:gs.Elastic.easeOut.config(1, 0.15)});
        }
      }, 500);
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    if (this.mixer) this.mixer.update(this.clock.getDelta());

    this.now = performance.now();

    if (this.times.length > 0 && this.times[0] <= this.now - 1000) {
      this.times.shift();
    }

    this.times.push(this.now);
    this.fps = this.times.length;

    this.world.step(1 / this.fps);
    this.world02.step(1 / this.fps);

    this.BalloonSceneRender();
    this.renderer.render(this.scene, this.camera);
  }


  private CursorMoveObject: CANNON.Body;
  CreateCursorMoveObject() {
    this.CursorMoveObject = new CANNON.Body({ mass: 0 });
    this.CursorMoveObject.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, 1)));
    // this.CursorMoveObject.addShape(new CANNON.Sphere(0.2))
    this.world.addBody(this.CursorMoveObject);
  }

  renderThreePosition(x, y) {
    this.vec.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1,
      0.5);
    this.vec.unproject(this.camera);
    this.vec.sub(this.camera.position).normalize();

    var distance = - this.camera.position.z / this.vec.z;

    this.pos.copy(this.camera.position).add(this.vec.multiplyScalar(distance));
  }

  BalloonSceneRender() {
    this.controls.update();
    for (var i = 0; i < this.meshes.length; i++) {
      this.meshes[i].position.copy(this.bodies[i].position);
      this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
    }

    if (this.LastCursor.y != this.FirstCursor.y && this.LastCursor.x != this.FirstCursor.x && !this.collided) {
      this.RenderMouseCursor();
    } else {
      this.scene.remove(this.CursorString)
    }
    this.RenderLetter();
    // this.debugger.update();
    // this.debugger02.update();
  }

  private debugger;
  private debugger02;
  InitBalloonCannon(): void {
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0);
    setTimeout(() => {
      this.world.gravity.set(0, 6, 0);
    }, 1000);

    this.world02 = new CANNON.World();
    this.world02.gravity.set(0, -6, 0);

    this.debugger = new CannonDebugRenderer(this.scene, this.world);
    this.debugger02 = new CannonDebugRenderer(this.scene, this.world02);
  }

  private CursorCurve;
  private CursorString;

  BalloonCursor() {
    this.LastCursor.set(this.pos.x, this.pos.y, this.pos.z);
  }

  RenderMouseCursor() {
    this.scene.remove(this.CursorString)
    this.CursorCurve = new THREE.LineCurve3(this.FirstCursor, this.LastCursor);
    this.CursorString = new THREE.Mesh(
      new THREE.TubeBufferGeometry(this.CursorCurve, 48, .004, 8, false),
      this.StringM);
    this.scene.add(this.CursorString);
  }


  CreateLetterL() {
    let L1 = new LetterProperty;
    this.LetterArray.push(L1)

    L1.ObjectBody = new CANNON.Body({ mass: 2 });
    L1.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.13, .4, .12)),
      new CANNON.Vec3(-.145, .05, 0));
    L1.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.24, .12, .12)),
      new CANNON.Vec3(.06, -.33, 0));
    L1.ObjectBody.position.set(0, -2.3, 0);
    let quat = new THREE.Mesh();
    quat.rotation.set(0, 0, -0.025);
    L1.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
    L1.ObjectBody.angularDamping = 0.99;
    L1.ObjectBody.linearDamping = 0.99;
    this.world.addBody(L1.ObjectBody);
    this.bodies.push(L1.ObjectBody);

    L1.Object3D = new THREE.Object3D();

    L1.AttachPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    )
    L1.AttachPoint.position.set(0, -.48, 0);
    L1.AttachPointV = new THREE.Vector3();
    L1.Object3D.add(L1.AttachPoint);
    this.scene.add(L1.Object3D);
    this.meshes.push(L1.Object3D);

    L1.SetPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    )
    L1.SetPoint.position.set(0, -4, 0);

    L1.letterArray = [];
    L1.letterArrayA = [];
    L1.letterArrayAB = [];

    let lastBody: CANNON.Body;
    for (var i = 0; i < 2; i++) {
      let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 1 });
      SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)), new CANNON.Vec3);
      SphereBody.position.set(0, -4 + (i * 1.2), 0);
      SphereBody.angularDamping = 0.99;
      SphereBody.linearDamping = 0.99;
      this.world.addBody(SphereBody);
      L1.letterArray.push(SphereBody);

      if (i != 0) {
        L1.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, 1.2);
        this.world.addConstraint(L1.DConstraint)
        if (i == 1) {
          L1.LConstraint = new CANNON.LockConstraint(L1.ObjectBody, SphereBody);
          this.world.addConstraint(L1.LConstraint)
        }
      }
      lastBody = SphereBody;
    }
  }

  CreateLetterL2() {
    let L2 = new LetterProperty;
    this.LetterArray.push(L2)

    L2.ObjectBody = new CANNON.Body({ mass: 2 });
    L2.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.13, .4, .12)),
      new CANNON.Vec3(-.145, .05, 0));
    L2.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.2, .12, .12)),
      new CANNON.Vec3(.05, -.33, 0));
    L2.ObjectBody.addShape(new CANNON.Sphere(.12),
      new CANNON.Vec3(.19, -.33, 0));
    let quat = new THREE.Mesh();
    quat.rotation.set(0, 0, -0.1);
    L2.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
    L2.ObjectBody.position.set(.63, -2.35, 0)
    L2.ObjectBody.angularDamping = 0.99;
    L2.ObjectBody.linearDamping = 0.99;
    this.world.addBody(L2.ObjectBody);
    this.bodies.push(L2.ObjectBody);

    L2.Object3D = new THREE.Object3D();
    this.loader.load(
      'assets/model/LetterL.glb',
      (gltf) => {
        // gltf.scene.traverse((node)=>{
        //   if(node instanceof THREE.Mesh){
        //     node.castShadow=true;
        //   }
        // });
        this.LetterArray[0].Scene = gltf.scene;
        this.LetterArray[0].Scene.scale.set(.3, .3, .3);
        this.LetterArray[0].Object3D.add(this.LetterArray[0].Scene);
        this.LetterArray[0].Scene.children["0"].material=this.BalloonM;
        L2.Scene = gltf.scene.clone();
        L2.Scene.scale.set(.3, .3, .3);
        L2.Object3D.add(L2.Scene);
      }
    );

    L2.AttachPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    )
    L2.AttachPoint.position.set(0, -.48, 0);
    L2.AttachPointV = new THREE.Vector3();
    L2.Object3D.add(L2.AttachPoint);
    this.scene.add(L2.Object3D);
    this.meshes.push(L2.Object3D);

    L2.SetPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    )
    L2.SetPoint.position.set(.2, -4, 0);

    L2.letterArray = [];
    L2.letterArrayA = [];
    L2.letterArrayAB = [];

    let lastBody: CANNON.Body;
    for (var i = 0; i < 2; i++) {
      let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 1 });
      SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)), new CANNON.Vec3);
      SphereBody.position.set(.63, -4 + (i * 1.15), 0);
      SphereBody.angularDamping = 0.99;
      SphereBody.linearDamping = 0.99;
      this.world.addBody(SphereBody);
      L2.letterArray.push(SphereBody);

      if (i != 0) {
        L2.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, 1.15);
        this.world.addConstraint(L2.DConstraint)
        if (i == 1) {
          L2.LConstraint = new CANNON.LockConstraint(L2.ObjectBody, SphereBody);
          this.world.addConstraint(L2.LConstraint)
        }
      }
      lastBody = SphereBody;
    }
  }

  CreateLetterE() {
    let E = new LetterProperty;
    this.LetterArray.push(E)

    E.ObjectBody = new CANNON.Body({ mass: 2 });
    E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.13, .46, .12)),
      new CANNON.Vec3(-.14, 0, 0));
    E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.14, .1, .12)),
      new CANNON.Vec3(.13, -.36, 0));
    E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.14, .1, .12)),
      new CANNON.Vec3(.13, 0, 0));
    E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.14, .09, .12)),
      new CANNON.Vec3(.13, .37, 0));
    let quat = new THREE.Mesh();
    quat.rotation.set(0, 0, .15);
    E.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
    E.ObjectBody.position.set(-.62, -2.35, 0)
    E.ObjectBody.angularDamping = 0.99;
    E.ObjectBody.linearDamping = 0.99;
    this.world.addBody(E.ObjectBody);
    this.bodies.push(E.ObjectBody);

    E.Object3D = new THREE.Object3D();
    this.loader.load(
      'assets/model/LetterE.glb',
      (gltf) => {
        // gltf.scene.traverse((node)=>{
        //   if(node instanceof THREE.Mesh){
        //     node.castShadow=true;
        //   }
        // });
        E.Scene = gltf.scene;
        E.Scene.children["0"].material=this.BalloonM;
        E.Scene.scale.set(.3, .3, .3);
        E.Object3D.add(E.Scene);
      }
    );

    E.AttachPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    )
    E.AttachPoint.position.set(0, -.48, 0);
    E.AttachPointV = new THREE.Vector3();
    E.Object3D.add(E.AttachPoint);
    this.scene.add(E.Object3D);
    this.meshes.push(E.Object3D);

    E.SetPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    )
    E.SetPoint.position.set(-.2, -4, 0);

    E.letterArray = [];
    E.letterArrayA = [];
    E.letterArrayAB = [];

    let lastBody: CANNON.Body;
    for (var i = 0; i < 2; i++) {
      let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 1 });
      SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)), new CANNON.Vec3);
      SphereBody.position.set(-.62, -4 + (i * 1.15), 0);
      SphereBody.angularDamping = 0.99;
      SphereBody.linearDamping = 0.99;
      this.world.addBody(SphereBody);
      E.letterArray.push(SphereBody);

      if (i != 0) {
        E.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, 1.15);
        this.world.addConstraint(E.DConstraint)
        if (i == 1) {
          E.LConstraint = new CANNON.LockConstraint(E.ObjectBody, SphereBody);
          this.world.addConstraint(E.LConstraint)
        }
      }
      lastBody = SphereBody;
    }
  }

  CreateLetterH() {
    let H = new LetterProperty;
    this.LetterArray.push(H)

    H.ObjectBody = new CANNON.Body({ mass: 2 });
    H.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.12, .465, .11)),
      new CANNON.Vec3(0, 0, 0));
    H.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.12, .465, .11)),
      new CANNON.Vec3(-0.4, 0, 0));
    H.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(.08, .12, .11)),
      new CANNON.Vec3(-0.2, 0, 0));
    let quat = new THREE.Mesh();
    quat.rotation.set(0, 0, .2);
    H.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
    H.ObjectBody.position.set(-1.05, -2.44, 0)
    H.ObjectBody.angularDamping = 0.99;
    H.ObjectBody.linearDamping = 0.99;
    this.world.addBody(H.ObjectBody);
    this.bodies.push(H.ObjectBody);

    H.Object3D = new THREE.Object3D();
    this.loader.load(
      'assets/model/LetterH.glb',
      (gltf) => {
        // gltf.scene.traverse((node)=>{
        //   if(node instanceof THREE.Mesh){
        //     node.castShadow=true;
        //   }
        // });
        H.Scene = gltf.scene;
        H.Scene.children["0"].material=this.BalloonM;
        H.Scene.scale.set(.3, .3, .3);
        H.Scene.position.x=-.2;
        H.Object3D.add(H.Scene);
      }
    );

    H.AttachPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    )
    H.AttachPoint.position.set(0, -.48, 0);
    H.AttachPointV = new THREE.Vector3();
    H.Object3D.add(H.AttachPoint);
    this.scene.add(H.Object3D);
    this.meshes.push(H.Object3D);

    H.SetPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    )
    H.SetPoint.position.set(-.5, -4, 0);

    H.letterArray = [];
    H.letterArrayA = [];
    H.letterArrayAB = [];

    let lastBody: CANNON.Body;
    for (var i = 0; i < 2; i++) {
      let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 1 });
      SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)), new CANNON.Vec3);
      SphereBody.position.set(-1.05, -4 + (i * 1.05), 0)
      SphereBody.angularDamping = 0.99;
      SphereBody.linearDamping = 0.99;
      this.world.addBody(SphereBody);
      H.letterArray.push(SphereBody);

      if (i != 0) {
        H.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, 1.05);
        this.world.addConstraint(H.DConstraint)
        if (i == 1) {
          H.LConstraint = new CANNON.LockConstraint(H.ObjectBody, SphereBody);
          this.world.addConstraint(H.LConstraint)
        }
      }
      lastBody = SphereBody;
    }
  }

  CreateLetterO() {
    let O = new LetterProperty;
    this.LetterArray.push(O)

    O.ObjectBody = new CANNON.Body({ mass: 2 });
    // let shape = new CANNON.Sphere(.12);
    // let shape = new CANNON.Box(new CANNON.Vec3(.08,.08,.1));
    let shape = new CANNON.Cylinder(.4,.4,.15,36)
    // for (var i = 0; i < Math.PI * 2; i += Math.PI / 10) {
    //   O.ObjectBody.addShape(shape, new CANNON.Vec3(Math.sin(i) * .28, Math.cos(i) * .33, 0));
    // }
    O.ObjectBody.addShape(shape);
    let quat = new THREE.Mesh();
    quat.rotation.set(0, 0, -.4);
    O.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
    O.ObjectBody.position.set(1.32, -2.5, 0)
    O.ObjectBody.angularDamping = 0.99;
    O.ObjectBody.linearDamping = 0.99;
    this.world.addBody(O.ObjectBody);
    this.bodies.push(O.ObjectBody);

    O.Object3D = new THREE.Object3D();
    this.loader.load(
      'assets/model/LetterO.glb',
      (gltf) => {
        // gltf.scene.traverse((node)=>{
        //   if(node instanceof THREE.Mesh){
        //     node.castShadow=true;
        //   }
        // });
        
        O.Scene = gltf.scene;
        O.Scene.children["0"].material=this.BalloonM;
        O.Scene.scale.set(.3, .3, .3);
        O.Object3D.add(O.Scene);
      }
    );

    O.AttachPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    )
    O.AttachPoint.position.set(0, -.48, 0);
    O.AttachPointV = new THREE.Vector3();
    O.Object3D.add(O.AttachPoint);
    this.scene.add(O.Object3D);
    this.meshes.push(O.Object3D);

    O.SetPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    )
    O.SetPoint.position.set(.5, -4, 0);

    O.letterArray = [];
    O.letterArrayA = [];
    O.letterArrayAB = [];

    let lastBody: CANNON.Body;
    for (var i = 0; i < 2; i++) {
      let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 1 });
      SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)), new CANNON.Vec3);
      SphereBody.position.set(1.32, -4 + (i * 1.0), 0);
      SphereBody.angularDamping = 0.99;
      SphereBody.linearDamping = 0.99;
      this.world.addBody(SphereBody);
      O.letterArray.push(SphereBody);

      if (i != 0) {
        O.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, 1.0);
        this.world.addConstraint(O.DConstraint)
        if (i == 1) {
          O.LConstraint = new CANNON.LockConstraint(O.ObjectBody, SphereBody);
          this.world.addConstraint(O.LConstraint)
        }
      }
      lastBody = SphereBody;
    }
  }

  RenderLetter() {
    for (var i = 0; i < this.LetterArray.length; i++) {
      if (this.LetterArray[i].LConstraint != null) {
        this.scene.remove(this.LetterArray[i].StringT);

        this.LetterArray[i].AttachPointV.setFromMatrixPosition(this.LetterArray[i].AttachPoint.matrixWorld);

        this.LetterArray[i].StringC = new THREE.LineCurve3(
          new THREE.Vector3(this.LetterArray[i].SetPoint.position.x, this.LetterArray[i].SetPoint.position.y, this.LetterArray[i].SetPoint.position.z),
          new THREE.Vector3(this.LetterArray[i].AttachPointV.x, this.LetterArray[i].AttachPointV.y, this.LetterArray[i].AttachPointV.z)
        );

        this.LetterArray[i].StringT = new THREE.Mesh(
          new THREE.TubeBufferGeometry(this.LetterArray[i].StringC, 64, 0.005, 8, false),
          this.StringM);
        this.scene.add(this.LetterArray[i].StringT);
      } else {
        if (this.LetterArray[i].letterArrayA != null) {
          this.scene.remove(this.LetterArray[i].StringTA)

          this.LetterArray[i].AttachPointV.setFromMatrixPosition(this.LetterArray[i].AttachPoint.matrixWorld);

          this.LetterArray[i].letterArrayA[3].position.set(this.LetterArray[i].AttachPointV.x, this.LetterArray[i].AttachPointV.y, this.LetterArray[i].AttachPointV.z)

          this.LetterArray[i].StringCA = new THREE.CubicBezierCurve3(
            new THREE.Vector3(this.LetterArray[i].letterArrayA[0].position.x, this.LetterArray[i].letterArrayA[0].position.y, this.LetterArray[i].letterArrayA[0].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArrayA[1].position.x, this.LetterArray[i].letterArrayA[1].position.y, this.LetterArray[i].letterArrayA[1].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArrayA[2].position.x, this.LetterArray[i].letterArrayA[2].position.y, this.LetterArray[i].letterArrayA[2].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArrayA[3].position.x, this.LetterArray[i].letterArrayA[3].position.y, this.LetterArray[i].letterArrayA[3].position.z),
          )

          this.LetterArray[i].StringTA = new THREE.Mesh(
            new THREE.TubeBufferGeometry(this.LetterArray[i].StringCA, 64, 0.005, 8, false),
            this.StringM);
          this.scene.add(this.LetterArray[i].StringTA);

          if (this.LetterArray[i].letterArrayA[0].position.y > 2) {
            this.scene.remove(this.LetterArray[i].StringTA);
            this.scene.remove(this.LetterArray[i].Object3D);
            for (var j = 0; j < this.LetterArray[i].letterArrayA.length; j++) {
              this.world02.remove(this.LetterArray[i].letterArrayA[j]);
            }
            this.world.remove(this.LetterArray[i].ObjectBody)
            this.LetterArray[i].letterArrayA = null;
          }
        }

        // Bottom
        if (this.LetterArray[i].letterArrayAB != null) {
          this.scene.remove(this.LetterArray[i].StringTAB)
          this.LetterArray[i].StringCAB = new THREE.CubicBezierCurve3(
            new THREE.Vector3(this.LetterArray[i].letterArrayAB[0].position.x, this.LetterArray[i].letterArrayAB[0].position.y, this.LetterArray[i].letterArrayAB[0].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArrayAB[1].position.x, this.LetterArray[i].letterArrayAB[1].position.y, this.LetterArray[i].letterArrayAB[1].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArrayAB[2].position.x, this.LetterArray[i].letterArrayAB[2].position.y, this.LetterArray[i].letterArrayAB[2].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArrayAB[3].position.x, this.LetterArray[i].letterArrayAB[3].position.y, this.LetterArray[i].letterArrayAB[3].position.z),
          )
          this.LetterArray[i].StringTAB = new THREE.Mesh(
            new THREE.TubeBufferGeometry(this.LetterArray[i].StringCAB, 64, 0.005, 8, false),
            this.StringM);
          this.scene.add(this.LetterArray[i].StringTAB);

          if (this.LetterArray[i].letterArrayAB[0].position.y < this.LetterArray[i].letterArrayAB[3].position.y) {
            this.scene.remove(this.LetterArray[i].StringTAB);
            for (var j = 0; j < this.LetterArray[i].letterArrayAB.length; j++) {
              this.world02.remove(this.LetterArray[i].letterArrayAB[j]);
            }
            this.LetterArray[i].letterArrayAB = null;
          }
        }
      }
    }
  }

  CursorBegin() {
    this.FirstCursor.set(this.pos.x, this.pos.y, this.pos.z);
    this.LastCursor.set(this.pos.x, this.pos.y, this.pos.z);
  }

  BalloonTouch() {
    let body = new CANNON.Body({ mass: 1 });
    body.addShape(new CANNON.Cylinder(.05, .05, 1, 8));

    body.position.set(this.pos.x, this.pos.y, this.pos.z);

    setTimeout(() => {
      this.world.remove(body);
    }, 100);

    this.collided = false;
    this.world.addBody(body);
    body.addEventListener("collide", throttle((e) => {
      this.collided = true;
    }, 100));

  }

  ////
  // Credit: Paul Bourke http://paulbourke.net/geometry/pointlineplane/
  CheckIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
      return false
    }

    let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
      return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return false
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return { x, y }
  }

  CheckLetterIntersect() {
    for (var i = 0; i < this.LetterArray.length; i++) {
      if (this.LetterArray[i].LConstraint != null) {
        var it = this.CheckIntersect(this.LetterArray[i].StringC.v1.x, this.LetterArray[i].StringC.v1.y,
          this.LetterArray[i].StringC.v2.x, this.LetterArray[i].StringC.v2.y,
          this.FirstCursor.x, this.FirstCursor.y,
          this.LastCursor.x, this.LastCursor.y)
        if (it) {
          this.world.removeConstraint(this.LetterArray[i].DConstraint);
          this.world.removeConstraint(this.LetterArray[i].LConstraint);
          this.LetterArray[i].LConstraint = null;
          this.scene.remove(this.LetterArray[i].StringT)

          let curve = new THREE.LineCurve3(new THREE.Vector3(it.x, it.y, 0), this.LetterArray[i].StringC.v2)

          let point = curve.getPoints(3);

          let distance = this.distance(point[0].x, point[0].y, point[0].z,
            point[1].x, point[1].y, point[1].z);

          let lastbody: CANNON.Body;
          for (var j = 0; j < 4; j++) {
            let body = new CANNON.Body({ mass: j == 3 ? 0 : 1 });
            body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
            body.position.set(point[j].x, point[j].y, point[j].z);
            this.world02.addBody(body);
            this.LetterArray[i].letterArrayA.push(body);
            if (j != 0) {
              this.world02.addConstraint(new CANNON.DistanceConstraint(body, lastbody, distance))
            }
            lastbody = body;
          }

          curve = new THREE.LineCurve3(new THREE.Vector3(it.x, it.y, 0), this.LetterArray[i].StringC.v1)

          point = curve.getPoints(3);
          distance = this.distance(point[0].x, point[0].y, point[0].z,
            point[1].x, point[1].y, point[1].z);

          this.world.remove(this.LetterArray[i].letterArray[1])
          this.world.remove(this.LetterArray[i].letterArray[0])

          for (var j = 0; j < 4; j++) {
            let body = new CANNON.Body({ mass: j == 3 ? 0 : 1 });
            body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
            body.position.set(point[j].x, point[j].y, point[j].z);
            this.world02.addBody(body);
            this.LetterArray[i].letterArrayAB.push(body);
            if (j != 0) {
              this.world02.addConstraint(new CANNON.DistanceConstraint(body, lastbody, distance));
            }
            lastbody = body;
          }
        }
      }
    }
  }

  LastScene(): void {
    this.ChooChoo();
  }

  private choochooLight = new THREE.HemisphereLight(0xffffff, 0xe1e1e1, .7);
  ChooChoo() {
    this.scene.add(this.choochooLight);
    this.gui.add

    var params = {
      skyColor: "#ffffff",
      groundColor: "#e1e1e1",
      intensity: this.choochooLight.intensity,
    }

    var l1 = this.gui.addFolder("HemisphereLight 1");
    l1.addColor(params, "skyColor")
      .onChange(() => {
        this.choochooLight.color.set(params.skyColor)
      });
    l1.addColor(params, "groundColor")
      .onChange(() => {
        this.choochooLight.groundColor.set(params.groundColor)
      });
    l1.add(params, "intensity", 0, 1)
      .onChange(() => {
        this.choochooLight.intensity = params.intensity;
      });

    this.loader = new GLTFLoader();
    this.loader.load(
      'assets/model/choochooTrain.glb',
      (gltf) => {
        gltf.scene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
          }
        });
        let train = gltf.scene;
        console.log(train);
        this.mixer = new THREE.AnimationMixer(train);
        this.mixer.clipAction(gltf.animations[0]).play();
        this.mixer.timeScale = 0.5;
        train.scale.set(.32, .32, .32);
        train.position.set(0, .027, .5);
        this.scene.add(train);
      }
    );
    this.loader.load(
      'assets/model/choochooRail.glb',
      (gltf) => {
        gltf.scene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
          }
        });
        let rail = gltf.scene;
        rail.scale.set(.085, .085, .085);
        rail.position.set(0, .027, .5);
        this.scene.add(rail);
      }
    );
  }


  ThreePlane() {
    var planeGeometry = new THREE.PlaneGeometry(100, 100);
    planeGeometry.rotateX(- Math.PI / 2);


    var planeMaterial = new THREE.ShadowMaterial({ transparent: true });
    planeMaterial.opacity = 0.1;
    var planeMa02 = new THREE.MeshBasicMaterial({})

    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -1, 0);
    plane.receiveShadow = true;
    this.scene.add(plane);
  }

  SecondScene(): void {
    this.InitSecondCannon();
    this.CannonPlane();
    this.CreateSmoke();
    this.CreateFireExtinguisher();
    this.popIt();
  }

  InitSecondCannon(): void {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -2, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world02 = new CANNON.World();
  }

  CannonPlane() {
    var shape = new CANNON.Plane();
    var body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    body.position.set(0, -1, 0);
    this.world.addBody(body);
  }

  private smoke = new THREE.MeshLambertMaterial({ color: 0x7f8eb8, emissive: 0xe0e0e0 });
  CreateSmoke() {
    this.smokeThree = new THREE.Mesh(
      new THREE.SphereBufferGeometry(.068),
      this.smoke);
    this.smokeThree.castShadow = true;

    let boopMat = new THREE.MeshBasicMaterial({ color: 0xff6262 });

    this.boop = new THREE.Mesh(new THREE.BoxBufferGeometry(.1, .025, .025),
      boopMat)

    let stuff02 = {
      color: "#ff6262"
    }

    var f6 = this.gui.addFolder("boop");
    f6.addColor(stuff02, "color")
      .onChange(() => {
        boopMat.color.set(stuff02.color);
      })

    let stuff = {
      shininess: 0.7,
      specular: "#ffffff",
      color: "#7f8eb8",
      emissive: "#e0e0e0",
    }
    var f4 = this.gui.addFolder("SMOKE");
    f4.addColor(stuff, 'color')
      .onChange(() => {
        this.smoke.color.set(stuff.color);
      });
    f4.addColor(stuff, 'emissive')
      .onChange(() => {
        this.smoke.emissive.set(stuff.emissive);
      });
  }

  private pipem = new THREE.MeshLambertMaterial({ color: 0x4d67b1, emissive: 0xe1e1e1 });
  CreateFireExtinguisher() {

    let stuff = {
      roughness: 0.7,
      metalness: 0.25,
      color: "#7f8eb8",
      emissive: "#d2d2d2",
    }
    var f3 = this.gui.addFolder("PIPE");
    f3.addColor(stuff, 'color')
      .onChange(() => {
        this.pipem.color.set(stuff.color);
      });
    f3.addColor(stuff, 'emissive')
      .onChange(() => {
        this.pipem.emissive.set(stuff.emissive);
      });


    let FEMaterial = new THREE.MeshStandardMaterial({ color: 0xcd7f7f, emissive: 0xcd5151, metalness: 0.25, roughness: 0.7, });
    let FEMaterial02 = new THREE.MeshStandardMaterial({ color: 0x4d67b1, emissive: 0xdcdcdc, metalness: 0.25, roughness: 0.7, });
    let N = 27;
    let lastBody = null;
    let distaince = .04;
    let x = 0;
    let height = .595;
    let pipeshape = new CANNON.Cylinder(.025, .025, .04, 8);
    let quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
    quat.normalize();
    for (var i = 0; i < N; i++) {
      var pipebody = new CANNON.Body({ mass: i == 0 ? 0 : 1 });
      pipebody.addShape(pipeshape, new CANNON.Vec3, quat);
      pipebody.position.set(i * distaince + x, height, 0);
      pipebody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
      pipebody.angularDamping = 0.99;
      pipebody.linearDamping = 0.99;
      this.world02.addBody(pipebody);
      this.PipeCannon.push(pipebody);

      // let pipe3 = this.Pipe.clone();
      // this.PipeThree.push(pipe3);
      // this.scene.add(pipe3);

      if (lastBody !== null) {
        let c = new CANNON.LockConstraint(pipebody, lastBody);
        this.world02.addConstraint(c);
      }

      // Keep track of the lastly added body
      lastBody = pipebody;
    }

    // LAST PIPE
    this.lastpipe = new CANNON.Body({ mass: 1 });
    let cylinderShape = new CANNON.Cylinder(.06, .08, .16, 16);
    this.lastpipe.addShape(cylinderShape, new CANNON.Vec3, quat);


    this.lastpipe.position.set(N * distaince + x + 0.06, height, 0);
    this.lastpipe.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
    this.lastpipe.angularDamping = 0.99;
    this.lastpipe.linearDamping = 0.99;

    this.world02.addBody(this.lastpipe);
    // this.PipeCannon.push(this.lastpipe);
    this.bodies02.push(this.lastpipe);

    let c = new CANNON.LockConstraint(this.lastpipe, lastBody);
    this.world02.addConstraint(c);

    // pipe part
    let lastpipegeometry = new THREE.CylinderBufferGeometry(.06, .08, .16, 16);
    let lastpipematerial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    let lasspipethree = new THREE.Mesh(lastpipegeometry, lastpipematerial);
    lasspipethree.castShadow = true;
    let lastthreemesh = new THREE.Object3D();

    this.lastthreepipe = new THREE.Object3D();
    this.loader = new GLTFLoader();
    this.loader.load(
      'assets/model/pipe.glb',
      (gltf) => {
        lastthreemesh = gltf.scene;
        lastthreemesh.children["0"].material.copy(
          FEMaterial);
        this.lastthreepipe.add(lastthreemesh)
      }
    );


    let boxGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    var invisible = new THREE.MeshBasicMaterial({ color: 0xf0f0f0, transparent: true, opacity: 0 });
    // smoke start
    this.FETap = new THREE.Mesh(boxGeo, invisible);
    this.FETap.position.set(0, 0, 0);
    // smoke end
    this.SmokePoint = new THREE.Mesh(boxGeo, invisible);
    this.SmokePoint.position.set(0, -1.5, 0);
    // reset point
    this.ResetPoint = new THREE.Mesh(boxGeo, invisible);
    this.ResetPoint.position.set(0, 0, 0);


    this.lastthreepipe.add(this.SmokePoint);
    this.lastthreepipe.add(this.ResetPoint);
    this.lastthreepipe.add(this.FETap);
    this.lastthreepipe.add(lasspipethree);

    this.scene.add(this.lastthreepipe);
    // this.PipeThree.push(this.lastthreepipe)
    this.meshes02.push(this.lastthreepipe)

    let febox = new THREE.CylinderBufferGeometry(0.06, 0.08, 0.16, 16);
    let Dragmaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    // DRAG POINT THREE
    let DragPointThree = new THREE.Mesh(febox, Dragmaterial);
    DragPointThree.position.set(this.lastpipe.position.x, height, 0);
    DragPointThree.rotation.set(0, 0, Math.PI / 2);
    this.scene.add(DragPointThree);
    this.DragPointThree.push(DragPointThree);


    this.loader.load(
      // 'assets/model/extinguisher.glb',
      'assets/model/shitty.glb',
      (gltf) => {
        gltf.scene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
          }
        });
        this.FireExtinguisher = gltf.scene;
        this.FireExtinguisher.children["0"].children["0"].material.copy(
          FEMaterial);
        this.FireExtinguisher.children["0"].children["2"].material.copy(
          FEMaterial02);

        this.FETHREE.add(this.FireExtinguisher);
      }
    );
    this.FETHREE.position.set(-0.1, -0.3, 0);
    this.FETHREE.rotation.set(0 * Math.PI / 180, -15 * Math.PI / 180, 0 * Math.PI / 180);
    this.FETHREE.castShadow = true;
    this.scene.add(this.FETHREE);


    // CANNON FE
    var body = new CANNON.Body({ mass: 0 });
    var CylinderShape = new CANNON.Cylinder(0.3, 0.3, 1.24, 16);
    quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
    quat.normalize();

    let y = 0.2;
    let sphere = new CANNON.Sphere(0.3);
    let sphere2 = new CANNON.Sphere(0.063);

    let cylinder = new CANNON.Cylinder(0.063, 0.063, 0.165, 8);
    let cylinder02 = new CANNON.Cylinder(0.04, 0.04, 0.05, 8);
    let cylinder03 = new CANNON.Cylinder(0.063, 0.063, 0.025, 16);
    let top = 0.95;

    let box = new CANNON.Box(new CANNON.Vec3(0.18, 0.02, 0.05));
    let box02 = new CANNON.Box(new CANNON.Vec3(0.18, 0.02, 0.06));
    let box03 = new CANNON.Box(new CANNON.Vec3(0.05, 0.05, 0.01));
    let box04 = new CANNON.Box(new CANNON.Vec3(0.05, 0.025, 0.01));

    let box05 = new CANNON.Box(new CANNON.Vec3(0.08, 0.02, 0.06));

    let box06 = new CANNON.Box(new CANNON.Vec3(0.1, 0.01, 0.06));



    body.addShape(cylinder, new CANNON.Vec3(0, 0.7 + y, 0), quat);

    quat = new CANNON.Quaternion(0.5, 0.5, 0.5, 0.5);
    quat.normalize();
    body.addShape(cylinder02, new CANNON.Vec3(0.09, 0.694 + y, 0), quat);
    body.addShape(cylinder03, new CANNON.Vec3(-0.015, 0.7 + y, 0.075));
    quat = new CANNON.Quaternion(-0.07, 0.5, 0, 0);
    quat.normalize();

    body.addShape(box, new CANNON.Vec3(-0.28, 0.76 + y, 0), quat);

    quat = new CANNON.Quaternion(0.11, 0.5, 0, 0);
    quat.normalize();
    body.addShape(box02, new CANNON.Vec3(-0.07, 0.9 + y, 0), quat);

    body.addShape(box03, new CANNON.Vec3(-0.05, 0.84 + y, 0.05));
    body.addShape(box04, new CANNON.Vec3(0.05, 0.815 + y, 0.05));

    body.addShape(box03, new CANNON.Vec3(-0.05, 0.84 + y, -0.05));
    body.addShape(box04, new CANNON.Vec3(0.05, 0.815 + y, -0.05));

    body.addShape(box05, new CANNON.Vec3(-0.31, 0.98 + y, 0));

    body.addShape(box06, new CANNON.Vec3(0, 0.79 + y, 0));

    for (let i = 0; i < 4; i++) {
      body.addShape(sphere2, new CANNON.Vec3(0, top, 0));
      top -= 0.03;
    }

    let boxCy01 = new CANNON.Box(new CANNON.Vec3(0.025, 0.0275, 0.0275));
    quat = new CANNON.Quaternion(0.5, 0, 0, 0.25);
    quat.normalize();
    body.addShape(boxCy01, new CANNON.Vec3(0.09, 0.694 + y, 0), quat);
    body.addShape(boxCy01, new CANNON.Vec3(0.09, 0.694 + y, 0));

    let boxCy02 = new CANNON.Box(new CANNON.Vec3(0.045, 0.045, 0.015));
    body.addShape(boxCy02, new CANNON.Vec3(-0.015, 0.7 + y, 0.075));
    quat = new CANNON.Quaternion(0.5, 0.25, 0, 0);
    quat.normalize();
    body.addShape(boxCy02, new CANNON.Vec3(-0.015, 0.7 + y, 0.075), quat);


    quat = new CANNON.Quaternion(0.5, 0, 0, 0.5);
    quat.normalize();
    let cylinder04 = new CANNON.Cylinder(0.3, 0.26, 0.15, 16);
    let cylinder05 = new CANNON.Cylinder(0.26, 0.1, 0.15, 16);
    body.addShape(cylinder04, new CANNON.Vec3(0, 0.4 + y, 0), quat);
    body.addShape(cylinder05, new CANNON.Vec3(0, 0.54 + y, 0), quat);


    body.addShape(CylinderShape, new CANNON.Vec3(0, -.28 + y, 0), quat)

    top = 0.525;
    for (let i = 0; i < 25; i++) {
      body.addShape(sphere, new CANNON.Vec3(0, top, 0));
      top -= 0.05;
    }

    body.position.set(-0.1, -0.3, 0);
    this.world02.addBody(body);
    this.world.addBody(body);

    body.position.copy(new CANNON.Vec3(this.FETHREE.position.x, this.FETHREE.position.y, this.FETHREE.position.z));
    body.quaternion.copy(new CANNON.Quaternion(this.FETHREE.quaternion.x, this.FETHREE.quaternion.y, this.FETHREE.quaternion.z, this.FETHREE.quaternion.w));

    this.PipeCannon[0].position.set(0, 0.59, 0.02);
    this.CreateFirstDirectionPipe();

    var params = {
      roughness: 0.7,
      metalness: 0.25,
      color: "#ffffff",
      emissive: "#e65a5a",
    }

    var f1 = this.gui.addFolder("Fire Extinguisher");
    f1.add(params, 'metalness', 0, 1)
      .onChange(() => {
        FEMaterial.metalness = params.metalness;
        this.FireExtinguisher.children["0"].children["0"].material.copy(
          FEMaterial);
        lastthreemesh.children["0"].material.copy(
          FEMaterial);
      });
    f1.add(params, 'roughness', 0, 1)
      .onChange(() => {
        FEMaterial.roughness = params.roughness;
        this.FireExtinguisher.children["0"].children["0"].material.copy(
          FEMaterial);
        lastthreemesh.children["0"].material.copy(
          FEMaterial);
      });
    f1.addColor(params, 'color')
      .onChange(() => {
        FEMaterial.color.set(params.color);
        this.FireExtinguisher.children["0"].children["0"].material.copy(
          FEMaterial);
        lastthreemesh.children["0"].material.copy(
          FEMaterial);
      });
    f1.addColor(params, 'emissive')
      .onChange(() => {
        FEMaterial.emissive.set(params.emissive);
        this.FireExtinguisher.children["0"].children["0"].material.copy(
          FEMaterial);
        lastthreemesh.children["0"].material.copy(
          FEMaterial);
      });

    var f2 = this.gui.addFolder("Fire Extinguisher 02");
    f2.add(params, 'metalness', 0, 1)
      .onChange(() => {
        FEMaterial02.metalness = params.metalness;
        this.FireExtinguisher.children["0"].children["2"].material.copy(
          FEMaterial02);
      });
    f2.add(params, 'roughness', 0, 1)
      .onChange(() => {
        FEMaterial02.roughness = params.roughness;
        this.FireExtinguisher.children["0"].children["2"].material.copy(
          FEMaterial02);
      });
    f2.addColor(params, 'color')
      .onChange(() => {
        FEMaterial02.color.set(params.color);
        this.FireExtinguisher.children["0"].children["2"].material.copy(
          FEMaterial02);
      });
    f2.addColor(params, 'emissive')
      .onChange(() => {
        FEMaterial02.emissive.set(params.emissive);
        this.FireExtinguisher.children["0"].children["2"].material.copy(
          FEMaterial02);
      });
  }

  popIt() {
    // Fan
    let quat = new CANNON.Quaternion();
    quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
    quat.normalize();


    let stuffMaterial = new THREE.MeshLambertMaterial({ color: 0x7f8eb8, emissive: 0x506493 });
    let params = {
      roughness: 0.7,
      metalness: 0.25,
      color: "#7f8eb8",
      emissive: "#ffffff",
    }
    var f5 = this.gui.addFolder("Stuffs");
    f5.addColor(params, 'color')
      .onChange(() => {
        stuffMaterial.color.set(params.color);
      });
    f5.addColor(params, 'emissive')
      .onChange(() => {
        stuffMaterial.emissive.set(params.emissive);
      });


    quat = new CANNON.Quaternion(0.5, -0.5, 0.5, 0.5);
    let tempCannon = new CANNON.Body({ mass: 0 });
    let tempThree = new THREE.Mesh(new THREE.BoxBufferGeometry(.2, .1, .2));

    let collided = [];
    let unique = [];

    let boxX = .12;
    let boxY = .12;
    let boxZ = .04;


    setInterval(() => {
      if (document.hidden == true) {
      } else {
        if (this.meshes03.length > 11) {
          if (collided.length > 0) {
            unique = collided.filter(function (elem, index, self) {
              return index === self.indexOf(elem);
            })

            collided = unique;

            let segment = Math.floor(Math.random() * 4) + 3;
            if (segment == 6) {
              segment += 2;
            }

            let stuff = new CANNON.Body({ mass: 10 });
            let stuffShape = new CANNON.Box(new CANNON.Vec3(boxX, boxZ, boxY));
            stuff.addShape(stuffShape);
            stuff.position.set((Math.random() * 3) - 1.5, 2, (Math.random() * 0.4) + 0.8);
            this.world.addBody(stuff);

            let stuff3;
            if (segment == 8) {
              stuff3 = new THREE.Mesh(
                new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, 24),
                stuffMaterial);
            } else {
              stuff3 = new THREE.Mesh(
                new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, segment),
                stuffMaterial);
            }
            stuff3.castShadow = true;
            stuff3.scale.set(.1, .1, .1);
            gs.TweenLite.to(stuff3.scale, 1.5, { x: 1, y: 1, z: 1, ease: gs.Power0.easeNone })
            this.scene.add(stuff3);

            this.bodies03.splice(collided[0], 1, stuff);
            this.meshes03.splice(collided[0], 1, stuff3);
            var test02 = collided[0];

            stuff.addEventListener("collide", throttle((e) => {
              if (e.contact.bi.collisionFilterGroup == 2) {
                setTimeout(() => {
                  if (stuff3.scale.x > 0.2) {

                    stuff3.scale.x *= 0.85;
                    stuff3.scale.y *= 0.85;
                    stuff3.scale.z *= 0.85;

                    stuffShape.halfExtents.set(stuff3.scale.x * boxX, stuff3.scale.y * boxZ, stuff3.scale.z * boxY);
                    stuffShape.updateConvexPolyhedronRepresentation();
                  } else {
                    if (stuff) {
                      this.BOOP(stuff3.position.x, stuff3.position.y, stuff3.position.z);
                      this.world.remove(stuff);
                      this.scene.remove(stuff3);
                      this.meshes03.splice(test02, 1, tempCannon);
                      this.bodies03.splice(test02, 1, tempThree);
                      collided.push(test02);
                    }
                  }
                }, 50);
              }
            }, 50));
            collided.shift();
          }
        } else {
          let segment = Math.floor(Math.random() * 4) + 3;
          if (segment == 6) {
            segment += 2;
          }

          let stuff = new CANNON.Body({ mass: 10 });
          let stuffShape = new CANNON.Box(new CANNON.Vec3(boxX, boxZ, boxY));
          stuff.addShape(stuffShape);
          stuff.position.set((Math.random() * 3) - 1.5, 2, (Math.random() * 0.4) + 0.8);

          this.world.addBody(stuff);
          let stuff3;
          if (segment == 8) {
            stuff3 = new THREE.Mesh(
              new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, 24),
              stuffMaterial);
          } else {
            stuff3 = new THREE.Mesh(
              new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, segment),
              stuffMaterial);
          }
          stuff3.scale.set(.1, .1, .1);
          stuff3.castShadow = true;
          gs.TweenLite.to(stuff3.scale, 1.5, { x: 1, y: 1, z: 1, ease: gs.Power0.easeNone })
          this.scene.add(stuff3);

          this.bodies03.push(stuff);
          this.meshes03.push(stuff3);

          var test = this.bodies03.length - 1;
          stuff.addEventListener("collide", throttle((e) => {
            if (e.contact.bi.collisionFilterGroup == 2) {
              setTimeout(() => {
                if (stuff3.scale.x > 0.2) {

                  stuff3.scale.x *= 0.85;
                  stuff3.scale.y *= 0.85;
                  stuff3.scale.z *= 0.85;

                  stuffShape.halfExtents.set(stuff3.scale.x * boxX, stuff3.scale.y * boxZ, stuff3.scale.z * boxY);
                  stuffShape.updateConvexPolyhedronRepresentation();
                } else {
                  this.BOOP(stuff3.position.x, stuff3.position.y, stuff3.position.z);
                  this.world.remove(stuff);
                  this.scene.remove(stuff3);
                  this.meshes03.splice(test, 1, tempCannon);
                  this.bodies03.splice(test, 1, tempThree);
                  collided.push(test);
                }
              }, 50);
            }
          }, 50));
        }
      }
    }, 500)
  }


  BOOP(Ox: number, Oy: number, Oz: number) {
    Oy += .1;
    // 1 
    let box = this.boop.clone();
    box.position.set(Ox, Oy, Oz);
    box.rotation.set(0, Math.PI / 2, 0);
    this.scene.add(box);
    gs.TweenLite.to(box.position, 0.5, { z: box.position.z - .1 });
    gs.TweenLite.to(box.scale, 1, { x: .1, y: .1, z: .1 });

    // 2
    let box02 = this.boop.clone();
    box02.position.set(Ox, Oy, Oz);
    box02.rotation.set(0, 15 * Math.PI / 180, 0);
    this.scene.add(box02);
    gs.TweenLite.to(box02.position, 0.5, { x: box02.position.x + .095, z: box02.position.z - .03 });
    gs.TweenLite.to(box02.scale, 1, { x: .1, y: .1, z: .1 });

    // 3
    let box03 = this.boop.clone();
    box03.position.set(Ox, Oy, Oz);
    box03.rotation.set(0, 125 * Math.PI / 180, 0);
    this.scene.add(box03);
    gs.TweenLite.to(box03.position, 0.5, { x: box03.position.x + .058, z: box03.position.z + .08 });
    gs.TweenLite.to(box03.scale, 1, { x: .1, y: .1, z: .1 });

    // 4
    let box04 = this.boop.clone();
    box04.position.set(Ox, Oy, Oz);
    box04.rotation.set(0, 55 * Math.PI / 180, 0);
    this.scene.add(box04);
    gs.TweenLite.to(box04.position, 0.5, { x: box04.position.x - .058, z: box04.position.z + .08 });
    gs.TweenLite.to(box04.scale, 1, { x: .1, y: .1, z: .1 });


    // 5
    let box05 = this.boop.clone();
    box05.position.set(Ox, Oy, Oz);
    box05.rotation.set(0, 160 * Math.PI / 180, 0);
    this.scene.add(box05);
    gs.TweenLite.to(box05.position, 0.5, { x: box05.position.x - .095, z: box05.position.z - .03 });
    gs.TweenLite.to(box05.scale, 1, { x: .1, y: .1, z: .1 });

    setTimeout(() => {
      this.scene.remove(box);
      this.scene.remove(box02);
      this.scene.remove(box03);
      this.scene.remove(box04);
      this.scene.remove(box05);
    }, 1000);
  }

  CreateFirstDirectionPipe() {
    // DIRECTION PIPE
    this.directionPipe = new CANNON.Body({ mass: 5 });
    // let sphereshape = new CANNON.Box(new CANNON.Vec3(.05,.05,.05));
    let sphereshape = new CANNON.Sphere(.02);
    this.directionPipe.collisionFilterMask = 4;

    this.directionPipe.angularDamping = 0.1;
    this.directionPipe.linearDamping = 0.1;
    this.directionPipe.addShape(sphereshape);
    this.directionPipe.position.set(this.lastpipe.position.x, this.lastpipe.position.y, this.lastpipe.position.z);
    this.world02.addBody(this.directionPipe);
    this.FEcannon.push(this.directionPipe);

    this.lockConstraint = new CANNON.LockConstraint(this.directionPipe, this.lastpipe);
    this.world02.addConstraint(this.lockConstraint);

    let directionThree = new THREE.SphereBufferGeometry(0.01);

    let Dragmaterial02 = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })

    this.DragPoint = new THREE.Mesh(directionThree, Dragmaterial02);
    this.DragPoint.rotation.set(0, 0, Math.PI / 2);
    this.DragPoint.position.set(this.lastpipe.position.x, this.lastpipe.position.y, this.lastpipe.position.z);
    this.scene.add(this.DragPoint);
    this.FEthree.push(this.DragPoint);

  }

  Easing = [
    'gs.Power0.easeOut',
    'gs.Power1.easeOut',
    'gs.Power2.easeOut',
    'gs.Power3.easeOut',
  ];

  shootSmoke() {
    var vectorF = new THREE.Vector3();
    var vectorD = new THREE.Vector3();
    vectorF.setFromMatrixPosition(this.ResetPoint.matrixWorld);
    vectorD.setFromMatrixPosition(this.SmokePoint.matrixWorld);

    let smoke = this.smokeThree.clone();
    this.scene.add(smoke);
    this.meshes.push(smoke);

    let body = new CANNON.Body({ mass: .1 });
    body.addShape(this.sphereShape);
    body.position.set(vectorF.x, vectorF.y, vectorF.z);

    body.collisionFilterGroup = 2;
    body.collisionFilterMask = 1;

    this.world.addBody(body);
    this.bodies.push(body);

    gs.TweenLite.to(smoke.scale, 0.7, { x: .05, y: .05, z: .05, delay: 0.5, ease: gs.Power2.easeIn });

    let startPosition = new CANNON.Vec3(vectorF.x, vectorF.y, vectorF.z);
    let endPosition = new CANNON.Vec3(
      vectorD.x + (Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1)),
      vectorD.y + (Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1)),
      vectorD.z + (Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1))
    );

    let direction = new CANNON.Vec3();
    endPosition.vsub(startPosition, direction);

    let totalLength = this.distance(direction.x, direction.y, direction.z, 0, 0, 0);
    direction.normalize();


    let speed = totalLength / this.tweenTime;

    direction.scale(speed, body.velocity);

    gs.TweenLite.to(body.velocity, 2.5, { x: 0, y: 0, z: 0, ease: gs.Power0.easeIn });

    setTimeout(() => {
      this.scene.remove(smoke);
      this.world.remove(body);
      this.bodies.shift();
      this.meshes.shift();
    }, 1200);
  }

  distance(x, y, z, vx, vy, vz) {
    var dx = x - vx;
    var dy = y - vy;
    var dz = z - vz;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  clearSmokeInterval() {
    clearInterval(this.hold1);
    clearInterval(this.hold3);
    clearInterval(this.hold2);
    clearInterval(this.hold5);
  }

  SecondSceneEvent(): void {
    this.canvas.addEventListener('mouseup', (e) => {
      this.clearSmokeInterval();
    }, false);

    this.canvas.addEventListener('mousemove', (e) => {

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

    this.canvas.addEventListener('touchmove', (e) => {

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


    this.canvas.addEventListener('mouseleave', () => {
      this.clearSmokeInterval();
    }, false);

    this.canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();

      if (e.which == 3) {
        // right
        this.hold3 = setInterval(() => {
          this.shootSmoke();
        }, 8);
      } else if (e.which == 2) {
        // middle
        this.hold2 = setInterval(() => {
          this.shootSmoke();
        }, 8);
      } else if (e.which == 5) {
        // next
        this.hold5 = setInterval(() => {
          this.shootSmoke();
        }, 8);
      }
      else {
        this.hold1 = setInterval(() => {
          this.shootSmoke();
        }, 8);
      }
    }, false);

    this.canvas.addEventListener('touchstart', (e) => {
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

      this.hold1 = setInterval(() => {
        this.shootSmoke();
      }, 8);
    }, false);

    this.canvas.addEventListener('touchend', () => {
      this.clearSmokeInterval();
    }, false);
  }


  SecondSceneRender() {
    this.world02.step(1 / this.fps);

    this.CreatePipe();
    this.updateMeshPositions();
  }

  private PipeCurve;
  CreatePipe() {
    this.scene.remove(this.curvePipe);
    this.curvePipe.geometry.dispose();

    this.PipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(this.PipeCannon[0].position.x, this.PipeCannon[0].position.y, this.PipeCannon[0].position.z),
      new THREE.Vector3(this.PipeCannon[1].position.x, this.PipeCannon[1].position.y, this.PipeCannon[1].position.z),
      new THREE.Vector3(this.PipeCannon[2].position.x, this.PipeCannon[2].position.y, this.PipeCannon[2].position.z),
      new THREE.Vector3(this.PipeCannon[3].position.x, this.PipeCannon[3].position.y, this.PipeCannon[3].position.z),
      new THREE.Vector3(this.PipeCannon[4].position.x, this.PipeCannon[4].position.y, this.PipeCannon[4].position.z),
      new THREE.Vector3(this.PipeCannon[5].position.x, this.PipeCannon[5].position.y, this.PipeCannon[5].position.z),
      new THREE.Vector3(this.PipeCannon[6].position.x, this.PipeCannon[6].position.y, this.PipeCannon[6].position.z),
      new THREE.Vector3(this.PipeCannon[7].position.x, this.PipeCannon[7].position.y, this.PipeCannon[7].position.z),
      new THREE.Vector3(this.PipeCannon[8].position.x, this.PipeCannon[8].position.y, this.PipeCannon[8].position.z),
      new THREE.Vector3(this.PipeCannon[9].position.x, this.PipeCannon[9].position.y, this.PipeCannon[9].position.z),
      new THREE.Vector3(this.PipeCannon[10].position.x, this.PipeCannon[10].position.y, this.PipeCannon[10].position.z),
      new THREE.Vector3(this.PipeCannon[11].position.x, this.PipeCannon[11].position.y, this.PipeCannon[11].position.z),
      new THREE.Vector3(this.PipeCannon[12].position.x, this.PipeCannon[12].position.y, this.PipeCannon[12].position.z),
      new THREE.Vector3(this.PipeCannon[13].position.x, this.PipeCannon[13].position.y, this.PipeCannon[13].position.z),
      new THREE.Vector3(this.PipeCannon[14].position.x, this.PipeCannon[14].position.y, this.PipeCannon[14].position.z),
      new THREE.Vector3(this.PipeCannon[15].position.x, this.PipeCannon[15].position.y, this.PipeCannon[15].position.z),
      new THREE.Vector3(this.PipeCannon[16].position.x, this.PipeCannon[16].position.y, this.PipeCannon[16].position.z),
      new THREE.Vector3(this.PipeCannon[17].position.x, this.PipeCannon[17].position.y, this.PipeCannon[17].position.z),
      new THREE.Vector3(this.PipeCannon[18].position.x, this.PipeCannon[18].position.y, this.PipeCannon[18].position.z),
      new THREE.Vector3(this.PipeCannon[19].position.x, this.PipeCannon[19].position.y, this.PipeCannon[19].position.z),
      new THREE.Vector3(this.PipeCannon[20].position.x, this.PipeCannon[20].position.y, this.PipeCannon[20].position.z),
      new THREE.Vector3(this.PipeCannon[21].position.x, this.PipeCannon[21].position.y, this.PipeCannon[21].position.z),
      new THREE.Vector3(this.PipeCannon[22].position.x, this.PipeCannon[22].position.y, this.PipeCannon[22].position.z),
      new THREE.Vector3(this.PipeCannon[23].position.x, this.PipeCannon[23].position.y, this.PipeCannon[23].position.z),
      new THREE.Vector3(this.PipeCannon[24].position.x, this.PipeCannon[24].position.y, this.PipeCannon[24].position.z),
      new THREE.Vector3(this.PipeCannon[25].position.x, this.PipeCannon[25].position.y, this.PipeCannon[25].position.z),
      new THREE.Vector3(this.PipeCannon[26].position.x, this.PipeCannon[26].position.y, this.PipeCannon[26].position.z),
      this.lastthreepipe.position,
    ]);

    this.curvePipe = new THREE.Mesh(
      new THREE.TubeBufferGeometry(this.PipeCurve, 32, 0.025, 8, false),
      this.pipem);
    this.curvePipe.castShadow = true;
    this.scene.add(this.curvePipe);
  }
  updateMeshPositions() {
    // smoke
    for (var i = 0; i !== this.meshes.length; i++) {
      this.meshes[i].position.copy(this.bodies[i].position);
      this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
    }
    for (var i = 0; i !== this.meshes02.length; i++) {
      this.meshes02[i].position.copy(this.bodies02[i].position);
      this.meshes02[i].quaternion.copy(this.bodies02[i].quaternion);
    }
    // pop stuff
    for (var i = 0; i !== this.meshes03.length; i++) {
      this.meshes03[i].position.copy(this.bodies03[i].position);
      this.meshes03[i].quaternion.copy(this.bodies03[i].quaternion);
    }
    for (var i = 0; i !== this.FEcannon.length; i++) {
      this.FEcannon[i].position.copy(this.FEthree[i].position);
      this.FEcannon[i].quaternion.copy(this.FEthree[i].quaternion);
    }
    this.DragPoint.position.set(this.DragPointThree[0].position.x * 0.7, this.DragPointThree[0].position.y * 1.2, this.DragPointThree[0].position.z * 1.5);
  }

  resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}

function throttle(fn: Function, wait: number) {
  let isCalled = false;

  return function (...args) {
    if (!isCalled) {
      fn(...args);
      isCalled = true;
      setTimeout(function () {
        isCalled = false;
      }, wait)
    }
  };
}



function CannonDebugRenderer(scene, world) {

  this.scene = scene;
  this.world = world;

  this._meshes = [];

  this._material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  this._sphereGeometry = new THREE.SphereGeometry(1);
  this._boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  this._planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  this._cylinderGeometry = new THREE.CylinderGeometry(1, 1, 10, 10);
};

CannonDebugRenderer.prototype = {
  tmpVec0: new CANNON.Vec3(),
  tmpVec1: new CANNON.Vec3(),
  tmpVec2: new CANNON.Vec3(),
  tmpQuat0: new CANNON.Vec3(),

  update: function () {
    var bodies = this.world.bodies;
    var meshes = this._meshes;
    var shapeWorldPosition = this.tmpVec0;
    var shapeWorldQuaternion = this.tmpQuat0;

    var meshIndex = 0;

    for (var i = 0; i !== bodies.length; i++) {
      var body = bodies[i];

      for (var j = 0; j !== body.shapes.length; j++) {
        var shape = body.shapes[j];

        this._updateMesh(meshIndex, body, shape);

        var mesh = meshes[meshIndex];

        if (mesh) {

          // Get world position
          body.quaternion.vmult(body.shapeOffsets[j], shapeWorldPosition);
          body.position.vadd(shapeWorldPosition, shapeWorldPosition);

          // Get world quaternion
          body.quaternion.mult(body.shapeOrientations[j], shapeWorldQuaternion);

          // Copy to meshes
          mesh.position.copy(shapeWorldPosition);
          mesh.quaternion.copy(shapeWorldQuaternion);
        }

        meshIndex++;
      }
    }

    for (var i = meshIndex; i < meshes.length; i++) {
      var mesh = meshes[i];
      if (mesh) {
        this.scene.remove(mesh);
      }
    }

    meshes.length = meshIndex;
  },

  _updateMesh: function (index, body, shape) {
    var mesh = this._meshes[index];
    if (!this._typeMatch(mesh, shape)) {
      if (mesh) {
        this.scene.remove(mesh);
      }
      mesh = this._meshes[index] = this._createMesh(shape);
    }
    this._scaleMesh(mesh, shape);
  },

  _typeMatch: function (mesh, shape) {
    if (!mesh) {
      return false;
    }
    var geo = mesh.geometry;
    return (
      (geo instanceof THREE.SphereGeometry && shape instanceof CANNON.Sphere) ||
      (geo instanceof THREE.BoxGeometry && shape instanceof CANNON.Box) ||
      (geo instanceof THREE.PlaneGeometry && shape instanceof CANNON.Plane) ||
      (geo.id === shape.geometryId && shape instanceof CANNON.ConvexPolyhedron) ||
      (geo.id === shape.geometryId && shape instanceof CANNON.Heightfield)
    );
  },

  _createMesh: function (shape) {
    var mesh;
    var material = this._material;

    switch (shape.type) {

      case CANNON.Shape.types.SPHERE:
        mesh = new THREE.Mesh(this._sphereGeometry, material);
        break;

      case CANNON.Shape.types.BOX:
        mesh = new THREE.Mesh(this._boxGeometry, material);
        break;

      case CANNON.Shape.types.PLANE:
        mesh = new THREE.Mesh(this._planeGeometry, material);
        break;

      case CANNON.Shape.types.CONVEXPOLYHEDRON:
        // Create mesh
        var geo = new THREE.Geometry();

        // Add vertices
        for (var i = 0; i < shape.vertices.length; i++) {
          var v = shape.vertices[i];
          geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
        }

        for (var i = 0; i < shape.faces.length; i++) {
          var face = shape.faces[i];

          // add triangles
          var a = face[0];
          for (var j = 1; j < face.length - 1; j++) {
            var b = face[j];
            var c = face[j + 1];
            geo.faces.push(new THREE.Face3(a, b, c));
          }
        }
        geo.computeBoundingSphere();
        geo.computeFaceNormals();

        mesh = new THREE.Mesh(geo, material);
        shape.geometryId = geo.id;
        break;

      case CANNON.Shape.types.HEIGHTFIELD:
        var geometry = new THREE.Geometry();

        var v0 = this.tmpVec0;
        var v1 = this.tmpVec1;
        var v2 = this.tmpVec2;
        for (var xi = 0; xi < shape.data.length - 1; xi++) {
          for (var yi = 0; yi < shape.data[xi].length - 1; yi++) {
            for (var k = 0; k < 2; k++) {
              shape.getConvexTrianglePillar(xi, yi, k === 0);
              v0.copy(shape.pillarConvex.vertices[0]);
              v1.copy(shape.pillarConvex.vertices[1]);
              v2.copy(shape.pillarConvex.vertices[2]);
              v0.vadd(shape.pillarOffset, v0);
              v1.vadd(shape.pillarOffset, v1);
              v2.vadd(shape.pillarOffset, v2);
              geometry.vertices.push(
                new THREE.Vector3(v0.x, v0.y, v0.z),
                new THREE.Vector3(v1.x, v1.y, v1.z),
                new THREE.Vector3(v2.x, v2.y, v2.z)
              );
              var i = geometry.vertices.length - 3;
              geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
            }
          }
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        mesh = new THREE.Mesh(geometry, material);
        shape.geometryId = geometry.id;
        break;
    }

    if (mesh) {
      this.scene.add(mesh);
    }

    return mesh;
  },

  _scaleMesh: function (mesh, shape) {
    switch (shape.type) {

      case CANNON.Shape.types.SPHERE:
        var radius = shape.radius;
        mesh.scale.set(radius, radius, radius);
        break;

      case CANNON.Shape.types.BOX:
        mesh.scale.copy(shape.halfExtents);
        mesh.scale.multiplyScalar(2);
        break;

      case CANNON.Shape.types.CONVEXPOLYHEDRON:
        mesh.scale.set(1, 1, 1);
        break;

      case CANNON.Shape.types.HEIGHTFIELD:
        mesh.scale.set(1, 1, 1);
        break;

    }
  }
};