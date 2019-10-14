import {chord} from "@tonaljs/chord";
import Tone from 'tone';

export class Chunk {
    constructor(root, octave, details, duration) {
        this.root = root;
        this.octave = octave;
        this.details = details;
        this.duration = duration;

        this.notes = chord(this.print()).notes;
    }

    toEvent() {
        return new Tone.Event(Tone.noOp, this.notes);
    }

    print() {
        return `${this.root}${this.octave} ${this.details}`;
    }

    prettyPrint() {
        return `${this.root}${this.details}`
    }
}