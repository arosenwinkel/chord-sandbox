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

        const chunks = this.props.sequence.map((s) => {
            // console.log(s);
            return new Chunk(s)
        });

        let timeSoFar = new Tone.Time(0);

        const events = chunks.map((c) => {
            const duration = c.getDuration();
            const result = {"time": timeSoFar, "notes": c.getNotes(), "duration": duration};
            timeSoFar += new Tone.Time(duration);
            return result;
        });

        let part = new Tone.Part(
            (time, value) => {
                this.synth.triggerAttackRelease(value.notes, value.duration, time);
            }, 
            events
        );

        const loopEndTime = chunks.map(
            (c) => {return new Tone.Time(c.getDuration())}
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