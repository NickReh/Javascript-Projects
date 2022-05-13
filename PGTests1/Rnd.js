class Rnd {
    constructor (seed) {
        this.prng = new Math.seedrandom(seed);
    }

    getNum () {
        return Math.abs(this.prng.int32());
    }

    getDouble (min, max) {
        return (this.getNum() / 0x7FFFFFFF) * (max - min) + min;
    }

    getInt (min, max) {
        return (Math.round(this.getNum()) % (max - min)) + min;
    }
}