// script.js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('textarea').forEach(area => {
        area.addEventListener('input', updateTotalNumber);
    });

    document.querySelectorAll('textarea').forEach(textarea => {
        updateTotalNumber({ target: textarea });
    });

    function updateTotalNumber(event) {
        let lines = event.target.value.split('\n').filter(line => line.trim() !== '');
        let totalId = event.target.id === 'own-textarea' ? 'own-total' : 'outside-total';
        document.getElementById(totalId).textContent = lines.length;
    }

    window.removeDuplicates = function(listId) {
        let textarea = document.getElementById(listId + '-textarea');
        let lines = textarea.value.split('\n').map(line => line.trim()).filter(line => line !== '');
        let uniqueLines = [...new Set(lines)];
        textarea.value = uniqueLines.join('\n');
        updateTotalNumber({ target: textarea });
    };

    window.filterNumbers = function() {
        const worker = new Worker('worker.js');
        const ownNumbers = document.getElementById('own-textarea').value.split('\n').map(line => line.trim()).filter(line => line !== '');
        const outsideNumbers = document.getElementById('outside-textarea').value.split('\n').map(line => line.trim()).filter(line => line !== '');

        worker.postMessage({ ownNumbers, outsideNumbers });

        worker.onmessage = function(event) {
            const { result } = event.data;
            displayResults(result);
        };
    };

    function displayResults(numbers) {
        const resultsContent = document.getElementById('results-content');
        const resultsTotal = document.getElementById('results-total');

        resultsContent.innerText = numbers.join('\n');
        resultsTotal.textContent = numbers.length;
    }

    window.copyResults = function() {
        let content = document.getElementById('results-content').innerText;
        navigator.clipboard.writeText(content).then(() => {
            alert('Results copied to clipboard!');
        });
    };

    window.saveTextFile = function() {
        const text = document.getElementById('results-content').innerText;
        const timestamp = new Date().getTime();
        const filename = `results_${timestamp}.txt`;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);
    };
});
