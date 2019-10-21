import React from 'react';
// @ts-ignore
import Tone from 'tone';

import {toMidi} from "@tonaljs/midi";
import {Chunk} from "./Chunk";

// @ts-ignore
import MIDISounds from 'midi-sounds-react';

enum Voice {
    SYNTH,
    GUITAR,
    PIANO
};

interface PlayerProps {
    sequence: any[]
}

interface PlayerState {
    voice: Voice
}

export class Player extends React.Component<PlayerProps, PlayerState> {
    synth: Tone.PolySynth;
    midiSounds: any;

    state = {
        voice: Voice.SYNTH
    }

    constructor(props: PlayerProps) {
        super(props);

        this.synth = new Tone.PolySynth(8, Tone.Synth).toMaster();
    }

    doChord(chord: any, duration: string, timelinePos: any) {
        const notes = chord.getNotes();

        if (this.state.voice === Voice.SYNTH) {
            this.synth.triggerAttackRelease(notes, duration, timelinePos);
            return;
        }

        const midiNotes = notes.map((n: string) => toMidi(n));
        const durationInSeconds = Tone.Time(duration).toSeconds();

        if (this.state.voice === Voice.GUITAR) {
            this.midiSounds.playStrumDownNow(269, midiNotes, durationInSeconds);
        }
        else if (this.state.voice === Voice.PIANO) {
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
            (time: any, value: any) => {
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
                        <input type="radio" value="synth" checked={this.state.voice === Voice.SYNTH} onChange={() => this.setState({voice: Voice.SYNTH})} />
                        SYNTH
                    </label>
                    <label>
                        <input type="radio" value="guitar" checked={this.state.voice === Voice.GUITAR} onChange={() => this.setState({voice: Voice.GUITAR})} />
                        GUITAR
                    </label>
                    <label>
                        <input type="radio" value="piano" checked={this.state.voice === Voice.PIANO} onChange={() => this.setState({voice: Voice.PIANO})} />
                        PIANO
                    </label>
                </form>
                <div style={{display: "none"}}>
                    <MIDISounds ref={(ref: any) => (this.midiSounds = ref)} appElementName="root" instruments={[3, 269]} />
                </div>
            </div>
        );
    }
}