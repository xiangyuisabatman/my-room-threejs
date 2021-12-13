import * as THREE from 'three';
import Experience, { Config } from './Experience';
import Resources from './Resources';
import Baked from './Baked';
import GoogleLeds from './GoogleLeds';

export default class World {
    experience: Experience;
    config: Config;
    scene: THREE.Scene;
    resources: Resources;
    baked!: Baked;
    googleLeds!: GoogleLeds;

    constructor() {
        this.experience = new Experience();
        this.config = this.experience.config;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resources.on('groupEnd', (_group: any) => {
            if (_group.name === 'base') {
                this.setBaked();
                // this.setGoogleLeds();
            }
        });
    }

    setBaked() {
        this.baked = new Baked();
    }

    setGoogleLeds() {
        this.googleLeds = new GoogleLeds();
    }

    setTopChair() {}

    update() {}
}
