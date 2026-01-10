'use client'

import { useMemo, useEffect } from 'react'
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial, useTrailTexture } from '@react-three/drei'
import { useTheme } from 'next-themes'
import * as THREE from 'three'

const DotMaterial = shaderMaterial(
    {
        time: 0,
        resolution: new THREE.Vector2(),
        dotColor: new THREE.Color('#FFFFFF'),
        bgColor: new THREE.Color('#121212'),
        mouseTrail: null,
        render: 0,
        rotation: 0,
        gridSize: 50,
        dotOpacity: 0.05
    },
  /* glsl */ `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    uniform float time;
    uniform int render;
    uniform vec2 resolution;
    uniform vec3 dotColor;
    uniform vec3 bgColor;
    uniform sampler2D mouseTrail;
    uniform float rotation;
    uniform float gridSize;
    uniform float dotOpacity;

    vec2 rotate(vec2 uv, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        mat2 rotationMatrix = mat2(c, -s, s, c);
        return rotationMatrix * (uv - 0.5) + 0.5;
    }

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    float sdfCircle(vec2 p, float r) {
        return length(p - 0.5) - r;
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      
      // ANCHOR PATTERN TO TOP CENTER to prevent shift on resize
      // x: centered, y: 0 at top, increasing downwards
      vec2 divSize = resolution.xy;
      vec2 adjustedFrag = vec2(gl_FragCoord.x - divSize.x * 0.5, divSize.y - gl_FragCoord.y);
      vec2 uv = adjustedFrag / divSize.x; // Scale uniform based on width

      vec2 rotatedUv = rotate(uv, rotation);

      // Create a grid
      vec2 gridUv = fract(rotatedUv * gridSize);
      
      // Map grid centers back for effects - this might be tricky with new coords but let's try standard
      // Actually mouseTrail might depend on screen coords? 
      // trail is 0..1. 
      // gridUvCenterInScreenCoords needs to be in 0..1 range matching screenUv if possible?
      // Original: rotate((floor...)/gridSize, -rotation) was essentially 'uv' (0..1 mostly?)
      
      // Let's keep logic simple: if we change 'uv' space, we change the pattern space.
      // mouseTrail looks up via texture2D(mouseTrail, coord). 
      // if coord is not 0..1, it repeats or clamps. 
      // We should probably just use screenUv for mouseLookups to be safe/easy?
      
      // Re-calculate grid center in "Pattern Space"
      vec2 cellId = floor(rotatedUv * gridSize);
      vec2 cellCenterPattern = (cellId + 0.5) / gridSize;
      vec2 cellCenterRotated = rotate(cellCenterPattern, -rotation);
      
      // Convert Pattern Space back to Screen Space (0..1) for Mouse Trail?
      // screenX = (patternX * width) + width/2
      // screenY = height - (patternY * width)
      // then divide by resolution
      
      vec2 cellCenterScreenPixels = vec2(
          cellCenterRotated.x * divSize.x + divSize.x * 0.5,
          divSize.y - (cellCenterRotated.y * divSize.x)
      );
      vec2 gridUvCenterInScreenCoords = cellCenterScreenPixels / divSize;

      // Calculate distance from the center of each cell
      float baseDot = sdfCircle(gridUv, 0.25);

      // Screen mask (using uv.y which is 0 at top)
      float screenMask = 1.0 - smoothstep(0.15, 0.45, uv.y); 
      vec2 centerDisplace = vec2(0.7, 1.1);
      float circleMaskCenter = length(uv - centerDisplace);

      
      float combinedMask = screenMask;
      float circleAnimatedMask = sin(time * 2.0 + circleMaskCenter * 10.0);

      // Mouse trail effect
      float mouseInfluence = texture2D(mouseTrail, gridUvCenterInScreenCoords).r;
      
      float scaleInfluence = max(mouseInfluence * 0.5, circleAnimatedMask * 0.3);

      // Create dots with size gradient (using uv.y: 0 at top = large, >0.25 = small)
      float dotSize = mix(0.22, 0.06, smoothstep(0.02, 0.25, uv.y));

      float sdfDot = sdfCircle(gridUv, dotSize * (1.0 + scaleInfluence * 0.5));

      float smoothDot = smoothstep(0.05, 0.0, sdfDot);

      float opacityInfluence = max(mouseInfluence * 10.0, circleAnimatedMask * 0.5);

      // Mix background color with dot color, using animated opacity to increase visibility
      vec3 composition = mix(bgColor, dotColor, smoothDot * combinedMask * dotOpacity * (1.0 + opacityInfluence));

      gl_FragColor = vec4(composition, 1.0);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
)

function Scene() {
    const size = useThree((s) => s.size)
    const viewport = useThree((s) => s.viewport)
    const { theme } = useTheme()

    const rotation = 60
    const gridSize = 40

    const getThemeColors = () => {
        switch (theme) {
            case 'dark':
                return {
                    dotColor: '#ff8080', // Light Red
                    bgColor: '#0a0a0a', // Dark background
                    dotOpacity: 0.2 // slightly increased for visibility against dark
                }
            case 'light':
                return {
                    dotColor: '#ff8080', // Light Red
                    bgColor: '#ffffff', // Light background
                    dotOpacity: 0.15
                }
            default:
                // System preference default, assume specific logic or fallback
                return {
                    dotColor: '#ff8080',
                    bgColor: '#ffffff',
                    dotOpacity: 0.15
                }
        }
    }

    const themeColors = getThemeColors()

    const [trail, onMove] = useTrailTexture({
        size: 512,
        radius: 0.1,
        maxAge: 400,
        interpolate: 1,
        ease: function easeInOutCirc(x) {
            return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
        }
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const dotMaterial = useMemo(() => new DotMaterial(), [])

    useEffect(() => {
        dotMaterial.uniforms.dotColor.value.setHex(themeColors.dotColor.replace('#', '0x'))
        dotMaterial.uniforms.bgColor.value.setHex(themeColors.bgColor.replace('#', '0x'))
        dotMaterial.uniforms.dotOpacity.value = themeColors.dotOpacity
    }, [theme, dotMaterial, themeColors])

    useFrame((state) => {
        dotMaterial.uniforms.time.value = state.clock.elapsedTime
    })

    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        onMove(e)
    }

    const scale = Math.max(viewport.width, viewport.height) / 2

    return (
        <mesh scale={[scale, scale, 1]} onPointerMove={handlePointerMove}>
            <planeGeometry args={[2, 2]} />
            <primitive
                object={dotMaterial}
                resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
                rotation={rotation}
                gridSize={gridSize}
                mouseTrail={trail}
                render={0}
            />
        </mesh>
    )
}

export const DotScreenShader = () => {
    return (
        <Canvas
            gl={{
                antialias: true,
                powerPreference: 'high-performance',
                outputColorSpace: THREE.SRGBColorSpace,
                toneMapping: THREE.NoToneMapping
            }}>
            <Scene />
        </Canvas>
    )
}
