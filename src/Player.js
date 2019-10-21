import React from 'react';
import Tone from 'tone';
import {toMidi} from "@tonaljs/midi";
import {Chunk} from "./Chunk";
import MIDISounds from 'midi-sounds-react';
import {array} from "prop-types";

const voices = Object.freeze({
    SYNTH: 1,
    GUITAR: 2,
    PIANO: 3
});

export class Player extends React.Component {
    state = {
        voice: voices.SYNTH
    }

    constructor(props) {
        super(props);

        this.synth = new Tone.PolySynth(8, Tone.Synth).toMaster();
    }

    static propTypes = {
        sequence: array.isRequired
    }

    doChord(chord, duration, timelinePos) {
        const notes = chord.getNotes();

        if (this.state.voice === voices.SYNTH) {
            this.synth.triggerAttackRelease(notes, duration, timelinePos);
            return;
        }

        const midiNotes = notes.map((n) => toMidi(n));
        const durationInSeconds = Tone.Time(duration).toSeconds();

        if (this.state.voice === voices.GUITAR) {
            this.midiSounds.playStrumDownNow(269, midiNotes, durationInSeconds);
        }
        else if (this.state.voice === voices.PIANO) {
            this.midiSounds.playStrumDownNow(3, midiNotes, durationInSeconds);
        }
    }

    play() {
        this.stop();

        const chunks = this.props.sequence.map((s) => {
            return new Chunk(s)
        });

        let timeSoFar = new Tone.Time(0);

        const events = chunks.map((c) => {
            const duration = c.getDuration();
            const result = {"time": timeSoFar, "chord": c, "duration": duration};
            timeSoFar += new Tone.Time(duration);
            return result;
        });

        let part = new Tone.Part(
            (time, value) => {
                this.doChord(value.chord, value.duration, time);
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
                <div className="controls">
                    <button onClick={() => this.play()}>Play!</button>
                    <button onClick={() => this.stop()}>Stop</button>
                </div>
                <form className="voiceSelector">
                    VOICE SELECTOR
                    <label>
                        <input type="radio" value="synth" checked={this.state.voice === voices.SYNTH} onChange={() => this.setState({voice: voices.SYNTH})} />
                        SYNTH
                    </label>
                    <label>
                        <input type="radio" value="guitar" checked={this.state.voice === voices.GUITAR} onChange={() => this.setState({voice: voices.GUITAR})} />
                        GUITAR
                    </label>
                    <label>
                        <input type="radio" value="piano" checked={this.state.voice === voices.PIANO} onChange={() => this.setState({voice: voices.PIANO})} />
                        PIANO
                    </label>
                </form>
                <div style={{display: "none"}}>
                    <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3, 269]} />
                </div>
            </div>
        );
    }
}