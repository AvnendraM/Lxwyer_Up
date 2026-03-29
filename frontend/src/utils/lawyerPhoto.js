/**
 * Resolves a lawyer's photo URL to an absolute URL.
 * Returns null if no real photo is available (so UI can show initials instead).
 *
 * @param {string|null} photo - Raw photo value from the API
 * @param {string} name - Lawyer's name (unused here, kept for API compatibility)
 * @param {string} [baseUrl] - API base URL
 * @returns {string|null} - Absolute URL or null
 */

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export function getLawyerPhoto(photo, name = 'Lawyer', baseUrl = API_BASE) {
    if (!photo || photo.trim() === '') return null;

    // Already an absolute URL (http/https or data URI)
    if (photo.startsWith('http') || photo.startsWith('data:')) {
        return photo;
    }

    // Relative path — prepend the API base URL
    if (photo.startsWith('/')) {
        return `${baseUrl}${photo}`;
    }

    return photo;
}

/**
 * Helper: get initials from a name, max 2 chars.
 */
export function getInitials(name = 'L') {
    return (name || 'L')
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

/**
 * onError handler for <img> — hides the img and shows the next sibling (initials div).
 * Use pattern: <img onError={onPhotoError()} /><div className="initials-fallback">SG</div>
 */
export function onPhotoError() {
    return (e) => {
        e.target.onerror = null;
        e.target.style.display = 'none';
        if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
        }
    };
}
