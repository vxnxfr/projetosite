'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBarberScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 26;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Dynamic Lighting (Iluminação Frontal E Traseira)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Luzes Frontais (+Z)
    const goldPointLight = new THREE.PointLight(0xd4af37, 3.5, 80);
    goldPointLight.position.set(12, 12, 16);
    scene.add(goldPointLight);

    const bluePointLight = new THREE.PointLight(0x38bdf8, 2.2, 80);
    bluePointLight.position.set(-14, -10, 14);
    scene.add(bluePointLight);

    const redRimLight = new THREE.PointLight(0xef4444, 2.0, 80);
    redRimLight.position.set(0, -12, 12);
    scene.add(redRimLight);

    // Luzes Traseiras (-Z) para que o verso da moeda/medalhão brilhe com perfeição ao virar de costas
    const backGoldLight = new THREE.PointLight(0xd4af37, 3.5, 80);
    backGoldLight.position.set(-12, 12, -16);
    scene.add(backGoldLight);

    const backBlueLight = new THREE.PointLight(0x38bdf8, 2.2, 80);
    backBlueLight.position.set(14, -10, -14);
    scene.add(backBlueLight);

    const backRedLight = new THREE.PointLight(0xef4444, 2.0, 80);
    backRedLight.position.set(0, 12, -12);
    scene.add(backRedLight);

    // 3. Central 3D Barber Emblem (Aparece TANTO na FRENTE quanto ATRÁS)
    const emblemGroup = new THREE.Group();
    scene.add(emblemGroup);

    // Moldura Externa de Ouro Polido 24k
    const rimGeom = new THREE.TorusGeometry(6.6, 0.28, 32, 120);
    const goldRimMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18,
    });
    const rimMesh = new THREE.Mesh(rimGeom, goldRimMaterial);
    emblemGroup.add(rimMesh);

    // Anel Interno Chanfrado de Ouro - Frontal
    const innerRimGeom = new THREE.TorusGeometry(6.1, 0.12, 24, 100);
    const innerRimMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5d77f,
      metalness: 0.92,
      roughness: 0.22,
    });
    const innerRimMeshFront = new THREE.Mesh(innerRimGeom, innerRimMaterial);
    innerRimMeshFront.position.z = 0.08;
    emblemGroup.add(innerRimMeshFront);

    // Anel Interno Chanfrado de Ouro - Traseiro
    const innerRimMeshBack = new THREE.Mesh(innerRimGeom, innerRimMaterial);
    innerRimMeshBack.position.z = -0.08;
    emblemGroup.add(innerRimMeshBack);

    // Textura da Barbearia para a Face Frontal
    const textureLoader = new THREE.TextureLoader();
    const emblemTextureFront = textureLoader.load('/images/3d-barber-emblem.jpg');
    emblemTextureFront.colorSpace = THREE.SRGBColorSpace;

    // Textura da Barbearia para a Face Traseira
    // Configurada com repetição invertida no eixo horizontal (U) para que,
    // ao rotacionar 180° no eixo Y, a imagem fique 100% na orientação correta (não espelhada)
    const emblemTextureBack = textureLoader.load('/images/3d-barber-emblem.jpg');
    emblemTextureBack.colorSpace = THREE.SRGBColorSpace;
    emblemTextureBack.wrapS = THREE.RepeatWrapping;
    emblemTextureBack.repeat.x = -1;
    emblemTextureBack.offset.x = 1;

    // Geometria dos Discos da Frente e de Trás
    const discGeom = new THREE.CircleGeometry(6.0, 64);

    // 1. FACE FRONTAL (Aparece na frente da moeda)
    const discMaterialFront = new THREE.MeshStandardMaterial({
      map: emblemTextureFront,
      roughness: 0.2,
      metalness: 0.3,
      side: THREE.DoubleSide, // Garante que nunca seja recortada ou fique invisível
    });
    const discMeshFront = new THREE.Mesh(discGeom, discMaterialFront);
    discMeshFront.position.z = 0.09;
    emblemGroup.add(discMeshFront);

    // 2. FACE TRASEIRA (Aparece atrás da moeda ao rolar a tela e girar 180°)
    const discMaterialBack = new THREE.MeshStandardMaterial({
      map: emblemTextureBack,
      roughness: 0.2,
      metalness: 0.3,
      side: THREE.DoubleSide, // DoubleSide para visibilidade absoluta em qualquer ângulo
    });
    const discMeshBack = new THREE.Mesh(discGeom, discMaterialBack);
    discMeshBack.position.z = -0.09;
    discMeshBack.rotation.y = Math.PI; // Vira para as costas do medalhão
    emblemGroup.add(discMeshBack);

    // Corpo Cilíndrico de Metal Obsidiana do Medalhão (Borda / Espessura 3D)
    const cylinderGeom = new THREE.CylinderGeometry(6.05, 6.05, 0.2, 64, 1, true);
    const cylinderMaterial = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      metalness: 0.85,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });
    const cylinderMesh = new THREE.Mesh(cylinderGeom, cylinderMaterial);
    cylinderMesh.rotation.x = Math.PI / 2;
    emblemGroup.add(cylinderMesh);

    // Anel Fino de Órbita Cinética ao Redor do Medalhão
    const orbitRingGeom = new THREE.TorusGeometry(8.2, 0.05, 16, 90);
    const orbitRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeom, orbitRingMaterial);
    emblemGroup.add(orbitRing);

    // 4. Golden Particles & Starry Dust Field (Infinit Papers & Aether style)
    const particleCount = 750;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 75;
      particlePositions[i + 1] = (Math.random() - 0.5) * 75;
      particlePositions[i + 2] = (Math.random() - 0.5) * 55;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.35,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Mouse and Scroll Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let scrollProgress = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      scrollProgress = window.scrollY / maxScroll;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop (60 FPS Smooth Interpolation)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Mouse Parallax Lerp
      targetCameraX = mouseX * 4.0;
      targetCameraY = mouseY * 3.0;
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;

      // Scroll-driven camera dolly & depth shift (Aether model)
      const scrollZ = 26 - scrollProgress * 12;
      camera.position.z += (scrollZ - camera.position.z) * 0.06;

      // 3D Barber Emblem continuous float and scroll-driven rotation
      const scrollRotationMultiplier = scrollProgress * Math.PI * 3;

      // Floating gentle oscillation
      emblemGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.6;
      
      // Dynamic rotation based on time + scroll progress
      // Como a rotação no Y gira 360°, a imagem aparece tanto na FRENTE quanto ATRÁS com nitidez total
      emblemGroup.rotation.y = elapsedTime * 0.25 + scrollRotationMultiplier * 0.8 + mouseX * 0.35;
      emblemGroup.rotation.x = Math.sin(elapsedTime * 0.8) * 0.15 - mouseY * 0.25;
      emblemGroup.rotation.z = Math.cos(elapsedTime * 0.6) * 0.08;

      // Orbit ring independent spin
      orbitRing.rotation.x = elapsedTime * 0.4 + scrollRotationMultiplier;
      orbitRing.rotation.y = -elapsedTime * 0.3;

      // Particle system gentle wave
      particleSystem.rotation.y = elapsedTime * 0.03 + scrollProgress * 1.2;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.1) * 0.08;

      // Moving light sources for specular highlights on both sides of the golden medal
      goldPointLight.position.x = Math.cos(elapsedTime * 0.7) * 16;
      goldPointLight.position.y = Math.sin(elapsedTime * 0.7) * 16;

      bluePointLight.position.x = -Math.cos(elapsedTime * 0.5) * 14;
      bluePointLight.position.z = Math.sin(elapsedTime * 0.5) * 14;

      backGoldLight.position.x = -Math.cos(elapsedTime * 0.7) * 16;
      backGoldLight.position.y = -Math.sin(elapsedTime * 0.7) * 16;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      // Dispose geometries & materials
      rimGeom.dispose();
      innerRimGeom.dispose();
      discGeom.dispose();
      cylinderGeom.dispose();
      orbitRingGeom.dispose();
      goldRimMaterial.dispose();
      innerRimMaterial.dispose();
      discMaterialFront.dispose();
      discMaterialBack.dispose();
      cylinderMaterial.dispose();
      orbitRingMaterial.dispose();
      emblemTextureFront.dispose();
      emblemTextureBack.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90 transition-opacity duration-1000"
      style={{
        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
      }}
    />
  );
}
