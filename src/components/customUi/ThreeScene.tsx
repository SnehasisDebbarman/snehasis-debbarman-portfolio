import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const scene = new THREE.Scene();
            //render camera
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();

            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            camera.position.z = 5;
            // render geometry
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            // scene.add(cube);

            renderer.render(scene, camera);

        }
    }, []);
    return <div className="w-[400px] size-[400px] border border-white" ref={containerRef} />;
};
export default ThreeScene;
