import * as THREE from 'three';
import EventEmitter from './Utils/EventEmitter';
import Loader from './Utils/Loader';

interface GroupsParams {
    assets: any[];
    loaded: any[];
    current: Item;
}
interface Item {
    [key: string]: any;
}

/**
 * 资源管理器
 */
export default class Resources extends EventEmitter {
    groups: GroupsParams;
    loader: Loader;
    items!: Item;
    constructor(_assets: any[]) {
        super();
        this.items = {};
        this.loader = new Loader();
        this.groups = {
            assets: [],
            loaded: [],
            current: {},
        };
        this.groups.assets = [..._assets];

        this.loadNextGroup();

        this.loader.on('fileEnd', (_resource: any, _data: HTMLImageElement) => {
            let data: any = _data;

            // Convert to texture
            if (_resource.type === 'texture') {
                if (!(_data instanceof THREE.Texture)) {
                    data = new THREE.Texture(_data);
                }
                data && (data.needsUpdate = true);
            }
            this.items[_resource.name] = data;
            // Progress and event
            this.groups.current.loaded++;
            this.emit('progress', [this.groups.current, _resource, data]);
        });

        // Loader all end event
        this.loader.on('end', () => {
            this.groups.loaded.push(this.groups.current);
            // Trigger
            this.emit('groupEnd', [this.groups.current]);

            if (this.groups.assets.length > 0) {
                this.loadNextGroup();
            } else {
                this.emit('end');
            }
        });
    }
    loadNextGroup() {
        this.groups.current = this.groups.assets.shift();
        this.groups.current.toLoad = this.groups.current.items.length;
        this.groups.current.loaded = 0;

        this.loader.load(this.groups.current.items);
    }
}
