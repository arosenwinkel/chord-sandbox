import React from 'react';
import {scale, reduced, extended, scaleChords, modeNames} from "@tonaljs/scale";

interface ScaleState {
    showDetails: boolean,
    showMode: number
}

interface ScaleProps {
    root: string,
    type: string
}

enum DetailsMode {
    NOTES,
    CHORDS,
    INTERVALS,
    MODES,
    RELATED
};

export class Scale extends React.Component<ScaleProps, ScaleState> {
    state = {
        showDetails: false,
        showMode: DetailsMode.NOTES
    }

    mapping: Record<string, DetailsMode> = {
        "Notes": DetailsMode.NOTES,
        "Chords": DetailsMode.CHORDS,
        "Intervals": DetailsMode.INTERVALS,
        "Modes": DetailsMode.MODES,
        "Related": DetailsMode.RELATED,
    }

    getName() {
        return `${this.props.root} ${this.props.type}`;
    }

    getDetails() {
        let results = [];

        if (this.state.showMode === DetailsMode.NOTES) {
            results = scale(this.getName()).notes;
        }
        else if (this.state.showMode === DetailsMode.CHORDS) {
            results = scaleChords(this.getName());
        }
        else if (this.state.showMode === DetailsMode.INTERVALS) {
            results = scale(this.getName()).intervals;
        }
        else if (this.state.showMode === DetailsMode.MODES) {
            results = modeNames(this.getName()).map((pair) => `${pair[0]}: ${pair[1]}`);
        }
        else {
            results = extended(this.getName()).concat(reduced(this.getName()));
        }

        return results.join(", ");
    }

    onChangeMode(event: any) {
        this.setState({showMode: this.mapping[event.target.value]});
    }

    renderDetailsSection() {
        const options = Object.keys(this.mapping).map((k, key) => 
            <label key={key}>
                <input type="radio" value={k} checked={this.state.showMode === this.mapping[k]} onChange={(e) => this.onChangeMode(e)} />
                {k}
            </label>
        );

        return (
            <div>
                <form>
                    {options}
                </form>
                <p>{this.getDetails()}</p>
            </div>
        );
    }

    render() {
        let detailsSection = null;
        if (this.state.showDetails) {
            detailsSection = this.renderDetailsSection();
        }

        return (
            <div>
                <p onClick={(e) => this.setState(prev => ({showDetails: !prev.showDetails}))}>{this.getName()}</p>
                {detailsSection}
            </div>
        );
    }
}