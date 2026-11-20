"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { ModelArchitecture } from "../types";
import { useAtlasStore } from "../store";

function CameraReset({ resetKey }: { resetKey: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 8, 28);
    camera.lookAt(0, 0, 0);
  }, [resetKey, camera]);
  return null;
}

function FlowPulse({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const t = (Math.sin(clock.elapsedTime * 2) + 1) / 2;
    ref.current.position.z = -18 + t * 36;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.15 + t * 0.35;
  });
  if (!active) return null;
  return (
    <mesh ref={ref} position={[0, 0.2, -18]}>
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshStandardMaterial color="#4da3ff" transparent opacity={0.4} emissive="#2b7fff" emissiveIntensity={1.2} />
    </mesh>
  );
}

function BlockMesh({
  layer,
  z,
  selected,
  entered,
  onSelect,
  onEnter,
}: {
  layer: number;
  z: number;
  selected: boolean;
  entered: boolean;
  onSelect: () => void;
  onEnter: () => void;
}) {
  const color = entered ? "#ff6b4a" : selected ? "#4da3ff" : "#1a2332";
  const emissive = entered || selected ? "#2b7fff" : "#0a1018";
  return (
    <group position={[0, 0, z]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEnter();
        }}
      >
        <boxGeometry args={[6.2, 1.05, 0.55]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={selected || entered ? 0.55 : 0.08}
          metalness={0.35}
          roughness={0.45}
        />
        <Edges threshold={15} color={selected || entered ? "#9fd0ff" : "#2a3548"} />
      </mesh>
      {(layer % 4 === 0 || selected || entered) && (
        <Html center distanceFactor={28} style={{ pointerEvents: "none" }}>
          <div className="atlas-html-label">L{layer}</div>
        </Html>
      )}
    </group>
  );
}

