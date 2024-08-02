

function trimStringToLength(value, maxLength) {
    if (value.length + 2 > maxLength) {
        return value.substring(0, maxLength) + '...';
    }

    return value;
}

export { trimStringToLength };