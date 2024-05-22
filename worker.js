self.onmessage = function(event) {
    const { ownNumbers, outsideNumbers } = event.data;
    const ownSet = new Set(ownNumbers);
    const result = outsideNumbers.filter(number => !ownSet.has(number));

    self.postMessage({ result });
};
