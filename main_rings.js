import * as THREE from 'three';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";


//init scene
const canvas = document.querySelector('#rings_canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
//renderer.shadowMap.enabled = true;

const camera = new THREE.PerspectiveCamera(35, 2, 0.1, 1000)
camera.position.set(0, 0, 17);
camera.focus = 10;
camera.up.set(0, 1, 0);
camera.lookAt(0, 0, 0);

/*
let controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();
*/
const scene = new THREE.Scene();
const plane = new THREE.Object3D();
scene.add(plane);

{
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 30, 30);
    scene.add(directionalLight);
}

const materialFun = new THREE.MeshStandardMaterial({ //new THREE.MeshLambertMaterial({
    color: 0xCCCCCC,
    roughness: 0.2,
    metalness: 0.95,
    side: THREE.FrontSide
});

const dkey = 369100657;

const materialMid = new THREE.MeshBasicMaterial({ color: 0xFF00FF, side: THREE.DoubleSide })
const ringspos = [
    { x: 1225, y: 850, z: 0, rotz: 26.7, rotx: -20, maxX:-Math.PI/10, maxY:-Math.PI/10., maxZ: 0. },
    { x: 1385, y: 700, z: 0, rotz: -8, rotx: 45, maxX:Math.PI/35, maxY:Math.PI/5, maxZ: 0. }, //maxX:Math.PI/35, maxY:Math.PI/35., maxZ: 0.
    { x: 1463, y: 522, z: -0.5, rotz: 34.3, rotx: 5, maxX:-Math.PI/10, maxY:-Math.PI/10., maxZ: 0. },
    { x: 1480, y: 390, z: -1.7, rotz: -26.3, rotx: 0, maxX:Math.PI/25, maxY:Math.PI/25., maxZ: 0. },
    { x: 1325, y: 280, z: 0., rotz: 6.9, rotx: -30, maxX:-Math.PI/25, maxY:-Math.PI/25., maxZ: 0. },
]
ringspos.forEach((p) => {
    let ring = createComposite();
    let pos = new THREE.Object3D();
    pos.add(ring);
    let p1 = getPoint(p.x, p.y);
    ring.rotation.z = (p.rotz / 180 * Math.PI);
    ring.rotation.x = (p.rotx / 180 * Math.PI);
    pos.translateX(p1.x);
    pos.translateY(p1.y);
    pos.translateZ(p.z);
    plane.add(pos);
    p.ring = ring;

});


let speed = {
    maxX: Math.PI / 40.,
    maxY: Math.PI / 60.,
    maxZ: 0,
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    scale:5,
    fading: 0.001
}
let mouse = {
    x: 0,
    y: 0,
    z: 0
};

window.addEventListener('mousemove', mouseCursorGet);
window.addEventListener('touchmove', mouseCursorGet);
if (dkey == demo())
    requestAnimationFrame(render);


function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}



