import { useState } from 'react';

function useInput(initialValue, onChanged = null) {
    const [value, setValue] = useState(initialValue);

    const handleChange = (event) => {
        setValue(event.target.value);
        if (onChanged) onChanged(event);
    };

    return {
        value,
        onChange: handleChange
    };
}

export default useInput;
