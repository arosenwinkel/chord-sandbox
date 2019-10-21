import React from 'react';
import {scale, reduced, extended, scaleChords, modeNames} from "@tonaljs/scale";
import {entries} from "@tonaljs/scale-dictionary";
import {string} from "prop-types";

// show chords in scale
// show extended chords in scale that contain a note

export class Scale extends React.Component {
    state = {
        showDetails: false,
        showMode: this.NOTES
    }

    static propTypes = {
        root: string.isRequired,
        type: string.isRequired
    }

    NOTES = 1;
    CHORDS = 2;
    INTERVALS = 3;
    MODES = 4;
    RELATED = 5;

    mapping = {
        "Notes": this.NOTES,
        "Chords": this.CHORDS,
        "Intervals": this.INTERVALS,
        "Modes": this.MODES,
        "Related": this.RELATED,
    }

    getName() {
        return `${this.props.root} ${this.props.type}`;
    }

    getDetails() {
        let results = [];

        if (this.state.showMode === this.NOTES) {
            results = scale(this.getName()).notes;
        }
        else if (this.state.showMode === this.CHORDS) {
            results = scaleChords(this.getName());
        }
        else if (this.state.showMode === this.INTERVALS) {
            results = scale(this.getName()).intervals;
        }
        else if (this.state.showMode === this.MODES) {
            results = modeNames(this.getName()).map((pair) => `${pair[0]}: ${pair[1]}`);
        }
        else {
            results = extended(this.getName()).concat(reduced(this.getName()));
        }

        return results.join(", ");
    }

    onChangeMode(event) {
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

export class Suggester extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scaleFilter: "major",
            selectedNote: "C"
        }
    }

    getScales() {
        const filter = this.state.scaleFilter;
        return entries()
        .filter(type => type.name.includes(filter))
        .map((s) => s.name);
    }

    onChangeFilter(event) {
        event.preventDefault();
        this.changeFilter(event.target.value);
    }

    changeFilter(newFilter) {
        this.setState({scaleFilter: newFilter});
    }

    onChangeNote(event) {
        event.preventDefault();
        this.setState({selectedNote: event.target.value});
    }

    render() {
        const scales = this.getScales();
        return (
            <div>
                <input value={this.state.selectedNote} type="text" onChange={(e) => this.onChangeNote(e)}></input>
                <input value={this.state.scaleFilter} type="text" onChange={(e) => this.onChangeFilter(e)}></input>
                <ul>
                    {scales.map((s, k) => <Scale key={k} root={this.state.selectedNote} type={s} />)}
                </ul>
            </div>
        );
    }
}