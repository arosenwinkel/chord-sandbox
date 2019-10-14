import React from 'react';
import Tone from 'tone';
import {Chunk} from "./Chunk";

export class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.synth = new Tone.PolySynth(8, Tone.Synth).toMaster();
    }

    play() {
        this.stop();

        const sequence = [
            new Chunk("C", "3", "M", "2n"),
            new Chunk("F", "2", "M", "4n"),
            new Chunk("G", "2", "7", "4n")
        ];

        let timeSoFar = new Tone.Time(0);

        const events = sequence.map((s) => {
            const result = {"time": timeSoFar, "notes": s.notes, "duration": s.duration};
            timeSoFar += new Tone.Time(s.duration);
            return result;
        });

        // console.log(events);

        let part = new Tone.Part(
            (time, value) => {
                this.synth.triggerAttackRelease(value.notes, value.duration, time);
            }, 
            events
        );

        const loopEndTime = sequence.map(
            (s) => {return new Tone.Time(s.duration)}
        ).reduce(
            (acc, s) => {return (acc || 0) + s}
        );

        part.loop = true;
        part.loopStart = 0;
        part.loopEnd = loopEndTime;

        part.start(0);

        Tone.Transport.start();
    }

    stop() {
        Tone.Transport.cancel();
        this.synth.releaseAll();
        Tone.Transport.stop();
    }

    render() {
        return (
            <div>
                <button onClick={() => this.play()}>Play!</button>
                <button onClick={() => this.stop()}>Stop</button>
            </div>
        );
    }
}