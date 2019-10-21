import React from 'react';
import {Chunk} from "./Chunk";
import {Player} from "./Player";
// @ts-ignore
import ReactReorderable from "react-reorderable";

interface ToneDetails {
    root: string,
    octave: number,
    details: string,
    duration: string,
    modifier?: string
}

function getDefaultSequence(): ToneDetails[] {
    return [
        {"root": "D", "octave": 3, "details": "M", "duration": "2n"},
        {"root": "A", "octave": 3, "details": "M", "duration": "2n"},
        {"root": "B", "octave": 3, "details": "m", "duration": "2n"},
        {"root": "G", "octave": 3, "details": "M", "duration": "2n"}
    ];
}

export class Editor extends React.Component {
    child: any;

    state = {
        sequence: getDefaultSequence()
    }

    static propType = {
        
    }

    onChange(idx: number, data: any) {
        let sequence = [...this.state.sequence];
        let target = sequence[idx];
        Object.assign(target, data);

        sequence[idx] = target;

        this.setState({sequence: sequence});
    }

    onDelete(idx: number) {
        let sequence = [...this.state.sequence];
        sequence.splice(idx);
        this.setState({sequence: sequence});
    }

    onAdd() {
        let sequence = [...this.state.sequence];

        let newEntry: any = {};
        Object.assign(newEntry, sequence[sequence.length - 1]);
        sequence.push(newEntry);
        
        this.setState({sequence: sequence});
    }

    handleReset() {
        let sequence = getDefaultSequence();
        this.setState({sequence: sequence});
    }

    onPlay(idx: number) {
        const sequenceItem: any = this.state.sequence[idx];
        const chunk = new Chunk(sequenceItem);
        this.child.doChord(chunk, "2n");
    }

    onMoveUp(idx: number) {
        if (idx === 0) return;
        let sequence = this.state.sequence;
        sequence.splice(idx - 1, 0, sequence.splice(idx, 1)[0]);
        
        this.setState({sequence: sequence});
    }

    onMoveDown(idx: number) {
        if (idx === this.state.sequence.length - 1) return;
        let sequence = this.state.sequence;
        sequence.splice(idx + 1, 0, sequence.splice(idx, 1)[0]);
        
        this.setState({sequence: sequence});
    }

    renderChunks() {
        const items = this.state.sequence.map((c, i) => {
            return (
                <div key={i}>
                    <Chunk
                        key={i}
                        idx={i} root={c.root} octave={c.octave} 
                        details={c.details} duration={c.duration} 
                        handleSubmit={(idx, data) => this.onChange(idx, data)}
                        handleDelete={(idx) => this.onDelete(idx)}
                        handlePlay={(idx) => this.onPlay(idx)}
                        handleMoveUp={(idx) => this.onMoveUp(idx)}
                        handleMoveDown={(idx) => this.onMoveDown(idx)}
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