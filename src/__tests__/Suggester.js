import React from 'react';
import { Suggester } from '../Suggester';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
    const div = document.createElement('div');
    shallow(<Suggester />, div);
});