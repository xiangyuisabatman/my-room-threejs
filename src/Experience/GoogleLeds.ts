import Experience from './Experience';
import Resources from './Resources';
import { Time } from './Utils';
import * as THREE from 'three';

export default class GoogleLeds {
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

        // if (this.debug) {
        //     this.debugFolder = this.debug.addFolder({
        //         title: 'googleleds',
        //         expanded: false
        //     })
        // }

        this.setModel();
    }
    setModel() {
        this.model = {};
        this.model.items = [];
        const colors = ['#196aff', '#ff0000', '#ff5d00', '#7db81b'];

        this.model.texture = this.resources.items.googleHomeLedMaskTexture;
        console.log(this.resources.items);
        const children = [
            ...this.resources.items.googleHomeLedsModel.scene.children,
        ];

        children.sort((_a, _b) => {
            if (_a.name < _b.name) {
                return -1;
            }
            if (_a.name > _b.name) {
                return 1;
            }
            return 0;
        });

        let i = 0;
        for (const _child of children) {
            const item: any = {};
            item.index = i;
            item.color = colors[item.index];
            item.material = new THREE.MeshBasicMaterial({
                color: item.color,
                transparent: true,
                alphaMap: this.model.texture,
            });

            item.mesh = _child;
            item.mesh.material = item.material;
            this.scene.add(item.mesh);
            console.log(this.scene);
            this.model.items.push(item);
        }
    }
}
