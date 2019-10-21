import React from 'react';
import {chord} from "@tonaljs/chord";
import Tone from 'tone';
import {string, func, number} from "prop-types";

const detailsMapping = {
    "Major": "M", "Minor": "m", "Dominant Seventh": "7", 
    "Diminished": "dim", "Augmented": "aug",
    "Major Seventh": "Maj7", "Fifth": "5",
    "Sixth": "6", "Sus4": "sus4", "Sus2": "sus2",
    "Ninth": "9", "Eleventh": "11", "Thirteenth": "13",
    "Something else...": "SOMETHING ELSE"
};

const durationMapping = {
    "Quarter Note": "4n",
    "Half Note": "2n",
    "Whole Note": "1n",
    "Something else...": "SOMETHING ELSE"
};

export class Chunk extends React.Component {
    state = {
        showDetailsSomethingElse: false,
        showDurationSomethingElse: false
    }

    static propTypes = {
        root: string.isRequired,
        modifier: string,
        octave: string.isRequired,
        details: string.isRequired,
        duration: string.isRequired,
        handleDelete: func.isRequired,
        handleSubmit: func.isRequired,
        idx: number.isRequired
    }

    getNotes() {
        return chord(this.print()).notes;
    }

    getMidi() {
        return chord(this.print()).midi;
    }

    getDuration() {
        return this.props.duration;
    }

    toEvent() {
        return new Tone.Event(Tone.noOp, this.getNotes());
    }

    print() {
        return `${this.props.root}${this.props.modifier || ""}${this.props.octave} ${this.props.details}`;
    }

    prettyPrint() {
        return `${this.props.root}${this.props.modifier || ""}${this.props.details}`
    }

    submit(data) {
        this.props.handleSubmit(this.props.idx, data);
    }

    handleRoot(event) {
        event.preventDefault();
        this.submit({root: event.target.value});
    }

    handleModifier(event) {
        event.preventDefault();
        this.submit({modifier: event.target.value});
    }

    handleOctave(event) {
        event.preventDefault();
        this.submit({octave: event.target.value});
    }

    handleDetails(event) {
        event.preventDefault();
        const value = event.target.value;
        this.setState({showDetailsSomethingElse: value === "SOMETHING ELSE"});

        if (this.state.showDetailsSomethingElse) return;

        this.submit({details: value});
    }

    handleCustomDetails(event) {
        event.preventDefault();

        this.submit({details: event.target.value});
    }

    handleDuration(event) {
        event.preventDefault();
        const value = event.target.value;
        this.setState({showDurationSomethingElse: value === "SOMETHING ELSE"});

        if (this.state.showDurationSomethingElse) return;

        this.submit({duration: value});
    }

    handleCustomDuration(event) {
        event.preventDefault();
        this.submit({duration: event.target.value});
    }

    render() {
        const root = this.props.root;
        const modifier = this.props.modifier;
        const octave = this.props.octave;
        const details = this.props.details;
        const duration = this.props.duration;

        return (
            <div>
                <button onClick={() => this.props.handlePlay(this.props.idx)}>Play</button>
                <label>
                    Root:
                    <select value={root} onChange={(e) => this.handleRoot(e)} >
                        {
                            ["A", "B", "C", "D", "E", "F", "G"].map((n, i) => <option key={i} value={n}>{n}</option>)
                        }
                    </select>
                </label>
                <label>
                    Modifier:
                    <select value={modifier} onChange={(e) => this.handleModifier(e)} >
                        {
                            ["", "b", "#"].map((n, i) => <option key={i} value={n}>{n}</option>)
                        }
                    </select>
                </label>
                <label>
                    Octave:
                    <select value={octave} onChange={(e) => this.handleOctave(e)} >
                        {
                            ["1", "2", "3", "4", "5"].map((n, i) => <option key={i} value={n}>{n}</option>)
                        }
                    </select>
                </label>
                <label>
                    Details:
                    <select value={details} onChange={(e) => this.handleDetails(e)} >
                        {
                            Object.keys(detailsMapping).map((n, i) => <option key={i} value={detailsMapping[n]}>{n}</option>)
                        }
                    </select>
                    {(this.state.showDetailsSomethingElse) ? <input type="text" onChange={(e) => this.handleCustomDetails(e)} /> : null}
                </label>
                <label>
                    Duration:
                    <select value={duration} onChange={(e) => this.handleDuration(e)} >
                        {
                            Object.keys(durationMapping).map((n, i) => <option key={i} value={durationMapping[n]}>{n}</option>)
                        }
                    </select>
                    {(this.state.showDurationSomethingElse) ? <input type="text" onChange={(e) => this.handleCustomDuration(e)} /> : null}
                </label>
                <button onClick={() => this.props.handleDelete(this.props.idx)}>X</button>
            </div>
        );
    }
}