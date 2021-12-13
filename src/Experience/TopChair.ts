import * as THREE from 'three';
import Experience from './Experience';
import Resources from './Resources';
import World from './World';
import { Time } from './Utils';

export default class TopChair {
    experience: Experience;
    resources: Resources;
    debug: boolean;
    scene: THREE.Scene;
    world: World;
    time: Time;
    model: any;
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;
        this.scene = this.experience.scene;
        this.world = this.experience.world;
        this.time = this.experience.time;
    }

    setModel() {
        this.model = {};
        this.model.group = this.resources.items.topChairModel.scene.children[0];
        this.scene.add(this.model.group);

        this.model.group.traverse((_child: any) => {
            if (_child instanceof THREE.Mesh) {
                _child.material = this.world.baked.model.material;
            }
        });
    }
}
