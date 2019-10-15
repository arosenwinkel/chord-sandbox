import React from 'react';
import {chord} from "@tonaljs/chord";
import Tone from 'tone';

export class Chunk extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    getNotes() {
        return chord(this.print()).notes;
    }

    getDuration() {
        return this.props.duration;
    }

    toEvent() {
        return new Tone.Event(Tone.noOp, this.getNotes());
    }

    print() {
        return `${this.props.root}${this.props.octave} ${this.props.details}`;
    }

    prettyPrint() {
        return `${this.props.root}${this.props.details}`
    }

    submit(data) {
        this.props.handleSubmit(this.props.idx, data);
    }

    handleRoot(event) {
        event.preventDefault();
        this.submit({root: event.target.value});
    }

    handleOctave(event) {
        event.preventDefault();
        this.submit({octave: event.target.value});
    }

    handleDetails(event) {
        event.preventDefault();
        this.submit({details: event.target.value});
    }

    handleDuration(event) {
        event.preventDefault();
        this.submit({duration: event.target.value});
    }

    render() {
        return (
            <div>
                <label>
                    Root:
                    <input type="text" value={this.props.root} onChange={(e) => this.handleRoot(e)} />
                </label>
                <label>
                    Octave:
                    <input type="text" value={this.props.octave} onChange={(e) => this.handleOctave(e)} />
                </label>
                <label>
                    Details:
                    <input type="text" value={this.props.details} onChange={(e) => this.handleDetails(e)} />
                </label>
                <label>
                    Duration:
                    <input type="text" value={this.props.duration} onChange={(e) => this.handleDuration(e)} />
                </label>
                <button onClick={() => this.props.handleDelete(this.props.idx)}>X</button>
            </div>
        );
    }
}