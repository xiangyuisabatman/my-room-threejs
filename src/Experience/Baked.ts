import * as THREE from 'three';
import Experience from './Experience';
import Resources from './Resources';
import { Time } from './Utils';

import vertexShader from './shaders/baked/vertex.glsl';
import fragmentShader from './shaders/baked/fragment.glsl';

export default class CoffeeSteam {
    experience: Experience;
    resources: Resources;
    debug: boolean;
    scene: THREE.Scene;
    time: Time;

    model: any;
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;
        this.scene = this.experience.scene;
        this.time = this.experience.time;

        if (this.debug) {
        }

        this.setModel();
    }

    setModel() {
        this.model = {};

        this.model.mesh = this.resources.items.roomModel.scene.children[0];

        this.model.bakedDayTexture = this.resources.items.bakedDayTexture;
        this.model.bakedDayTexture.encoding = THREE.sRGBEncoding;
        this.model.bakedDayTexture.flipY = false;

        this.model.bakedNightTexture = this.resources.items.bakedNightTexture;
        this.model.bakedNightTexture.encoding = THREE.sRGBEncoding;
        this.model.bakedNightTexture.flipY = false;

        this.model.bakedNeutralTexture =
            this.resources.items.bakedNeutralTexture;
        this.model.bakedNeutralTexture.encoding = THREE.sRGBEncoding;
        this.model.bakedNeutralTexture.flipY = false;

        this.model.lightMapTexture = this.resources.items.lightMapTexture;
        this.model.lightMapTexture.flipY = false;

        const colors = {
            tv: '#ff115e',
            desk: '#ff6700',
            pc: '#0082ff',
        };

        this.model.material = new THREE.ShaderMaterial({
            uniforms: {
                uBakedDayTexture: { value: this.model.bakedDayTexture },
                uBakedNightTexture: { value: this.model.bakedNightTexture },
                uBakedNeutralTexture: { value: this.model.bakedNeutralTexture },
                uLightMapTexture: { value: this.model.lightMapTexture },

                uNightMix: { value: 1 },
                uNeutralMix: { value: 0 },

                uLightTvColor: { value: new THREE.Color(colors.tv) },
                uLightTvStrength: { value: 1.47 },

                uLightDeskColor: { value: new THREE.Color(colors.desk) },
                uLightDeskStrength: { value: 1.9 },

                uLightPcColor: { value: new THREE.Color(colors.pc) },
                uLightPcStrength: { value: 1.4 },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        this.model.mesh.traverse((_child: any) => {
            if (_child instanceof THREE.Mesh) {
                _child.material = this.model.material;
            }
        });

        this.scene.add(this.model.mesh);
        console.log(this.scene);

        if (this.debug) {
        }
    }
}
