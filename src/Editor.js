import React from 'react';
import {Chunk} from "./Chunk";
import {Player} from "./Player";
import ReactReorderable from "react-reorderable";

const defaultSequence = Object.freeze([
    {"root": "D", "octave": "3", "details": "M", "duration": "2n"},
    {"root": "A", "octave": "3", "details": "M", "duration": "2n"},
    {"root": "B", "octave": "3", "details": "m", "duration": "2n"},
    {"root": "G", "octave": "3", "details": "M", "duration": "2n"}
]);

export class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sequence: [...defaultSequence]
        }
    }

    onChange(idx, data) {
        let sequence = [...this.state.sequence];
        let target = sequence[idx];
        Object.assign(target, data);

        sequence[idx] = target;

        this.setState(sequence);
    }

    onDelete(idx) {
        let sequence = [...this.state.sequence];
        sequence.splice(idx);
        this.setState(sequence);
    }

    onAdd() {
        let sequence = [...this.state.sequence];
        sequence.push({"root": "C", "octave": "3", "details": "M", "duration": "2n"});
        this.setState(sequence);
    }

    handleReset() {
        this.setState({sequence: [...defaultSequence]});
    }

    onPlay(idx) {
        const sequenceItem = this.state.sequence[idx];
        const chunk = new Chunk(sequenceItem);
        this.child.doChord(chunk, "2n");
    }

    renderChunks() {
        const items = this.state.sequence.map((c, i) => {
            return (
                <div>
                    <Chunk
                        key={i}
                        idx={i} root={c.root} octave={c.octave} 
                        details={c.details} duration={c.duration} 
                        handleSubmit={(idx, data) => this.onChange(idx, data)}
                        handleDelete={(idx) => this.onDelete(idx)}
                        handlePlay={(idx) => this.onPlay(idx)}
                    />
                </div>
            );
        });

        return (
            <div>
                <ReactReorderable>
                    {items}
                </ReactReorderable>
                <button onClick={() => {this.onAdd()}}>Add</button>
                <button onClick={() => this.handleReset()}>Reset</button>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderChunks()}
                <Player
                    ref={instance => {this.child = instance;}}
                    sequence={this.state.sequence}
                />
            </div>
        )
    }
}