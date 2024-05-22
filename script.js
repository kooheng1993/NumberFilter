// script.js
document.querySelectorAll('textarea').forEach(area => {
    area.addEventListener('input', updateTotalNumber);
});

function updateTotalNumber(event) {
    let lines = event.target.value.split('\n').filter(line => line.trim() !== '');
    let totalId = event.target.id === 'own-textarea' ? 'own-total' : 'outside-total';
    document.getElementById(totalId).textContent = lines.length;
}
document.querySelectorAll('textarea').forEach(textarea => {
    updateTotalNumber({ target: textarea });
});

function removeDuplicates(listId) {
    let textarea = document.getElementById(listId + '-textarea');
    let lines = textarea.value.split('\n').map(line => line.trim()).filter(line => line !== '');
    let uniqueLines = [...new Set(lines)];
    textarea.value = uniqueLines.join('\n');
    updateTotalNumber({ target: textarea });
}

function filterNumbers() {
    let ownNumbers = new Set(document.getElementById('own-textarea').value.split('\n').map(line => line.trim()).filter(line => line !== ''));
    let outsideNumbers = document.getElementById('outside-textarea').value.split('\n').map(line => line.trim()).filter(line => line !== '');
    let result = outsideNumbers.filter(number => !ownNumbers.has(number));

    document.getElementById('results-content').innerText = result.join('\n');
    document.getElementById('results-total').textContent = result.length;
}

function copyResults() {
    let content = document.getElementById('results-content').innerText;
    navigator.clipboard.writeText(content).then(() => {
        alert('Results copied to clipboard!');
    });
}

function saveTextFile() {
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
}
