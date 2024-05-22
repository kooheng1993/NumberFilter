document.addEventListener('DOMContentLoaded', () => {
    const ownTextarea = document.getElementById('own-textarea');
    const outsideTextarea = document.getElementById('outside-textarea');
    const resultsContent = document.getElementById('results-content');
    const resultsTotal = document.getElementById('results-total');

    ownTextarea.addEventListener('input', () => updateTotalNumber(ownTextarea, 'own-total'));
    outsideTextarea.addEventListener('input', () => updateTotalNumber(outsideTextarea, 'outside-total'));

    function updateTotalNumber(textarea, totalId) {
        const lines = textarea.value.split('\n').filter(line => line.trim() !== '');
        document.getElementById(totalId).textContent = lines.length;
    }

    window.removeDuplicates = function(listId) {
        const textarea = document.getElementById(`${listId}-textarea`);
        const lines = textarea.value.split('\n').map(line => line.trim()).filter(line => line !== '');
        const uniqueLines = [...new Set(lines)];
        textarea.value = uniqueLines.join('\n');
        updateTotalNumber(textarea, `${listId}-total`);
    };

    window.filterNumbers = function() {
        const worker = new Worker('worker.js');
        const ownNumbers = ownTextarea.value.split('\n').map(line => line.trim()).filter(line => line !== '');
        const outsideNumbers = outsideTextarea.value.split('\n').map(line => line.trim()).filter(line => line !== '');

        worker.postMessage({ ownNumbers, outsideNumbers });

        worker.onmessage = function(event) {
            const { result } = event.data;
            displayResultsInChunks(result);
        };
    };

    function displayResultsInChunks(numbers) {
        resultsContent.innerText = '';
        resultsTotal.textContent = numbers.length;
        
        const chunkSize = 100; // 每次处理和显示100个结果
        let index = 0;

        function processChunk() {
            const chunk = numbers.slice(index, index + chunkSize);
            resultsContent.innerText += chunk.join('\n') + '\n';
            index += chunkSize;

            if (index < numbers.length) {
                requestAnimationFrame(processChunk); // 使用requestAnimationFrame逐步处理
            }
        }

        processChunk();
    }

    window.copyResults = function() {
        const content = resultsContent.innerText;
        navigator.clipboard.writeText(content).then(() => {
            alert('Results copied to clipboard!');
        });
    };

    window.saveTextFile = function() {
        const text = resultsContent.innerText;
        const filename = `results_${Date.now()}.txt`;

        const element = document.createElement('a');
        element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
        element.download = filename;
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
});
