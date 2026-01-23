import { expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Home from '../../src/app/page';

test('Home Page', () => {
    render(<Home />);
    expect(
        screen.getByRole('heading', {
            level: 1,
            name: /.*Sarasi Institute.*/,
        })
    ).toBeDefined();

    cleanup();
});
