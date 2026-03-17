import { render } from '@testing-library/react'
import App from '../App.jsx'

test('renders app without crashing', () => {
    render(<App />)
    expect(document.body).toBeInTheDocument()
})

