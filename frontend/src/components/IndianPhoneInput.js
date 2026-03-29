import React, { useState } from 'react';

/**
 * IndianPhoneInput
 * Props: value, onChange, label, required, className, darkMode
 */
const IndianPhoneInput = ({
    value = '',
    onChange,
    label = 'Phone Number',
    required = true,
    className = '',
    darkMode = false,
}) => {
    const [touched, setTouched] = useState(false);

    const handleChange = (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
        onChange(digits);
    };

    const isValid = value.length === 10;
    const showError = touched && !isValid;

    return (
        <div className={className}>
            {label && (
                <label
                    className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700 dark:text-slate-300'
                        }`}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Outer border wrapper */}
            <div
                className={`flex items-stretch rounded-lg overflow-hidden transition-all ${showError
                        ? 'ring-2 ring-red-500 border border-red-500'
                        : darkMode
                            ? 'border border-slate-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-slate-800'
                            : 'border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white dark:bg-slate-900/50'
                    }`}
            >
                {/* Flag + code prefix */}
                <div
                    className={`flex items-center gap-1.5 px-3 flex-shrink-0 border-r ${darkMode
                            ? 'bg-slate-700 border-slate-600'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                >
                    <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>🇮🇳</span>
                    <span
                        className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-700 dark:text-slate-200'
                            }`}
                    >
                        +91
                    </span>
                </div>

                {/* Digit-only input */}
                <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={value}
                    onChange={handleChange}
                    onBlur={() => setTouched(true)}
                    required={required}
                    className={`flex-1 px-3 py-2.5 text-sm outline-none bg-transparent ${darkMode
                            ? 'text-white placeholder-slate-500'
                            : 'text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500'
                        }`}
                />

                {/* Live counter */}
                <span
                    className={`pr-3 self-center text-xs font-medium flex-shrink-0 tabular-nums ${isValid
                            ? 'text-green-500'
                            : touched
                                ? 'text-red-400'
                                : darkMode
                                    ? 'text-slate-500'
                                    : 'text-slate-400 dark:text-slate-500'
                        }`}
                >
                    {value.length}/10
                </span>
            </div>

            {showError && (
                <p className="mt-1 text-xs text-red-500">
                    Please enter a valid 10-digit mobile number.
                </p>
            )}
        </div>
    );
};

export default IndianPhoneInput;