function ExpandedBlock({
  model,
  layer,
  selectedHead,
  onHead,
}: {
  model: ModelArchitecture;
  layer: number;
  selectedHead: number | null;
  onHead: (h: number) => void;
}) {
  const heads = Math.min(model.numAttentionHeads, 16);
  return (
    <group position={[10.5, 0, 0]}>
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[7.5, 0.35, 3.2]} />
        <meshStandardMaterial color="#122033" emissive="#00c2a8" emissiveIntensity={0.25} />
        <Edges color="#3ddc97" />
      </mesh>
      <Html position={[0, 3.1, 0]} center>
        <div className="atlas-html-banner">Block L{layer} · Attention + MLP</div>
      </Html>

      {/* Attention heads */}
      {Array.from({ length: heads }).map((_, i) => {
        const col = i % 8;
        const row = Math.floor(i / 8);
        const active = selectedHead === i;
        return (
          <mesh
            key={i}
            position={[-2.6 + col * 0.75, 1.3 - row * 0.7, 0.2]}
            onClick={(e) => {
              e.stopPropagation();
              onHead(i);
            }}
          >
            <boxGeometry args={[0.55, 0.45, 0.35]} />
            <meshStandardMaterial
              color={active ? "#ffb020" : "#243044"}
              emissive={active ? "#ffb020" : "#000"}
              emissiveIntensity={active ? 0.6 : 0}
            />
          </mesh>
        );
      })}

      {/* QKV / O projections */}
      {["Q", "K", "V", "O"].map((lab, i) => (
        <group key={lab} position={[-2.4 + i * 1.6, 0.15, 0]}>
          <mesh>
            <boxGeometry args={[1.2, 0.4, 0.5]} />
            <meshStandardMaterial color="#1e3a5f" emissive="#2b7fff" emissiveIntensity={0.2} />
          </mesh>
          <Html center distanceFactor={22}>
            <div className="atlas-html-label">{lab}</div>
          </Html>
        </group>
      ))}

      {/* MLP */}
      <mesh position={[0, -1.6, 0]}>
        <boxGeometry args={[6.5, 0.9, 1.4]} />
        <meshStandardMaterial color="#1a2e28" emissive="#00c2a8" emissiveIntensity={0.35} />
        <Edges color="#3ddc97" />
      </mesh>
      <Html position={[0, -1.6, 0.9]} center>
        <div className="atlas-html-label">
          MLP · {model.hiddenSize}→{model.intermediateSize}→{model.hiddenSize} · {model.hiddenAct}
        </div>
      </Html>

      {/* Residual arc hint */}
      <mesh position={[-4.6, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[2.4, 0.04, 8, 48, Math.PI]} />
        <meshStandardMaterial color="#4da3ff" emissive="#2b7fff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function ModelStack({ model }: { model: ModelArchitecture }) {
  const enteredBlock = useAtlasStore((s) => s.enteredBlock);
  const selected = useAtlasStore((s) => s.selected);
  const selectedHead = useAtlasStore((s) => s.selectedHead);
  const select = useAtlasStore((s) => s.select);
  const enterBlock = useAtlasStore((s) => s.enterBlock);
  const setSelectedHead = useAtlasStore((s) => s.setSelectedHead);

  const layers = model.numLayers;
  const spacing = 36 / Math.max(layers - 1, 1);

  const selectedLayer =
    selected?.layer ??
    (selected?.id?.startsWith("block-")
      ? Number(selected.id.replace("block-", ""))
      : null);

  const embedZ = -18 - spacing;
  const headZ = 18 + spacing;

  return (
    <group>
      {/* Embedding */}
      <mesh
        position={[0, 0, embedZ]}
        onClick={(e) => {
          e.stopPropagation();
          select({
            kind: "embedding",
            id: "embed",
            label: `Token embedding · d=${model.hiddenSize}`,
          });
        }}
      >
        <boxGeometry args={[7.2, 1.4, 0.7]} />
        <meshStandardMaterial
          color={selected?.kind === "embedding" ? "#4da3ff" : "#162033"}
          emissive="#2b7fff"
          emissiveIntensity={selected?.kind === "embedding" ? 0.5 : 0.15}
        />
        <Edges color="#6ba3e0" />
      </mesh>
      <Html position={[0, 1.3, embedZ]} center>
        <div className="atlas-html-banner">Embeddings · vocab {model.vocabSize}</div>
      </Html>

      {Array.from({ length: layers }).map((_, i) => {
        const z = -18 + i * spacing;
        return (
          <BlockMesh
            key={i}
            layer={i}
            z={z}
            selected={selectedLayer === i}
            entered={enteredBlock === i}
            onSelect={() =>
              select({
                kind: "block",
                id: `block-${i}`,
                layer: i,
                label: `Transformer block L${i}`,
              })
            }
            onEnter={() => enterBlock(i)}
          />
        );
      })}

      {/* LM head */}
      <mesh
        position={[0, 0, headZ]}
        onClick={(e) => {
          e.stopPropagation();
          select({
            kind: "lm_head",
            id: "lm_head",
            label: `LM head · vocab ${model.vocabSize}`,
          });
        }}
      >
        <boxGeometry args={[7.2, 1.4, 0.7]} />
        <meshStandardMaterial
          color={selected?.kind === "lm_head" ? "#ff6b4a" : "#241818"}
          emissive="#ff6b4a"
          emissiveIntensity={selected?.kind === "lm_head" ? 0.45 : 0.12}
        />
        <Edges color="#ff8f75" />
      </mesh>
      <Html position={[0, 1.3, headZ]} center>
        <div className="atlas-html-banner">LM head / final norm</div>
      </Html>

      <FlowPulse active={enteredBlock === null} />

      {enteredBlock !== null && (
        <ExpandedBlock
          model={model}
          layer={enteredBlock}
          selectedHead={selectedHead}
          onHead={(h) => {
            setSelectedHead(h);
            select({
              kind: "attn_head",
              id: `L${enteredBlock}.attn.h${h}`,
              layer: enteredBlock,
              label: `L${enteredBlock} attention head ${h}`,
            });
          }}
        />
      )}
    </group>
  );
}

export function ModelScene({ model }: { model: ModelArchitecture }) {
  const cameraResetKey = useAtlasStore((s) => s.cameraResetKey);
  const ready = model.status === "verified_config" && model.numLayers > 0;

  const fog = useMemo(() => new THREE.Fog("#07090d", 25, 70), []);

  if (!ready) {
    return (
      <div className="atlas-empty">
        <p>This checkpoint is listed as a candidate only.</p>
        <p className="atlas-muted">
          Select Qwen3-8B to explore a verified architecture configuration.
        </p>
      </div>
    );
  }

  return (
    <Canvas
      className="atlas-canvas"
      camera={{ position: [0, 8, 28], fov: 42, near: 0.1, far: 200 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ scene }) => {
        scene.fog = fog;
        scene.background = new THREE.Color("#07090d");
      }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[12, 18, 10]} intensity={1.1} />
      <directionalLight position={[-10, 6, -8]} intensity={0.35} color="#3ddc97" />
      <pointLight position={[0, 6, 0]} intensity={0.4} color="#4da3ff" />
      <ModelStack model={model} />
      <gridHelper args={[80, 40, "#1a2433", "#121821"]} position={[0, -3.2, 0]} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={8}
        maxDistance={60}
        target={[0, 0, 0]}
      />
      <CameraReset resetKey={cameraResetKey} />
    </Canvas>
  );
}
