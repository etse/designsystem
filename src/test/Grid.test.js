import React from 'react';
import { shallow } from 'enzyme';

import { Grid } from '..';

const defaultProps = {
    children: <p>blah</p>,
};

const renderShallow = (props = {}) => shallow(<Grid {...defaultProps} {...props} />);

describe('Grid', () => {
    it('renders with default class', () => {
        const el = renderShallow();

        expect(el.prop('className')).to.be('ffe-grid');
    });

    it('renders provided children node', () => {
        const el = renderShallow();

        expect(el.containsMatchingElement(<p>blah</p>)).to.be(true);
    });
});
