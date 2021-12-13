import * as THREE from 'three';
import Time from './Utils/Time';
import Sizes from './Utils/Sizes';
import Stats from './Utils/Stats';
import Camera from './Camera';
import Renderer from './Renderer';
import Resources from './Resources';
import World from './World';
import Navigation from './Navigation';

import assets from './assets';

interface options {
    targetElement: HTMLElement | null;
}

export interface Config {
    pixelRatio?: number; // 像素比
    width?: number;
    height?: number;
    smallestSide?: number;
    largestSide?: number;
    debug?: boolean;
}

export interface ExperienceParams {
    targetElement: HTMLElement | null;
    time: Time;
    sizes: Sizes;
    config: Config;
    stats: Stats;
    scene: THREE.Scene; //场景对象
    camera: Camera; // 相机
    renderer: Renderer; // 渲染器
}
export default class Experience {
    static instance: any;
    debug!: boolean;
    targetElement: HTMLElement | null = null;
    time!: Time;
    sizes!: Sizes;
    config!: Config;
    stats!: Stats;
    scene!: THREE.Scene; //场景对象
    camera!: Camera; // 相机
    renderer!: Renderer; // 渲染器
    resources!: Resources;
    world!: World;
    navigation!: Navigation;
    constructor(_options?: options) {
        // 单例
        if (Experience.instance) {
            return Experience.instance;
        }

        Experience.instance = this;
        this.targetElement = _options?.targetElement || null;
        if (!this.targetElement) {
            console.warn("Missing 'targetElement' property");
            return;
        }

        this.time = new Time();
        this.sizes = new Sizes();
        this.setConfig();
        this.setStats();
        this.setScene();
        this.setCamera();
        this.setRenderer();
        this.setResources();
        this.setWorld();
        this.setNavigation();

        this.sizes.on('resize', () => {
            this.resize();
        });
    }
    // 设置基础配置
    setConfig() {
        const boundings = this.targetElement?.getBoundingClientRect();
        this.config = {};
        // 像素比
        this.config.pixelRatio = Math.min(
            Math.max(window.devicePixelRatio, 1),
            2
        );

        // 屏幕宽高
        this.config.width = boundings?.width || 0;
        this.config.height = boundings?.height || window.innerHeight;
        this.config.smallestSide = Math.min(
            this.config.width,
            this.config.height
        );
        this.config.largestSide = Math.max(
            this.config.width,
            this.config.height
        );
    }
    // 设置fps显示
    setStats() {
        if (this.config.debug) {
            this.stats = new Stats(true);
        }
    }

    // setDebug() {
    //     if (this.config.debug) {
    //         this.debug = new Pane
    //     }
    // }
    /**
     * 创建场景对象
     */
    setScene() {
        this.scene = new THREE.Scene();
    }
    /**
     * 创建相机
     */
    setCamera() {
        this.camera = new Camera();
    }

    /**
     * 创建渲染器
     */
    setRenderer() {
        this.renderer = new Renderer();
        this.targetElement &&
            this.targetElement.appendChild(this.renderer.instance.domElement);
    }
    /**
     * 加载资源
     */
    setResources() {
        this.resources = new Resources(assets);
    }

    setWorld() {
        this.world = new World();
    }

    setNavigation() {
        this.navigation = new Navigation();
    }

    resize() {
        const boundings = this.targetElement?.getBoundingClientRect();
        this.config.width = boundings?.width || 0;
        this.config.height = boundings?.height || 0;
        this.config.smallestSide = Math.min(
            this.config.width,
            this.config.height
        );
        this.config.largestSide = Math.max(
            this.config.width,
            this.config.height
        );

        this.config.pixelRatio = Math.min(
            Math.max(window.devicePixelRatio, 1),
            2
        );

        if (this.camera) this.camera.resize();

        if (this.renderer) this.renderer.resize();
    }

    update() {
        this.stats && this.stats.update();

        this.camera.update();

        this.renderer && this.renderer.update();

        this.world && this.world.update();

        window.requestAnimationFrame(() => {
            this.update();
        });
    }
}
