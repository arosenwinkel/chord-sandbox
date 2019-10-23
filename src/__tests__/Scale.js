import React from 'react';
import { Scale } from '../Scale';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
    const div = document.createElement('div');
    shallow(<Scale />, div);
});