function render(time) {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    time *= 0.001; // convert to seconds;

    speed.rotation.x += (mouse.y - speed.rotation.x) * speed.fading;
    speed.rotation.y += (mouse.x - speed.rotation.y) * speed.fading;
    speed.rotation.z += (mouse.z - speed.rotation.z) * speed.fading;
   
    plane.rotation.x = speed.maxX * Math.sin(speed.scale*speed.rotation.x);
    plane.rotation.y = speed.maxY * Math.sin(speed.scale*speed.rotation.y);
    plane.rotation.z = speed.maxZ * Math.sin(speed.scale*speed.rotation.z);
    
    
    ringspos.forEach((p) => {
        //p.ring.rotation.z = p.rotz / 180 * Math.PI + p.maxX * Math.sin(speed.rotation.x);
        p.ring.rotation.x = p.rotx / 180 * Math.PI + p.maxX * Math.sin(speed.scale*speed.rotation.x);
        p.ring.rotation.y = 0 + p.maxY * Math.sin(speed.scale*speed.rotation.y);
        
    });
    




    //controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}




function mouseCursorGet(e) {
    let touches = e.targetTouches;
    let position = {
        x: touches ? touches[0].clientX : e.clientX,
        y: touches ? touches[0].clientY : e.clientY
    }
    let ax = (position.x / window.innerWidth) * 2 - 1;
    let ay = -(position.y / window.innerHeight) * 2 + 1;

    mouse.x = ax * Math.PI * 2.5;
    mouse.y = -ay * Math.PI * 2.5;
    mouse.z = 0;
}

function createComposite() {
    
    let d = 6.12, w = 0.44, h = 0.35;
    let res = new THREE.Object3D();
    const extrudeSettings = {
        curveSegments: 200,
        steps: 1,
        depth: h,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelOffset: 0,
        bevelSegments: 2,
    };

    const extrudeSettings2 = {
        curveSegments: 200,
        steps: 2,
        depth: h / 4,
        bevelEnabled: true,
        bevelThickness: 0.,
        bevelSize: 0.0,
        bevelOffset: 0,
        bevelSegments: 0,
    };
    let geom1 = createRing(d, w, h, extrudeSettings);
    let mesh1 = new THREE.Mesh(geom1, materialFun);
    mesh1.rotateX(Math.PI / 2.0);
    res.add(mesh1);

    let geom2 = new createRing(d + 0.1, w / 3, h / 4, extrudeSettings2);
    let mesh2 = new THREE.Mesh(geom2, materialMid);
    mesh2.rotateX(Math.PI / 2.0);
    res.add(mesh2);
    return res;

}

function createRing(d, w, h, sets) {
    let r1 = d / 2., r2 = (d - 2 * w) / 2.;
    let ringShape = new THREE.Shape();

    let path = new THREE.Path();
    path.arc(0, 0, r1, 0, Math.PI * 2, false);
    ringShape.add(path);

    let path2 = new THREE.Path();
    path2.arc(0, 0, r2, 0, Math.PI * 2, true);
    ringShape.add(path2);

    let geom1 = new THREE.ExtrudeGeometry(ringShape, sets);
    geom1.translate(0, 0, -h / 2.);
    return geom1;

}

function getPoint(x, y) {
    x = (x - 1920 / 2) / 100;
    y = (1080 / 2 - y) / 100;
    return { x: x, y: y };
}

function demo() {
    function hs(t) {
        let hash = 0;
        for (let i = 0; i < t.length; i++) {
          const chr = t.charCodeAt(i);
          hash = ((hash << 5) - hash) + chr;
          hash |= 0; 
        }
        return hash;
      };
    const materialDemo = new THREE.MeshStandardMaterial({
        emissive: 0xFFFF00,
        envMapIntensity: 1,
        roughness: 0.,
        metalness: 0.3,
        side: THREE.DoubleSide
    });
    let svgMarkup = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    width="1280.000000pt" height="930.000000pt" viewBox="0 0 1280.000000 930.000000"
    preserveAspectRatio="xMidYMid meet">
   <g transform="translate(0.000000,930.000000) scale(0.100000,-0.100000)"
   fill="#000000" stroke="none">
  
   <path d="M400 8990 l-25 -20 -3 -579 c-4 -626 1 -775 25 -798 22 -23 564 -22
   666 1 231 51 411 232 479 481 29 106 31 325 4 428 -38 147 -135 296 -247 381
   -71 55 -105 71 -197 96 -68 18 -113 21 -377 25 -290 5 -301 4 -325 -15z m556
   -347 c186 -55 252 -391 118 -606 -47 -75 -123 -112 -224 -107 l-65 3 -3 350
   c-1 192 0 356 3 362 6 18 109 17 171 -2z"/>
   <path d="M2000 8990 l-27 -21 0 -673 c0 -592 2 -674 16 -694 l15 -22 494 0
   495 0 16 24 c13 21 15 49 12 165 -2 98 -7 144 -16 153 -10 10 -84 14 -312 16
   l-300 3 0 94 0 95 224 0 c290 0 271 -12 271 175 0 187 19 175 -271 175 l-224
   0 0 84 0 85 296 3 296 3 19 24 c16 20 19 40 19 151 0 111 -3 131 -19 151 l-19
   24 -479 3 c-474 3 -480 2 -506 -18z"/>
   <path d="M3600 8990 l-24 -19 0 -677 0 -677 24 -19 c20 -17 40 -19 156 -19
   116 0 136 2 156 19 l24 19 5 363 5 364 39 -130 c139 -466 187 -611 203 -622
   24 -18 243 -18 267 0 20 14 26 33 157 457 l94 305 5 -370 c3 -203 7 -371 8
   -372 1 -1 9 -9 18 -17 13 -13 44 -16 179 -16 145 0 165 2 186 19 l24 19 0 677
   0 677 -24 19 c-21 18 -42 19 -271 19 -221 0 -250 -2 -269 -17 -15 -13 -46
   -101 -113 -320 -51 -166 -97 -303 -102 -305 -5 -2 -49 134 -98 302 -64 218
   -95 310 -110 323 -18 15 -46 17 -268 17 -229 0 -250 -1 -271 -19z"/>
   <path d="M6000 8990 c-259 -68 -429 -308 -455 -640 -13 -167 18 -334 91 -482
   85 -174 216 -281 389 -317 223 -47 457 27 582 184 168 212 217 550 122 836
   -76 227 -213 370 -405 420 -74 19 -250 19 -324 -1z m250 -362 c72 -53 104
   -183 97 -392 -6 -180 -22 -238 -82 -297 -40 -40 -46 -43 -97 -43 -73 0 -114
   28 -150 100 -37 74 -52 179 -45 325 8 189 41 274 122 316 47 24 115 20 155 -9z"/>
   </g>
   </svg>`;
   

    const loader = new SVGLoader();
    const svgData = loader.parse(svgMarkup);

    // Group that will contain all of our paths
    const svgGroup = new THREE.Object3D();



    // Loop through all of the parsed paths
    svgData.paths.forEach((path, i) => {
        const shapes = path.toShapes(true);

        // Each path has array of shapes
        shapes.forEach((shape, j) => {
            // Finally we can take each shape and extrude it
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 50.,
                bevelEnabled: false
            });
            //geometry.scale(0.1);
            // Create a mesh and add it to the group
            const mesh = new THREE.Mesh(geometry, materialDemo);
            mesh.scale.set(0.015, 0.015, 0.015);

            svgGroup.add(mesh);
        });
    });

    scene.add(svgGroup);
    svgGroup.rotateX(Math.PI);
    svgGroup.rotateY(-0.3);
    svgGroup.translateX(-11);
    svgGroup.translateY(-3);
    return hs(svgMarkup);
}



