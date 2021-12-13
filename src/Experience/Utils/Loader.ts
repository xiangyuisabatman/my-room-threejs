import EventEmitter from './EventEmitter';
import Experience from '../Experience';
import { ExperienceParams } from '../Experience';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader.js';

interface LoaderItem {
    extensions: string[];
    action: Function;
}

interface LoadItem {
    [key: string]: HTMLImageElement;
}

/**
 * 加载器
 */
export default class Resources extends EventEmitter {
    experience: ExperienceParams;
    renderer!: THREE.WebGLRenderer;

    loaders!: LoaderItem[];
    loaded: number;
    toLoad: number;
    items: LoadItem;
    constructor() {
        super();

        this.experience = new Experience();
        this.renderer = this.experience.renderer.instance;

        this.setLoaders();
        this.loaded = 0;
        this.toLoad = 0;
        this.items = {};
    }

    setLoaders() {
        this.loaders = [];

        this.loaders.push({
            extensions: ['jpg', 'png'],
            action: (_resource: any) => {
                const image = new Image();
                image.addEventListener('load', () => {
                    this.fileLoadEnd(_resource, image);
                });

                image.addEventListener('error', () => {
                    this.fileLoadEnd(_resource, image);
                });

                image.src = _resource.source;
            },
        });
        // 基础通用纹理加载器
        // const basisLoader = new BasisTextureLoader()
        // basisLoader.setTranscoderPath('')

        // Basis images
        const basisLoader = new BasisTextureLoader();
        basisLoader.setTranscoderPath('static/basis');
        basisLoader.detectSupport(this.renderer);

        this.loaders.push({
            extensions: ['basis'],
            action: (_resource: any) => {
                basisLoader.load(_resource.source, (_data: any) => {
                    this.fileLoadEnd(_resource, _data);
                });
            },
        });

        // Draco
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('static/draco/');
        dracoLoader.setDecoderConfig({ type: 'js' });

        this.loaders.push({
            extensions: ['drc'],
            action: (_resource: any) => {
                dracoLoader.load(_resource.source, (_data: any) => {
                    this.fileLoadEnd(_resource, _data);

                    DRACOLoader.releaseDecoderModule();
                });
            },
        });

        // GLTF
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        this.loaders.push({
            extensions: ['glb', 'gltf'],
            action: (_resource: any) => {
                gltfLoader.load(_resource.source, (_data: any) => {
                    this.fileLoadEnd(_resource, _data);
                });
            },
        });

        // FBX
        const fbxLoader = new FBXLoader();

        this.loaders.push({
            extensions: ['fbx'],
            action: (_resource: any) => {
                fbxLoader.load(_resource.source, (_data: any) => {
                    this.fileLoadEnd(_resource, _data);
                });
            },
        });

        // RGBE | HDR
        const rgbeLoader = new RGBELoader();

        this.loaders.push({
            extensions: ['hdr'],
            action: (_resource: any) => {
                rgbeLoader.load(_resource.source, (_data: any) => {
                    this.fileLoadEnd(_resource, _data);
                });
            },
        });
    }

    /**
     * Load
     */
    load(_resources: any[]) {
        for (const _resource of _resources) {
            this.toLoad++;
            const extensionMatch = _resource.source.match(/\.([a-z]+)$/);

            if (typeof extensionMatch[1] !== 'undefined') {
                const extension = extensionMatch[1];
                const loader = this.loaders.find((_loader) =>
                    _loader.extensions.find(
                        (_extension) => _extension === extension
                    )
                );

                if (loader) {
                    loader.action(_resource);
                } else {
                    console.warn(`Cannot found loader for ${_resource}`);
                }
            } else {
                console.warn(`Cannot found extension of ${_resource}`);
            }
        }
    }

    fileLoadEnd(_resource: any, _data: HTMLImageElement) {
        this.loaded++;
        this.items[_resource.name] = _data;

        this.emit('fileEnd', [_resource, _data]);

        if (this.loaded === this.toLoad) {
            this.emit('end');
        }
    }
}
