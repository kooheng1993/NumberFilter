self.onmessage = function(event) {
    const { ownNumbers, outsideNumbers } = event.data;
    const ownSet = new Set(ownNumbers);
    const result = [];

    for (let number of outsideNumbers) {
        if (!ownSet.has(number)) {
            result.push(number);
        }
    }

    self.postMessage({ result });
};
