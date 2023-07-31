import { exit } from 'process';
import React, { useState, useEffect, useRef } from 'react';
// import Canvas from './Canvas';
import './game.css'


const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rectPosition, setRectPosition] = useState<{ x: number; y: number }>({ x: 20, y:  0});
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 800, height: 500 });
  const rectWidth = 5;
  const rectHeight = 50;
  const [divSize, setDivSize] = useState<{width: number; height: number}>({width:0, height: 0})
  useEffect(() => {
    const divID = "Game"
    const divElement = document.getElementById(divID);
    const divWidth = divElement!.offsetWidth; // Largeur de la div en pixels
    const divHeight = divElement!.offsetHeight; // Hauteur de la div en pixels
    setDivSize({width: divWidth, height: divHeight});
    setRectPosition({x:20, y: divHeight / 2});
  
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = canvas?.parentElement;
      
      if (container) {
        setCanvasSize({ width: container.clientWidth, height: container.clientHeight});
      }
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas?.getBoundingClientRect();
      // const mouseX = event.clientX - rect!.left;
      const mouseY = event.clientY - rect!.top;
      console.log(mouseY);
      setRectPosition({x:20, y: mouseY});
    };

    canvas?.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const animate = () => {
      if (rectPosition.x + rectWidth / 2 < 0 || rectPosition.x + rectWidth / 2 > divSize.height)
        ctx!.fillStyle = 'white';
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx?.fillRect(rectPosition.x - rectWidth / 2, rectPosition.y - rectHeight / 2, rectWidth, rectHeight);
      requestAnimationFrame(animate);
    };

    animate();
  }, [rectPosition]);

  return (
    <div className='Game' id='Game'>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height}
              style={{ display: 'block',
              backgroundImage: 'url(https://i.postimg.cc/nhXKQ73Z/background-v1.png)',
              // backgroundColor: "black",
              border: "2px solid black",
              }} />
    </div>
  );
};

export default Canvas;