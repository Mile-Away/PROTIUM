import { useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const StarUniverse: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  // const canvasContainer = useRef(null);
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls;

  const canvasContainer = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    init(node);
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function init(ref: HTMLDivElement) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const { innerWidth, innerHeight } = window;
    camera = new THREE.PerspectiveCamera(
      60,
      innerWidth / innerHeight,
      1,
      10000,
    );
    camera.position.set(0, 4, 45);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(innerWidth, innerHeight);
    // 将渲染器的canvas元素添加到容器中
    ref?.appendChild(renderer.domElement);
    // renderer.render(scene, camera);

    // 创建控制器
    controls = new OrbitControls(camera, renderer.domElement);
    // 开启阻尼效果
    controls.enableDamping = true;
    controls.enableZoom = true;
    // 禁用面板
    controls.enabled = true;
    // 创建全局uniform
    const gu = {
      time: { value: 0 },
    };
    // 创建点的大小数组和移动数组
    const sizes: number[] = [];
    const shift: number[] = [];

    // 创建移动函数
    const pushShift = () => {
      shift.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
        (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
        Math.random() * 0.9 + 0.1,
      );
    };

    // 创建点的顶点数组（中间的球体）
    // 创建一个长度为5万的数组pts并y用Array.prototype.map()方法遍历数组并对每个元素进行操作
    const pts = new Array(20000).fill(null).map(() => {
      // 每次遍历中，会向sizes数组中添加一个随机大小
      sizes.push(Math.random() * 1.5 + 0.5);
      // 调用pushShift()函数添加位置信息，并返回一个随机方向的THREE.Vector对象
      pushShift();
      return new THREE.Vector3()
        .randomDirection()
        .multiplyScalar(Math.random() * 0.5 + 9.5);
      //
    });

    // 添加更多的点（旁边围绕的）
    // 先循环生成十万个点
    // 每次循环中生成一个随机数rand，再生成一个随机半径radius
    for (let i = 0; i < 30000; i++) {
      const r = 10;
      const R = 40;
      const rand = Math.random() ** 1.5;
      const radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
      // 使用new THREE.Vector3().setFromCylindricalCoords()生成一个点。
      pts.push(
        new THREE.Vector3().setFromCylindricalCoords(
          radius,
          Math.random() * 2 * Math.PI,
          (Math.random() - 0.5) * 2,
        ),
      );
      sizes.push(Math.random() * 1.5 + 0.5);
      pushShift();
    }
    // 生成一个点g，同时将点的大小和位置信息添加到sizes和shift数组中
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    // 创建了一个缓冲几何体并设置sizes和shift属性
    // 注意这里的F要大写Float32BufferAttribute
    g.setAttribute('sizes', new THREE.Float32BufferAttribute(sizes, 1));
    g.setAttribute('shift', new THREE.Float32BufferAttribute(shift, 4));
    // 创建点材质
    const m = new THREE.PointsMaterial({
      // 表示点的大小
      size: 0.125,
      // 设置材质为透明
      transparent: true,
      // 表示禁用深度测试，使点可以叠加
      depthTest: false,
      // 使用假发混合模式
      blending: THREE.AdditiveBlending,
      // 在材质编译之前修改颜色器，在这里，它用来替换顶点着色器和片元着色器，添加uniform
      // 和attribute，以鸡自定义颜色和移动
    });
    m.onBeforeCompile = (shader: any) => {
      shader.uniforms.time = gu.time;
      // 首先，它为着色器设置了一个uniform变量time，该变量是在点材质中定义的，用来追踪时间
      // 然后它定义了两个attribute变量sizes和shift，这两个变量是在缓冲几何体中定义的，用来控制点的大小和移动
      // 最后使用replace方法来替换顶点着色器中的代码
      shader.vertexShader = `
                uniform float time;
                attribute float sizes;
                attribute vec4 shift;
                varying vec3 vColor;
                ${shader.vertexShader}
                `
        // 注意上面的 ` 不要漏掉了
        // 使用replace来替换着色器中的代码
        // 更新点的大小
        .replace(`gl_PointSize = size;`, `gl_PointSize = size * sizes;`)
        // 更新点的颜色
        .replace(
          `#include <color_vertex>`,
          `#include <color_vertex>
                    float d = length(abs(position)/vec3(40.,10.,40));
                    d=clamp(d,0.,1.);
                    vColor = mix(vec3(227.,155.,0.),vec3(100.,50.,255.),d)/255.;`,
        )
        // 记得加上分号
        // 更新点的移动
        .replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
                    float t = time;
                    float moveT = mod(shift.x + shift.z * t,PI2);
                    float moveS = mod(shift.y + shift.z * t,PI2);
                    transformed += vec3(cos(moveS) * sin(moveT),cos(moveT),sin(moveS)*sin(moveT)) * shift.w;
                    `,
        );
      // 修改片元着色器，用来让点的边缘更加圆滑

      // 首先，定义一个varying变量vColor，这个变量是在顶点着色器中定义的，用来传递点的颜色到片段着色器
      // 然后使用replace方法来替换片段着色器的代码
      shader.fragmentShader = `
          varying vec3 vColor;
          ${shader.fragmentShader}
      `
        .replace(
          `#include <clipping_planes_fragment>`,
          `#include <clipping_planes_fragment>
                    float d = length(gl_PointCoord.xy - 0.5);
                `,
        )
        .replace(
          // 记得加上空格
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, d)/* * 0.5+0.5*/);`,
        );
    };
    // -------------------------------------------------------------
    // 创建点云并将其添加到场景中，并设置渲染循环
    const p = new THREE.Points(g, m);
    // 旋转顺序为"ZYX"
    p.rotation.order = 'ZYX';
    // 旋转角度 0.2
    p.rotation.z = 0.2;
    // 把对象（p）添加到场景（scene）中
    scene.add(p);
    // 创建一个时钟对象clock
    const clock = new THREE.Clock();
    // 渲染循环，每次循环中会更新控制器，更新p的旋转角度，更新时间
    renderer.setAnimationLoop(() => {
      // 更新控制器
      controls.update();
      // 获取时钟对象（clock）的已经流逝的时间（t）并将他乘0.5
      // 先把时钟关了
      const t = clock.getElapsedTime() * 0.5;
      // 将gu.time.value 设置为t*Math.PI
      gu.time.value = t * Math.PI;
      // 将对象（p）的旋转角度y设置为t*0.05
      p.rotation.y = t * 0.05;
      // 渲染场景（scene）和相机（camera）
      renderer.render(scene, camera);
    });
  }

  return <div ref={canvasContainer} className="absolute -z-10" />;
};

export default StarUniverse;
