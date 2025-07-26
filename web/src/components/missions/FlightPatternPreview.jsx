// client/src/components/missions/FlightPatternPreview.jsx
import { useEffect, useRef } from 'react';

const FlightPatternPreview = ({ flightPattern, surveyArea }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !flightPattern) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Set canvas background
    ctx.fillStyle = '#f3f4f6'; // Light gray background
    ctx.fillRect(0, 0, width, height);

    // Draw border of the survey area
    const padding = 30;
    const drawWidth = width - (padding * 2);
    const drawHeight = height - (padding * 2);

    // Draw a polygon area
    ctx.strokeStyle = '#4f46e5'; // Indigo border
    ctx.lineWidth = 3;
    ctx.beginPath();

    // If we have actual survey area coordinates, use them
    if (surveyArea && surveyArea.coordinates && surveyArea.coordinates[0]) {
      // Normalize coordinates to fit the canvas
      const coords = surveyArea.coordinates[0];
      
      // Find min/max bounds
      let minX = coords[0][0];
      let maxX = coords[0][0];
      let minY = coords[0][1];
      let maxY = coords[0][1];
      
      for (const coord of coords) {
        minX = Math.min(minX, coord[0]);
        maxX = Math.max(maxX, coord[0]);
        minY = Math.min(minY, coord[1]);
        maxY = Math.max(maxY, coord[1]);
      }
      
      // Scale factors
      const scaleX = drawWidth / (maxX - minX);
      const scaleY = drawHeight / (maxY - minY);
      
      // Draw polygon using actual coordinates
      ctx.beginPath();
      coords.forEach((coord, index) => {
        const x = padding + ((coord[0] - minX) * scaleX);
        const y = padding + ((coord[1] - minY) * scaleY);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.stroke();
      
      // Fill with semi-transparent color
      ctx.fillStyle = 'rgba(79, 70, 229, 0.1)'; // Light indigo fill
      ctx.fill();
      
      // Now draw the flight pattern based on the selected type
      ctx.strokeStyle = '#ef4444'; // Red lines for flight path
      ctx.lineWidth = 2;
      
      if (flightPattern === 'grid') {
        // Draw grid pattern
        const spacing = Math.min(drawWidth, drawHeight) / 10;
        
        ctx.beginPath();
        // Horizontal lines
        for (let y = padding; y <= height - padding; y += spacing) {
          // Alternate direction for each line (lawnmower pattern)
          if (Math.floor((y - padding) / spacing) % 2 === 0) {
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
          } else {
            ctx.moveTo(width - padding, y);
            ctx.lineTo(padding, y);
          }
        }
        ctx.stroke();
        
      } else if (flightPattern === 'crosshatch') {
        // Draw crosshatch pattern
        const spacing = Math.min(drawWidth, drawHeight) / 10;
        
        ctx.beginPath();
        // Horizontal lines
        for (let y = padding; y <= height - padding; y += spacing * 2) {
          ctx.moveTo(padding, y);
          ctx.lineTo(width - padding, y);
        }
        
        // Vertical lines
        for (let x = padding; x <= width - padding; x += spacing * 2) {
          ctx.moveTo(x, padding);
          ctx.lineTo(x, height - padding);
        }
        ctx.stroke();
        
      } else if (flightPattern === 'perimeter') {
        // Draw perimeter pattern with spiral inward
        ctx.beginPath();
        
        // Start with the outer polygon
        coords.forEach((coord, index) => {
          const x = padding + ((coord[0] - minX) * scaleX);
          const y = padding + ((coord[1] - minY) * scaleY);
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        // Close the outer path
        ctx.closePath();
        ctx.stroke();
        
        // Draw a few inner spirals
        for (let i = 1; i <= 3; i++) {
          const scaleFactor = 1 - (i * 0.2);
          
          ctx.beginPath();
          coords.forEach((coord, index) => {
            // Calculate center point
            const centerX = padding + ((maxX + minX) / 2 - minX) * scaleX;
            const centerY = padding + ((maxY + minY) / 2 - minY) * scaleY;
            
            // Scale coordinates toward center
            const x = centerX + (padding + ((coord[0] - minX) * scaleX) - centerX) * scaleFactor;
            const y = centerY + (padding + ((coord[1] - minY) * scaleY) - centerY) * scaleFactor;
            
            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.closePath();
          ctx.stroke();
        }
      }
      
      // Add drone icon at starting point
      const droneX = padding + ((coords[0][0] - minX) * scaleX);
      const droneY = padding + ((coords[0][1] - minY) * scaleY);
      
      // Draw drone icon
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(droneX, droneY, 5, 0, 2 * Math.PI);
      ctx.fill();
      
    } else {
      // If no actual coordinates, draw a simple polygon
      const points = [
        [padding, padding],
        [width - padding, padding],
        [width - padding, height - padding],
        [padding + 40, height - padding],
        [padding, padding + 40]
      ];
      
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });
      ctx.closePath();
      ctx.stroke();
      
      // Fill with semi-transparent color
      ctx.fillStyle = 'rgba(79, 70, 229, 0.1)'; // Light indigo fill
      ctx.fill();
      
      // Draw the flight pattern based on the selected type
      ctx.strokeStyle = '#ef4444'; // Red lines for flight path
      ctx.lineWidth = 2;
      
      if (flightPattern === 'grid') {
        // Draw grid pattern
        const spacing = Math.min(drawWidth, drawHeight) / 10;
        
        ctx.beginPath();
        // Horizontal lines
        for (let y = padding; y <= height - padding; y += spacing) {
          // Alternate direction for each line (lawnmower pattern)
          if (Math.floor((y - padding) / spacing) % 2 === 0) {
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
          } else {
            ctx.moveTo(width - padding, y);
            ctx.lineTo(padding, y);
          }
        }
        ctx.stroke();
        
      } else if (flightPattern === 'crosshatch') {
        // Draw crosshatch pattern
        const spacing = Math.min(drawWidth, drawHeight) / 10;
        
        ctx.beginPath();
        // Horizontal lines
        for (let y = padding; y <= height - padding; y += spacing * 2) {
          ctx.moveTo(padding, y);
          ctx.lineTo(width - padding, y);
        }
        
        // Vertical lines
        for (let x = padding; x <= width - padding; x += spacing * 2) {
          ctx.moveTo(x, padding);
          ctx.lineTo(x, height - padding);
        }
        ctx.stroke();
        
      } else if (flightPattern === 'perimeter') {
        // Draw perimeter pattern with spiral inward
        ctx.beginPath();
        
        // Start with the outer polygon
        points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point[0], point[1]);
          } else {
            ctx.lineTo(point[0], point[1]);
          }
        });
        
        // Close the outer path
        ctx.closePath();
        ctx.stroke();
        
        // Draw a few inner spirals
        for (let i = 1; i <= 3; i++) {
          const scaleFactor = 1 - (i * 0.2);
          const centerX = width / 2;
          const centerY = height / 2;
          
          ctx.beginPath();
          points.forEach((point, index) => {
            // Scale coordinates toward center
            const x = centerX + (point[0] - centerX) * scaleFactor;
            const y = centerY + (point[1] - centerY) * scaleFactor;
            
            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.closePath();
          ctx.stroke();
        }
      }
      
      // Add drone icon at starting point
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(points[0][0], points[0][1], 5, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Add legend
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText(`Flight Pattern: ${flightPattern}`, padding, height - 10);
    
    // Draw drone path legend
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(padding + 150, height - 15, 15, 3);
    ctx.fillStyle = '#000000';
    ctx.fillText('Drone Path', padding + 170, height - 10);
    
    // Draw survey area legend
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(padding + 250, height - 15, 15, 3);
    ctx.fillStyle = '#000000';
    ctx.fillText('Survey Area', padding + 270, height - 10);
    
  }, [flightPattern, surveyArea]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={300} 
        className="border border-gray-200 rounded-lg shadow-inner"
      />
    </div>
  );
};

export default FlightPatternPreview;