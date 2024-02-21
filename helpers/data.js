// TODO adjust these
const positionVarSlope = 0.5;
const sizeVarSlope = 0.0001;

let clusters = ["0", "1", "2", "3", "4", "5"];
// TODO change these so original colors can be used
clusters.info = [
    { key: 0 },
    { key: 1 },
    { key: 2 },
    { key: 3 },
    { key: 4 },
    { key: 5 },
];
clusters.colors = [
    [230, 222, 9],
    [230, 222, 9],
    [230, 222, 9],
    [230, 222, 9],
    [230, 222, 9],
    [230, 222, 9],
];

let pcUMap = {
    data: [],
    freehand: {
        isPressed: false,
        drawToCollect: [],
        raycaster_shape: null,
    },
};

let genes = {
    three: {
        geometry: null,
        pointCloud: null,
    },
};
const createClusterDataFromGeometry = (geometry) => {
    const positions = geometry.attributes.position.array;
    const chunkSize = 3;
    const chunks = [];
    for (let i = 0; i < positions.length; i += chunkSize) {
        const chunk = positions.slice(i, i + chunkSize);
        chunks.push(chunk);
    }

    return chunks.map((c, i) => [
        `PathAnnotationObject-${i}`,
        "0",
        c[0],
        c[1],
        c[2],
    ]);
};
export {
    createClusterDataFromGeometry,
    clusters,
    genes,
    pcUMap,
    positionVarSlope,
    sizeVarSlope,
    // uMap,
};
