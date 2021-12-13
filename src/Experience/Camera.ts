import * as THREE from 'three';
import Experience from './Experience';
import { Config } from './Experience';
import { Time, Sizes } from './Utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * 相机
 */
export default class Camera {
    experience: Experience;
    config: Config;
    debug: boolean;
    time: Time;
    sizes: Sizes;
    targetElement: HTMLElement | null;
    scene: THREE.Scene;
    mode: 'default' | 'debug';
    instance!: THREE.PerspectiveCamera;
    modes!: {
        default: {
            instance: THREE.PerspectiveCamera;
        };
        debug: {
            instance: THREE.PerspectiveCamera;
        };
    };
    constructor() {
        this.experience = new Experience();
        this.config = this.experience.config;
        this.debug = this.experience.debug;
        this.time = this.experience.time;
        this.sizes = this.experience.sizes;
        this.targetElement = this.experience.targetElement;
        this.scene = this.experience.scene;

        this.mode = 'default';

        this.setInstance();
    }

    /**
     * 设置透视相机视角
     */
    setInstance() {
        // 建立相机
        this.instance = new THREE.PerspectiveCamera(
            20,
            (this.config?.width || 0) / (this.config?.height || 0),
            0.1,
            150
        );
        this.instance.rotation.reorder('YXZ');

        // 向场景中添加此相机
        this.scene.add(this.instance);
    }

    // setModes() {
    //     this.modes = {

    //     }
    // }

    resize() {
        this.instance.aspect =
            (this.config?.width || 0) / (this.config?.height || 0);
        this.instance.updateProjectionMatrix(); // 手动更新相机的投影矩阵

        // this.modes.default.instance.aspect =
        //     this.config.width / this.config.height;
        // this.modes.default.instance.updateProjectionMatrix();

        // this.modes.debug.instance.aspect =
        //     this.config.width / this.config.height;
        // this.modes.debug.instance.updateProjectionMatrix();
    }

    update() {
        // Update debug orbit controls
        // this.modes.debug.orbitControls.update()

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position);
        this.instance.quaternion.copy(
            this.modes[this.mode].instance.quaternion
        );
        this.instance.updateMatrixWorld(); // To be used in projection
    }
}
