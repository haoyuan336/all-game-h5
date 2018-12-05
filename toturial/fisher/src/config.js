export default {
    cdn: location.origin ? `${location.origin}/game` : 'https://wisdom.lufei.so/logi',
    bkgColor: 0x171a24,
    zoom: {
        mix: [],
        get min() {return Math.min(...this.mix)},
        get max() {return Math.max(...this.mix)}
    },
    screen: {
        width: 750,
        height: 1334,
        resolution: 1,
        mode: 'portrait',
        get ratio() {return this.width / this.height}
    },
    design: {
        width: 750,
        height: 1334,
        mode: 'portrait',
        get ratio() {return this.width / this.height}
    },
    scene: null
}