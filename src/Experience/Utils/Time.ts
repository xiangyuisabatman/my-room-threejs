import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
    start: number = Date.now(); // 开始时间
    current: number = this.start; // 当前时间
    elapsed: number = 0; // 运行时间
    delta: number = 16; // 间隔时间
    playing: boolean = true; // 播放状态
    ticker!: number; // 动画标识
    constructor() {
        super();
    }

    /**
     * 播放
     */
    play() {
        this.playing = true;
    }
    /**
     * 暂停
     */
    pause() {
        this.playing = false;
    }
    /**
     * 间隔
     */
    tick() {
        this.ticker = window.requestAnimationFrame(this.tick);
        const current = Date.now();

        this.delta = current - this.current;
        this.elapsed += this.playing ? this.delta : 0;
        this.current = current;

        if (this.delta > 60) {
            this.delta = 60;
        }

        if (this.playing) {
            this.emit('tick');
        }
    }
    /**
     * 停止
     */
    stop() {
        window.cancelAnimationFrame(this.ticker);
    }
}
