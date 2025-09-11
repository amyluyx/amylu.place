// src/Electromagnetism.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SmoothieChart, TimeSeries } from "smoothie";

export default function Electromagnetism() {
  const mountRef = useRef(null);
  const graphRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, controls;
    let centralCharge;
    let fieldArrows = [];
    const particles = [];
    const particleSeries = [];
    const smoothie = new SmoothieChart();
    const k = 1;

    function setupGraph() {
      if (graphRef.current) smoothie.streamTo(graphRef.current);
    }

    function createFieldArrow(position, direction) {
      const length = 0.5;
      const headLength = 0.2;
      const headWidth = 0.1;

      const distanceFromCenter = position.length();
      const scaleFactor = 1 / (distanceFromCenter * distanceFromCenter + 0.1);
      const arrowLength = length * scaleFactor;

      const arrowHelper = new THREE.ArrowHelper(
        direction.normalize(),
        position,
        arrowLength,
        0x3498db,
        headLength * scaleFactor,
        headWidth * scaleFactor
      );

      arrowHelper.cone.material.transparent = true;
      arrowHelper.cone.material.opacity = 0.3;
      arrowHelper.line.material.transparent = true;
      arrowHelper.line.material.opacity = 0.3;

      return arrowHelper;
    }

    function createElectricField() {
      const gridSize = 3;
      const spacing = 1;
      for (let x = -gridSize; x <= gridSize; x++) {
        for (let y = -gridSize; y <= gridSize; y++) {
          for (let z = -gridSize; z <= gridSize; z++) {
            if (x === 0 && y === 0 && z === 0) continue;
            const pos = new THREE.Vector3(x * spacing, y * spacing, z * spacing);
            const dir = pos.clone().normalize();
            const arrow = createFieldArrow(pos, dir);
            scene.add(arrow);
            fieldArrows.push(arrow);
          }
        }
      }
    }

    function createCentralCharge() {
      const geometry = new THREE.SphereGeometry(0.2, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0xd85675,
        emissive: 0xd85675,
        emissiveIntensity: 0.3,
      });
      centralCharge = new THREE.Mesh(geometry, material);

      const glowGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xd85675,
        transparent: true,
        opacity: 0.2,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      centralCharge.add(glow);

      scene.add(centralCharge);
    }

    function createParticle(position, charge) {
      const geometry = new THREE.SphereGeometry(0.1, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: charge > 0 ? 0x00ff00 : 0x0000ff,
      });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      particle.charge = charge;
      particle.velocity = new THREE.Vector3();

      const series = new TimeSeries();
      particleSeries.push(series);
      smoothie.addTimeSeries(series, {
        strokeStyle: `hsl(${Math.random() * 360}, 100%, 50%)`,
        lineWidth: 2,
      });

      scene.add(particle);
      particles.push(particle);
    }

    function calculateForceOnParticle(p) {
      let total = new THREE.Vector3();
      const toCenter = centralCharge.position.clone().sub(p.position);
      const distSq = toCenter.lengthSq();
      if (distSq > 0) {
        const f = k * p.charge * 1 / distSq;
        total.add(toCenter.normalize().multiplyScalar(f));
      }
      particles.forEach((o) => {
        if (o !== p) {
          const toO = o.position.clone().sub(p.position);
          const distSq2 = toO.lengthSq();
          if (distSq2 > 0) {
            const f = -k * p.charge * o.charge / distSq2;
            total.add(toO.normalize().multiplyScalar(f));
          }
        }
      });
      return total;
    }

    function updateParticles(dt) {
      particles.forEach((p, i) => {
        const force = calculateForceOnParticle(p);
        const accel = force.clone(); // m=1
        p.velocity.add(accel.multiplyScalar(dt));
        p.position.add(p.velocity.clone().multiplyScalar(dt));
        particleSeries[i].append(Date.now(), p.velocity.length());
      });
    }

    function onMouseDown(e) {
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersect = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, intersect)) {
        const charge = Math.random() > 0.5 ? 1 : -1;
        createParticle(intersect, charge);
      }
    }

    function init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x111111);
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(5, 5, 5);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const d = new THREE.DirectionalLight(0xffffff, 0.5);
      d.position.set(10, 10, 10);
      scene.add(d);

      createCentralCharge();
      createElectricField();
      setupGraph();

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
      window.addEventListener("mousedown", onMouseDown);
    }

    function animate() {
      requestAnimationFrame(animate);
      updateParticles(0.016);
      if (controls) controls.update();
      renderer.render(scene, camera);
    }

    init();
    animate();

    return () => {
      if (renderer && renderer.domElement && mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-black">
      <div ref={mountRef} className="w-full h-full"></div>
      <canvas
        id="velocityGraph"
        ref={graphRef}
        width="400"
        height="200"
        style={{ position: "absolute", bottom: "20px", right: "20px", border: "1px solid #555" }}
      />
    </div>
  );
}