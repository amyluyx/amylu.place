//https://www.meshy.ai/features/image-to-3d
//https://sketchfab.com/feed

//https://vercel.com/amy-lus-projects/amylu-place

import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function ProjectModel({ position, rotation, scale, onClick }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  );
}

function NoteSwarm() {
  const note1 = useGLTF("/models/note1.glb");
  const note2 = useGLTF("/models/note2.glb");
  const note3 = useGLTF("/models/note3.glb");
  const note4 = useGLTF("/models/note4.glb");
  const stand = useGLTF("/models/music_stand.glb");

  const notes = [note1, note2, note3, note4];
  const count = 15;

  const swarmRef = useRef();

  const noteRefs = Array.from({ length: count }, () => useRef());

  useFrame(() => {
    if (swarmRef.current) {
      swarmRef.current.rotation.y += 0.002;
      swarmRef.current.rotation.x += 0.002;
    }
    noteRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.x += 0.0001;
        ref.current.rotation.y += 0.0001;
      }
    });
  });

  const notesData = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const r = 0.25 + Math.random() * 0.125;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      return {
        position: [x, y, z],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
      };
    });
  }, [count]);

  return (
    <group onClick={() => window.location.href = "/music-notes"}>
      <group ref={swarmRef} position={[0, 3.5, 0]}>
        {notesData.map((note, i) => {
          const Note = notes[i % notes.length].scene.clone();
          return (
            <primitive
              key={i}
              ref={noteRefs[i]}
              object={Note}
              position={note.position}
              scale={0.3}
              rotation={note.rotation}
            />
          );
        })}
      </group>
      <primitive object={stand.scene} scale={1.5} rotation={[0, 3, 0]} />
    </group>
  );
}

function DistanceTracker({ projects, radius, rotation, setClosestIndex }) {
  useFrame(({ camera }) => {
    let minDist = Infinity;
    let idx = 0;
    projects.forEach((_, i) => {
      const angle = (-i / projects.length) * Math.PI * 2 + rotation;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius;
      const dist = camera.position.distanceTo(new THREE.Vector3(x, 0, z));
      if (dist < minDist) {
        minDist = dist;
        idx = i;
      }
    });
    setClosestIndex(idx);
  });
  return null;
}

function SmoothNavigator({ rotation, setRotation, targetRotation, setTargetRotation }) {
  useFrame(() => {
    if (targetRotation !== null) {
      let diff = targetRotation - rotation;
      // Wrap to [-π, π] for shortest rotation
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      if (Math.abs(diff) < 0.001) {
        setRotation(targetRotation);
        setTargetRotation(null);
      } else {
        setRotation(prev => prev + diff * 0.08);
      }
    }
  });
  return null;
}

function CameraLight() {
  const lightRef = useRef();
  useFrame(({ camera }) => {
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();
    }
  });
  return <directionalLight ref={lightRef} intensity={1} />;
}

function CameraYawTracker({ yawRef }) {
  useFrame(({ camera }) => {
    // yaw around Y axis from world +Z toward +X
    yawRef.current = Math.atan2(camera.position.x, camera.position.z);
  });
  return null;
}

export default function HomePage() {
  const [rotation, setRotation] = useState(0);
  const [closestIndex, setClosestIndex] = useState(0);
  const [targetRotation, setTargetRotation] = useState(null);
  const cameraYawRef = useRef(0);
  const projects = [
    { id: 1, url: "/project1" },
    { id: 2, url: "/project2" },
    { id: 3, url: "/project3" },
    { id: 4, url: "/project4" },
    { id: 5, url: "/project5" },
  ];
  const radius = 10;

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-white via-gray-100 to-gray-300 relative">
      <div className="absolute top-8 w-full text-center text-black">
        <h1 className="header font-bold">Amy Lu</h1>
        <p className="mt-2 text-sm opacity-75">drag to spin</p>
      </div>
      <div className="h-screen w-screen">
        <Canvas
          camera={{ position: [0, 2, 25], fov: 50 }}
          gl={{ alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.5} />
          <CameraLight />
          <CameraYawTracker yawRef={cameraYawRef} />

          <DistanceTracker
            projects={projects}
            radius={radius}
            rotation={rotation}
            setClosestIndex={setClosestIndex}
          />

          <SmoothNavigator
            rotation={rotation}
            setRotation={setRotation}
            targetRotation={targetRotation}
            setTargetRotation={setTargetRotation}
          />

          {projects.map((p, i) => {
            const angle = (-i / projects.length) * Math.PI * 2 + rotation;
            const x = Math.sin(angle) * radius;
            const z = -Math.cos(angle) * radius;

            const isActive = i === closestIndex;

            if (i === 2) {
              return (
                <group
                  key={i}
                  position={[x, 0, z]}
                  rotation={[0, -angle, 0]}
                  scale={isActive ? 2 : 2} // changed it temporarily to no pop
                  onClick={() => window.location.href = p.url}
                >
                  <NoteSwarm />
                </group>
              );
            }

            return (
              <ProjectModel
                key={i}
                position={[x, 0, z]}
                rotation={[0, -angle, 0]}
                scale={isActive ? 2 : 2} // changed it temporarily to no pop
                onClick={() => window.location.href = p.url}
              />
            );
          })}

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 2.5}
          />
        </Canvas>
        <div className="absolute bottom-8 w-full text-center">
          {projects.map((p, i) => {
            const isActive = i === closestIndex;
            return (
              <span key={i}>
                <a
                  onClick={() => {
                    const anglePerProject = (2 * Math.PI) / projects.length;
                    const phi = cameraYawRef.current;                  // camera yaw
                    const thetaFront = Math.PI - phi;                  // ring's angle that is closest to camera
                    const target = thetaFront + i * anglePerProject;   // rotation that puts model i at front
                    let diff = target - rotation;
                    diff = Math.atan2(Math.sin(diff), Math.cos(diff)); // shortest arc
                    setTargetRotation(rotation + diff);
                  }}
                  className={`cursor-pointer mx-2 transition-all ${
                    isActive ? "font-bold text-xl" : "text-base text-gray-600"
                  }`}
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  model{p.id}
                </a>
                {i < projects.length - 1 && <span className="text-gray-400"> | </span>}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
