import {describe, afterEach, vi, test, expect} from "vitest";
import SearchBar from "../../src/Components/SearchBar.jsx";
import {render, screen} from "@testing-library/react";

// Mock axios itself
vi.mock('../../src/axios-client', () => {
    return{
        default: {
            get: vi.fn(),
            interceptors: {
                request: {
                    use: vi.fn(),
                },
            },
        },
    };
});
describe('SearchBar component', () => {
    // Create a mock function to verify later if it has been called correctly
    const setUser = vi.fn();

    afterEach(() => {
        vi.clearAllMocks;
    });

    test('renders with initial email when prop exists', () => {
        render(<SearchBar setUser={setUser} email={"test@example.com"}/>);

        expect(screen.getByPlaceholderText('test@example.com', {exact: false})).toBeInTheDocument();
        expect(screen.getByPlaceholderText('test@example.com').value).toBe('test@example.com');
    });


})