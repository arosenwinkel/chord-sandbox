import React from 'react';
import {entries} from "@tonaljs/scale-dictionary";
import {Scale} from "./Scale";

// show chords in scale
// show extended chords in scale that contain a note

interface SuggesterState {
    scaleFilter: string,
    selectedNote: string
}

interface SuggesterProps {
    
}

export class Suggester extends React.Component<SuggesterProps, SuggesterState> {
    state = {
        scaleFilter: "major",
        selectedNote: "C"
    }

    getScales() {
        const filter = this.state.scaleFilter;
        return entries()
        .filter(type => type.name.includes(filter))
        .map((s) => s.name);
    }

    onChangeFilter(event: any) {
        event.preventDefault();
        this.changeFilter(event.target.value);
    }

    changeFilter(newFilter: string) {
        this.setState({scaleFilter: newFilter});
    }

    onChangeNote(event: any) {
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