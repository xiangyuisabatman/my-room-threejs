import * as THREE from 'three';
import Experience from './Experience';
import { Config } from './Experience';
import Camera from './Camera';
import { Time, Stats, Sizes } from './Utils';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

/**
 * 渲染器
 */
export default class Renderer {
    experience: Experience;
    config: Config;
    debug: boolean;
    stats: Stats;
    time: Time;
    sizes: Sizes;
    scene: THREE.Scene;
    camera: Camera;
    usePostprocess: boolean;
    clearColor: string = '#010101';

    instance!: THREE.WebGLRenderer;
    context!: WebGLRenderingContext;
    constructor() {
        this.experience = new Experience();
        this.config = this.experience.config;
        this.debug = this.experience.debug;
        this.stats = this.experience.stats;
        this.time = this.experience.time;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;

        this.usePostprocess = false;

        this.setInstance();
    }

    setInstance() {
        // 渲染器对象
        this.instance = new THREE.WebGLRenderer({
            alpha: false, // 是否可以设置背景色透明
            antialias: true, // 是否开启反锯齿，对图像边缘进行柔化处理，使图像边缘看起来更平滑，更接近实物的物体。
        });

        this.instance.domElement.style.position = 'absolute';
        this.instance.domElement.style.top = '0';
        this.instance.domElement.style.left = '0';
        this.instance.domElement.style.width = '100%';
        this.instance.domElement.style.height = '100%';

        this.instance.setClearColor(this.clearColor, 1); // 设置背景色
        this.instance.setSize(
            this.config?.width || 0,
            this.config?.height || 0
        );
        this.instance.setPixelRatio(this.config?.pixelRatio || 1);

        this.instance.outputEncoding = THREE.sRGBEncoding; // 贴图编码格式 sRGBEncoding是以人类感知为准的

        this.context = this.instance.getContext();

        if (this.stats) {
            this.stats.setRenderPanel(this.context);
        }
    }

    setPostProcess() {}

    resize() {
        this.instance.setSize(
            this.config?.width || 0,
            this.config?.height || 0
        );
        this.instance.setPixelRatio(this.config?.pixelRatio || 1);
    }

    update() {
        if (this.stats) {
            this.stats.beforeRender();
        }

        // if(this.usePostprocess)
        // {
        //     this.postProcess.composer.render()
        // }
        else {
            this.instance.render(this.scene, this.camera.instance);
        }

        if (this.stats) {
            this.stats.afterRender();
        }
    }
}
