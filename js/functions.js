function degToRad(degree) {
    let rad = Math.PI * (degree / 180);
    return rad;
}

function randomInt(min, max) {
    let num = min + Math.floor(Math.random() * max);
    return num;
}

function getRadPosition(centerX, centerY, degree, distance) {
    let rad = degToRad(degree);
    let posX = centerX + Math.cos(rad) * distance;
    let posY = centerY + Math.sin(rad) * distance;
    return {
        x: posX,
        y: posY,
    };
}