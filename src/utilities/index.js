export function getWidth(el) {
    let isBorderBox = getComputedStyle(el).getPropertyValue('box-sizing') === 'border-box';
    const width = el.offsetWidth;
    if (isBorderBox) {
        const paddingLeft = parseFloat(getComputedStyle(el).getPropertyValue('padding-left'));
        const paddingRight = parseFloat(getComputedStyle(el).getPropertyValue('padding-right'));
        const borderLeft = parseFloat(getComputedStyle(el).getPropertyValue('border-left-width'));
        const borderRight = parseFloat(getComputedStyle(el).getPropertyValue('border-right-width'));

        return width -  paddingLeft - paddingRight - borderLeft - borderRight;
    } else {
        return width;
    }
}

export function getHeight(el) {
    let isBorderBox = getComputedStyle(el).getPropertyValue('box-sizing') === 'border-box';
    const height = el.offsetHeight;
    if (isBorderBox) {
        const paddingTop = parseFloat(getComputedStyle(el).getPropertyValue('padding-top'));
        const paddingBottom = parseFloat(getComputedStyle(el).getPropertyValue('padding-bottom'));
        const borderTop = parseFloat(getComputedStyle(el).getPropertyValue('border-top-width'));
        const borderBottom = parseFloat(getComputedStyle(el).getPropertyValue('border-bottom-width'));

        return height - paddingTop - paddingBottom - borderTop - borderBottom;
    } else {
        return height;
    }
}