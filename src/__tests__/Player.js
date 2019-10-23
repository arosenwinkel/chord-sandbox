import React from 'react';
import { Player } from '../Player';
import { shallow } from 'enzyme';

jest.mock('tone');

it('renders without crashing', () => {
    const div = document.createElement('div');
    shallow(<Player />, div);
});