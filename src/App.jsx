//https://www.meshy.ai/features/image-to-3d
//https://sketchfab.com/feed

//https://vercel.com/amy-lus-projects/amylu-place

import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Link } from "react-router-dom";

function TeslaModel({ position, rotation, scale, onClick }) {
  const teslam3 = useGLTF("/models/teslam3.glb");
  
  return (
    <primitive
      object={teslam3.scene}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    />
  );
}

function FormulaModel({ position, rotation, scale, onClick }) {
  const formula = useGLTF("/models/formula_logo_extruded.glb");

  return (
    <primitive
      object={formula.scene}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    />
  );
}

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

function CapstonePanel({ onClose }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 px-6">
      <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Capstone</p>
            <h2 className="mt-2 text-3xl font-bold text-black">Wick Academic Planning Assistant</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 transition hover:text-black"
          >
            close
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm leading-6 text-gray-700">
          <section>
            <h3 className="text-base font-semibold text-black">Goals</h3>
            <p className="mt-2">
              Our capstone focuses on Wick, a chatbot-centered academic planning assistant for UW students.
              The goal is to reduce the effort of tracking coursework, schedules, and major requirements by
              centralizing fragmented academic information into one conversational system.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-black">Team Process</h3>
            <p className="mt-2">
              As a team, we scoped the MVP around three flows: conversational onboarding, personalized study
              planning, and proactive deadline guidance. We built interactive prototypes for each flow, tested
              them with UW students, and used feedback to simplify the dashboard, clarify onboarding, and reduce
              notification noise.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-black">What We Built</h3>
            <p className="mt-2">
              The MVP includes an onboarding prototype that gathers academic context, a planning prototype that
              generates study blocks around a student&apos;s schedule, and a proactive guidance prototype that
              surfaces major application deadlines and prerequisite progress. Together these validate whether a
              chat-based interface can make academic planning more actionable and less overwhelming.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-black">My Contribution</h3>
            <p className="mt-2">
              My individual focus is the AI/ML integration. I&apos;m working on how the chatbot interprets student
              context, turns planning data into useful recommendations, and supports proactive academic guidance
              with reliable, structured outputs instead of generic chat responses.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-black">Takeaways</h3>
            <p className="mt-2">
              The project has reinforced that the technical challenge is not only generating suggestions, but
              making them trustworthy, editable, and grounded in real student data. User feedback showed strong
              interest in automatic deadline aggregation and priority views, while also making it clear that long-
              term usefulness depends on accuracy, syncing reliability, and clear explanations of how recommendations
              are produced.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-black">Next Steps</h3>
            <p className="mt-2">
              The next phase is narrowing scope further and moving from prototype validation into implementation.
              That includes building a working chatbot, handling academic data more robustly, and connecting the
              AI layer to core planning features in a way that stays feasible for spring quarter development.
            </p>
          </section>
        </div>
      </div>
    </div>
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
  const [showCapstonePanel, setShowCapstonePanel] = useState(false);
  const cameraYawRef = useRef(0);
  const projects = [
    { id: 1, url: "/project1" },
    { id: 2, url: "/project2" },
    { id: 3, url: "/project3" },
    { id: 4, url: "/electromagnetism" },
    { id: 5, url: "/project5" },
  ];
  const radius = 10;

  return (
    <div className="w-screen h-screen bg-white relative">
      <div className="absolute top-8 w-full text-center text-black z-50 pointer-events-auto">
        <h1 className="header font-bold">Amy Lu</h1>
        <p className="mt-2 text-sm opacity-75">
          <Link to="/about" className="underline cursor-pointer hover:text-gray-600">
            About me
          </Link>
        </p>
        <p className="mt-2 text-sm opacity-75">drag to spin</p>
      </div>
      <div className="h-screen w-screen">
        {showCapstonePanel && <CapstonePanel onClose={() => setShowCapstonePanel(false)} />}
        <Canvas
          camera={{ position: [0, 2, 25], fov: 50 }}
          gl={{ alpha: true }}
          style={{ background: "transparent" }}
          className="z-0"
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

            if (i === 2) {
              return (
                <group
                  key={i}
                  position={[x, 0, z]}
                  rotation={[0, -angle, 0]}
                  // scale={isActive ? 2 : 2} // changed it temporarily to no pop
                  scale={2}
                  onClick={() => window.location.href = p.url}
                >
                  <NoteSwarm />
                </group>
              );
            }

            if (i === 1) {
              return (
                <group
                  key={i}
                  position={[x, 0, z]}
                  rotation={[0, -angle, 0]}
                  scale={2}
                  onClick={() => setShowCapstonePanel(true)}
                >
                  <ProjectModel position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />
                  <Text
                    position={[0, -1.15, 0]}
                    fontSize={0.18}
                    color="#111111"
                    anchorX="center"
                    anchorY="middle"
                  >
                    capstone
                  </Text>
                </group>
              );
            }

            if (i === 0) {
              return (
                <FormulaModel
                  key={i}
                  position={[x, 0, z]}
                  rotation={[0, -angle, 72.25]}
                  scale={3.5}
                  onClick={() => window.location.href = p.url}
                />
              );
            }

            if (i === 4) {
              return (
                <TeslaModel
                  key={i}
                  position={[x-2.5, 0, z]}
                  rotation={[0, -angle + THREE.MathUtils.degToRad(60), 0]}
                  // scale={isActive ? 2 : 1.5}
                  scale={1.2}
                  onClick={() => window.location.href = p.url}
                />
              );
            }

            return (
              <ProjectModel
                key={i}
                position={[x, 0, z]}
                rotation={[0, -angle, 0]}
                // scale={isActive ? 2 : 2} // changed it temporarily to no pop
                scale={2}
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
