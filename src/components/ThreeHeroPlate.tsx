import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  brandName: string;
}

export const ThreeHeroPlate: React.FC<Props> = ({ brandName }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set up Three.js scene
    const width = currentMount.clientWidth || 360;
    const height = currentMount.clientHeight || 360;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      setHasWebGL(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // Group for entire interactive assembly
    const plateGroup = new THREE.Group();
    scene.add(plateGroup);

    // 1. Outer Heavy Bumper Rim (Dark Matte Cast Metal)
    const plateGeometry = new THREE.CylinderGeometry(1.9, 1.9, 0.38, 64);
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0x1d1d1b,
      roughness: 0.65,
      metalness: 0.35,
    });
    const mainPlate = new THREE.Mesh(plateGeometry, plateMaterial);
    mainPlate.rotation.x = Math.PI / 2;
    plateGroup.add(mainPlate);

    // 2. Inner Recessed Hub Rim (Stepped profile)
    const innerRimGeo = new THREE.TorusGeometry(1.2, 0.1, 16, 64);
    const innerRimMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a28,
      roughness: 0.5,
      metalness: 0.5,
    });
    const innerRim = new THREE.Mesh(innerRimGeo, innerRimMat);
    innerRim.position.z = 0.19;
    plateGroup.add(innerRim);

    const innerRimBack = innerRim.clone();
    innerRimBack.position.z = -0.19;
    plateGroup.add(innerRimBack);

    // 3. Center Stainless Steel Hub Collar (50mm Olympic Sleeve Bushing)
    const hubGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.42, 32);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0xd8d8d4,
      metalness: 0.85,
      roughness: 0.2,
    });
    const centerHub = new THREE.Mesh(hubGeo, hubMat);
    centerHub.rotation.x = Math.PI / 2;
    plateGroup.add(centerHub);

    // 4. Center Hole (Pass-through for Olympic Bar)
    const holeGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.45, 32);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x0f0f0e });
    const centerHole = new THREE.Mesh(holeGeo, holeMat);
    centerHole.rotation.x = Math.PI / 2;
    plateGroup.add(centerHole);

    // 5. Acid Lime Accent Lip Ring (Thin competition color stripe)
    const limeAccentGeo = new THREE.TorusGeometry(1.85, 0.025, 16, 64);
    const limeAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd0f05a, // Acid Lime Accent
      roughness: 0.25,
      metalness: 0.2,
      emissive: 0x4a5814,
      emissiveIntensity: 0.4
    });
    const limeRingFront = new THREE.Mesh(limeAccentGeo, limeAccentMat);
    limeRingFront.position.z = 0.19;
    plateGroup.add(limeRingFront);

    const limeRingBack = limeRingFront.clone();
    limeRingBack.position.z = -0.19;
    plateGroup.add(limeRingBack);

    // Lighting Setup
    // Key Light (Warm soft directional from top-left)
    const keyLight = new THREE.DirectionalLight(0xfff7ea, 2.8);
    keyLight.position.set(-3, 4, 4);
    scene.add(keyLight);

    // Rim Light (Acid Lime glow from bottom-right)
    const rimLight = new THREE.DirectionalLight(0xd0f05a, 2.2);
    rimLight.position.set(3, -2, -2);
    scene.add(rimLight);

    // Fill Light
    const fillLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(fillLight);

    // Interactive mouse parallax state
    let targetRotX = 0.2;
    let targetRotY = -0.3;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = mouseX * 0.7;
      targetRotX = -mouseY * 0.7;
    };

    const onMouseEnter = () => { isHovering = true; };
    const onMouseLeave = () => {
      isHovering = false;
      targetRotX = 0.15;
      targetRotY = -0.25;
    };

    currentMount.addEventListener('mousemove', onMouseMove);
    currentMount.addEventListener('mouseenter', onMouseEnter);
    currentMount.addEventListener('mouseleave', onMouseLeave);

    // Resize handler
    const onResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!prefersReducedMotion) {
        // Continuous subtle spin when idle
        if (!isHovering) {
          plateGroup.rotation.z += delta * 0.3;
        }

        // Smooth damping interpolation toward mouse target
        plateGroup.rotation.x += (targetRotX - plateGroup.rotation.x) * 0.08;
        plateGroup.rotation.y += (targetRotY - plateGroup.rotation.y) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      currentMount.removeEventListener('mousemove', onMouseMove);
      currentMount.removeEventListener('mouseenter', onMouseEnter);
      currentMount.removeEventListener('mouseleave', onMouseLeave);
      if (renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      plateGeometry.dispose();
      plateMaterial.dispose();
      hubGeo.dispose();
      hubMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
        title="Interactive 3D Calibrated Plate — Drag to tilt"
      />

      {/* Static Fallback overlay if WebGL disabled */}
      {!hasWebGL && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#20201E] rounded-2xl text-[#F5F1E8] p-6 text-center">
          <div className="w-48 h-48 rounded-full border-8 border-[#D0F05A] flex items-center justify-center bg-[#141413]">
            <div className="text-center font-display uppercase tracking-wider text-xl font-bold">
              20 KG
              <span className="block text-xs font-sans text-[#BDBBB4] font-normal">CALIBRATED</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-mono text-[#BDBBB4]">OLYMPIC SPECIFICATION STEEL</p>
        </div>
      )}

      {/* Restrained Athletic Plate Label Floating Badge */}
      <div className="absolute bottom-2 left-4 sm:left-6 flex items-center gap-3 text-xs font-mono text-[#20201E]/70 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#D0F05A] border border-[#20201E]" />
        <span>3D CALIBRATED SPEC</span>
        <span aria-hidden="true">·</span>
        <span>20KG OLYMPIC STEEL</span>
        <span aria-hidden="true">·</span>
        <span className="text-[10px] text-[#20201E]/50">INTERACTIVE TILT</span>
      </div>
    </div>
  );
};
