import React from 'react';
import { Chunk } from '../Chunk';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
    const div = document.createElement('div');
    shallow(<Chunk root={"D"} octave={3} details={"M"} duration={"2n"} />, div);
});