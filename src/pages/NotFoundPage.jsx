import { Link } from 'react-router'

export default function NotFoundPage() {
    return (
        <div className="box">
            <h2>404</h2>
            <p>No page here.</p>
            <Link to="/">Back to Home</Link>
        </div>
    )
}