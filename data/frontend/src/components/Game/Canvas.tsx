import React, { useEffect, useRef } from 'react';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    let x = 50; // Position horizontale du rectangle
    let y = 50; // Position verticale du rectangle
    let dx = 2; // Variation horizontale de la position
    let dy = 2; // Variation verticale de la position
    const width = 100; // Largeur du rectangle
    const height = 50; // Hauteur du rectangle

    const animate = () => {
      // Efface le contenu précédent du canvas
      ctx?.clearRect(0, 0, canvas!.width, canvas!.height);

      // Dessine le rectangle à sa position actuelle
      ctx?.fillRect(x, y, width, height);

      // Met à jour les coordonnées x et y pour le prochain frame
      x += dx;
      y += dy;

      // Inverse la direction si le rectangle atteint les bords du canvas
      if (x + width > canvas!.width || x < 0) {
        dx = -dx;
      }
      if (y + height > canvas!.height || y < 0) {
        dy = -dy;
      }

      // Demande une nouvelle frame d'animation
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} width={400} height={200} />;
};

export default Canvas;
