import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as gs from 'gsap';
import { OrbitControls } from 'three-orbitcontrols-ts';
import GLTFLoader from 'three-gltf-loader';
import { Injectable } from '@angular/core';


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
    private light: THREE.AmbientLight;
    private loader: GLTFLoader;
    // CANNON BASIC SETUP
    private world = new CANNON.World();
    private sphere: THREE.Mesh;
    private FireExtinguisher=new THREE.Object3D();
    private meshes = [];
    private bodies = [];
    private hold1=null;
    private hold2=null;
    private hold3=null;
    private hold5=null;

    private clientX;
    private clientY;

    private targetRotationX = 0;
    private targetRotationOnMouseDownX = 0;

    private targetRotationY = 0;
    private targetRotationOnMouseDownY = 0;

    private mouseX = 0;
    private mouseXOnMouseDown = 0;

    private mouseY = 0;
    private mouseYOnMouseDown = 0;

    private windowHalfX = window.innerWidth / 2;
    private windowHalfY = window.innerHeight / 2;

    private finalRotationY;

    // Fire Extinguisher
    smokeThree:THREE.Mesh;
    FETHREE = new THREE.Group();
    FETap = new THREE.Mesh();
    SmokePoint = new THREE.Mesh();
    MovePoint = new THREE.Mesh();
    ForcePoint = new THREE.Mesh();
    FEcannon = [];
    FEthree = [];

    InitThree(elementId:string):void{
        this.canvas = <HTMLCanvasElement>document.getElementById(elementId);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,    // transparent background
            antialias: true // smooth edges
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor("#a8b3d3",1);
        // create the scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 1000);
        this.camera.position.set(0,0,10);
        this.scene.add(this.camera);
        //this.light = new THREE.AmbientLight(0xfafafa);
        // this.light.position.z = 10;
        //this.scene.add(this.light);
        // this.controls = new OrbitControls(this.camera,this.canvas);

        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xb5b5b5, 1.2);
        this.scene.add(hemiLight)
    }

    InitStuffs():void{
        this.InitCannon();
        this.CannonPlane();
        this.CreateSmoke();
        this.CreateFireExtinguisher();
        this.createStuffs();
        this.createSpace();
    }

    InitCannon():void{
        this.world = new CANNON.World();
        this.world.gravity.set(0,0,0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
    }

    CannonPlane(){
        // var shape = new CANNON.Plane();
        // var body = new CANNON.Body({ mass: 0 });
        // body.addShape(shape);
        // body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        // body.position.set(0,-2,0);
        // this.world.addBody(body);
    }

    
    CreateSmoke(){
        let geometry = new THREE.SphereGeometry(.11,.11,.11);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        this.smokeThree = new THREE.Mesh(geometry,material);
    }

    
    CreateFireExtinguisher(){

        var invisible = new THREE.MeshBasicMaterial({transparent:true,opacity:0});

        var size = 0.3;

        var sphereShape = new CANNON.Box(new CANNON.Vec3(size,size*2.4,size));
        var sphereBody = new CANNON.Body({ mass: 1 });
        sphereBody.addShape(sphereShape);
        sphereBody.position.set(0,0,0);
        // sphereBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),180);
        this.world.addBody(sphereBody);
        this.FEcannon.push(sphereBody)

        // size *= 2;
        let geometry = new THREE.BoxGeometry(size,size*2.4,size);
        // let mesh = new THREE.Mesh(geometry);
        // mesh.position.set(0,0.65,0);
        // this.FETHREE.add(mesh);

        geometry = new THREE.BoxGeometry(0.1,0.1,0.1);
        let wireframe = new THREE.MeshBasicMaterial({wireframe:true, color: 0x666666});
        this.FETap = new THREE.Mesh( geometry,invisible );
        this.FETap.position.set(0.64,0.4,0);
        this.FETHREE.add(this.FETap);
        
        let boxGeo = new THREE.BoxBufferGeometry(0.1,0.1,0.1);
        this.SmokePoint = new THREE.Mesh(boxGeo,invisible);
        this.SmokePoint.position.set(1.44,-0.4,0);
        this.FETHREE.add(this.SmokePoint);

        this.ForcePoint = new THREE.Mesh(boxGeo,invisible);
        this.ForcePoint.position.set(-1,1,0);
        this.FETHREE.add(this.ForcePoint);

        this.MovePoint = new THREE.Mesh(boxGeo,invisible);
        this.MovePoint.position.set(-.1,.1,0);
        this.FETHREE.add(this.MovePoint);

        this.loader = new GLTFLoader();
        this.loader.load(
            'assets/model/extinguisher.glb',
            (gltf)=>{
                this.FireExtinguisher=gltf.scene;
                this.FireExtinguisher.scale.set(0.32,0.32,0.32);
                this.FireExtinguisher.position.set(0,-0.5,0);
                this.FireExtinguisher.rotation.set(0,Math.PI/2,0)
                this.FETHREE.add(this.FireExtinguisher);
            }
        );

        // this.FETHREE.rotation.set(0,0,-Math.PI/6)
        this.scene.add(this.FETHREE);
        this.FEthree.push(this.FETHREE);

        this.camera.lookAt(this.FETHREE.position);
    }

    Easing = [
        'gs.Power0.easeOut',
        'gs.Power1.easeOut',
        'gs.Power2.easeOut',
        'gs.Power3.easeOut',
    ];
    //Destination = new THREE.Group();

    shootSmoke(){
        var vectorF = new THREE.Vector3();
        var vectorD = new THREE.Vector3();
        
        vectorF.setFromMatrixPosition(this.FETap.matrixWorld);
        let F = vectorF;
        vectorD.setFromMatrixPosition(this.SmokePoint.matrixWorld);
        let D = vectorD;

        var vectorForce = new THREE.Vector3();
        vectorForce.setFromMatrixPosition(this.MovePoint.matrixWorld);
        let Force = vectorForce;
        
        for(var i=0;i<5;i++){
            let Dx = D.x + (Math.random()*0.26 * (Math.random() < 0.5 ? -1 : 1));
            let Dy = D.y + (Math.random()*0.26 * (Math.random() < 0.5 ? -1 : 1));
            let Dz = D.z + (Math.random()*0.26 * (Math.random() < 0.5 ? -1 : 1));
    
            let smoke = this.smokeThree.clone();
            
            this.scene.add(smoke);

            gs.TweenLite.fromTo(smoke.position,1,
                {x:F.x,y:F.y,z:F.z,},
                {x:Dx,y:Dy,z:Dz,ease:gs.Power2.easeOut});
            gs.TweenLite.to(smoke.scale,0.7,{x:.05,y:.05,z:.05,delay:0.3,ease: gs.Power0.easeIn});
            setTimeout(() => {
                this.scene.remove(smoke);
            }, 1100);
        }

        gs.TweenLite.to(this.FEcannon[0].position,.15,{x:Force.x,y:Force.y,z:Force.z,ease: gs.Power0.easeNone})
        gs.TweenLite.to(this.camera.position,.15,{x:Force.x,y:Force.y,ease: gs.Power0.easeNone})
    }

    spacespace(){
        var vectorForce = new THREE.Vector3();
        vectorForce.setFromMatrixPosition(this.ForcePoint.matrixWorld);
        let Force = vectorForce;
        gs.TweenLite.to(this.FEcannon[0].position,2,{x:Force.x,y:Force.y,z:Force.z,ease: gs.Power1.easeOut})
        gs.TweenLite.to(this.camera.position,2,{x:Force.x,y:Force.y,ease: gs.Power1.easeOut})
        this.FEcannon[0].velocity.set(0,0,0);
    }
    
    private rock:THREE.Mesh;
    private box:THREE.Mesh;
    
    createStuffs(){
        let geometry = new THREE.SphereBufferGeometry(0.3,16,16);
        let mesh = new THREE.Mesh(geometry);
        this.rock = mesh.clone();

        let boxgeometry = new THREE.BoxBufferGeometry(0.4,0.4,0.4);
        let boxmesh = new THREE.Mesh(boxgeometry);
        this.box = boxmesh.clone();
    }

    createSpace(){
        for(var i=0;i<10;i++){
            let rockCannon = new CANNON.Sphere(Math.random()+0.5);
            let body = new CANNON.Body({mass:1});
            body.addShape(rockCannon);
            body.position.set(Math.random()*10,Math.random()*5,Math.random()*5);
            this.world.addBody(body);
            this.bodies.push(body);
    
            let box = this.box.clone();
            this.scene.add(box);
            this.meshes.push(box);
        }
        for(var i=0;i<10;i++){

        }
    }
    
    

    clearSmokeInterval(){
        clearInterval(this.hold1);
        clearInterval(this.hold3);
        clearInterval(this.hold2);
        clearInterval(this.hold5);
    }

    private holding:boolean=false;
    

    // onMouseMove(e){
    //     this.mouseX = e.clientX - this.windowHalfX;
    //     this.mouseY = e.clientY - this.windowHalfY;

    //     this.targetRotationY = this.targetRotationOnMouseDownY + (this.mouseY - this.mouseYOnMouseDown) * 0.02;
    //     this.targetRotationX = this.targetRotationOnMouseDownX + (this.mouseX - this.mouseXOnMouseDown) * 0.02;
    //     console.log(this.windowHalfX)
    // }
    // onMouseUp(){
    //     window.addEventListener('mousemove', this.onMouseMove, false );
    //         window.addEventListener('mouseup', this.onMouseUp, false );
    //         window.addEventListener('mouseout', this.onMouseOut, false );
            
    // }
    // onMouseOut(){
    //     window.addEventListener('mousemove', this.onMouseMove, false );
    //         window.addEventListener('mouseup', this.onMouseUp, false );
    //         window.addEventListener('mouseout', this.onMouseOut, false );
    // }
    
    animate():void{
        window.addEventListener('DOMContentLoaded', () => {
            this.render();
        });

        window.addEventListener('mouseup', (e) => {
            this.holding=false;
            this.clearSmokeInterval();
            this.spacespace();
        }, false);

        window.addEventListener('mousemove', (e) => {
            if(this.holding==true){
                this.mouseX = e.clientX - this.windowHalfX;
                this.mouseY = e.clientY - this.windowHalfY;

                this.targetRotationY = this.targetRotationOnMouseDownY + (this.mouseY - this.mouseYOnMouseDown) * 0.02;
                this.targetRotationX = this.targetRotationOnMouseDownX + (this.mouseX - this.mouseXOnMouseDown) * 0.02;
            }
        }, false)
        

        window.addEventListener('mouseleave', () => {
            this.clearSmokeInterval();
            this.spacespace();
        }, false);

        // window.addEventListener('mousemove', this.onMouseMove, false );
        // window.addEventListener('mouseup', this.onMouseUp, false );
        // window.addEventListener('mouseout', this.onMouseOut, false );

        window.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.holding=true;
            this.mouseXOnMouseDown = e.clientX - this.windowHalfX;
            this.targetRotationOnMouseDownX = this.targetRotationX;

            this.mouseYOnMouseDown = e.clientY - this.windowHalfY;
            this.targetRotationOnMouseDownY = this.targetRotationY;
            

            if(e.which == 3){
                // right
                this.hold3=setInterval(() => {
                    this.shootSmoke();
                }, 60);
            } else if(e.which == 2){
                // middle
                this.hold2=setInterval(() => {
                    this.shootSmoke();
                }, 60);
            } else if(e.which == 5){
                // next
                this.hold5=setInterval(() => {
                    this.shootSmoke();
                }, 60);
            } else {
                this.hold1=setInterval(() => {
                    this.shootSmoke();
                }, 30);
                
                // this.hold2=setInterval(() => {
                    
                // }, 200);
            }
        }, false);
        
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    test=0;
    render() {
        requestAnimationFrame(() => {
          this.render();
        });
        //horizontal rotation   
        this.FEthree[0].rotation.y += ( this.targetRotationX - this.FEthree[0].rotation.y ) * 0.01;

        //vertical rotation 
        this.finalRotationY = (this.targetRotationY - this.FEthree[0].rotation.x); 
        this.FEthree[0].rotation.x += this.finalRotationY * 0.01;


        // this.FETHREE.rotation.y+=0.01;
        // this.FETHREE.rotation.z+=0.01;
        // this.FETHREE.position.x+=0.01;
        this.updateMeshPositions();
        this.renderer.render(this.scene, this.camera);
    }
    
    updateMeshPositions(){
        this.world.step(1/120);
        for(var i=0; i !== this.meshes.length; i++){
            this.meshes[i].position.copy(this.bodies[i].position);
            this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
        }
        this.FEthree[0].position.copy(this.FEcannon[0].position);
        this.FEcannon[0].quaternion.copy(this.FEthree[0].quaternion);
    }

    resize() {
        let width = window.innerWidth;
        let height = window.innerHeight;
    
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize( width, height );
    }
}