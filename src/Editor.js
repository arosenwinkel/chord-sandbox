import React from 'react';
import ReactDOM from "react-dom";
import {Chunk} from "./Chunk";
import {Player} from "./Player";

export class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sequence: [
                {"root": "D", "octave": "3", "details": "M", "duration": "2n"},
                {"root": "A", "octave": "3", "details": "M", "duration": "2n"},
                {"root": "B", "octave": "3", "details": "m", "duration": "2n"},
                {"root": "G", "octave": "3", "details": "M", "duration": "2n"}
            ]
        }
    }

    onChange(idx, data) {
        let sequence = this.state.sequence;
        let target = sequence[idx];
        Object.assign(target, data);

        sequence[idx] = target;

        this.setState(sequence);
    }

    onDelete(idx) {
        let sequence = this.state.sequence;
        sequence.splice(idx);
        this.setState(sequence);
    }

    onAdd() {
        let sequence = this.state.sequence;
        sequence.push({"root": "C", "octave": "3", "details": "M", "duration": "2n"});
        this.setState(sequence);
    }

    renderChunks() {
        const items = this.state.sequence.map((c, i) => {
            return (
                <li key={i}>
                    <Chunk
                        idx={i} root={c.root} octave={c.octave} 
                        details={c.details} duration={c.duration} 
                        handleSubmit={(idx, data) => this.onChange(idx, data)}
                        handleDelete={(idx) => this.onDelete(idx)}
                    />
                </li>
            );
        });

        return (
            <ul>
                {items}
                <li><button onClick={() => {this.onAdd()}}>Add</button></li>
            </ul>
        );
    }

    render() {
        return (
            <div>
                {this.renderChunks()}
                <Player
                    sequence={this.state.sequence}
                />
            </div>
        )
    }
}