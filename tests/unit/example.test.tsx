import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../../src/app/page';

test('Home Page', () => {
    render(<Home />);
    expect(
        screen.getByRole('heading', {
            level: 1,
            name: /^To get started, edit the page\.tsx file\.$/,
        })
    ).toBeDefined();
});
