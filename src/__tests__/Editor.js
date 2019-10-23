import React from 'react';
import { Editor } from '../Editor';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
    const div = document.createElement('div');
    shallow(<Editor />, div);
});