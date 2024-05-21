document.getElementById('randomize').addEventListener('click', () => {
    let nameList = document.getElementById('nameList').value.split('\n').filter(name => name.trim() !== '');
    for (let i = nameList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nameList[i], nameList[j]] = [nameList[j], nameList[i]];
    }
    document.getElementById('nameList').value = nameList.join('\n');
    updateNameCount();
});

document.getElementById('run').addEventListener('click', () => {
    let nameList = document.getElementById('nameList').value.split('\n').filter(name => name.trim() !== '');
    const splitNumber = parseInt(document.getElementById('splitNumber').value, 10);
    const filePrefix = document.getElementById('filePrefix').value || 'Part_';

    if (splitNumber < 1 || isNaN(splitNumber)) {
        alert('Please enter a valid chunk size');
        return;
    }

    const zip = new JSZip();
    const fileListDiv = document.getElementById('fileList');
    const fileCountDiv = document.getElementById('fileCount');
    fileListDiv.innerHTML = '';  // Clear the file list
    let fileCount = 0;

    for (let i = 0; i < nameList.length; i += splitNumber) {
        const chunk = nameList.slice(i, i + splitNumber).join('\n');
        const fileName = `${filePrefix}${Math.floor(i / splitNumber) + 1}.txt`;
        zip.file(fileName, chunk);
        const fileItem = document.createElement('div');
        fileItem.textContent = fileName;
        fileListDiv.appendChild(fileItem);
        fileCount++;
    }

    fileListDiv.style.display = 'block';
    fileCountDiv.style.display = 'block';
    fileCountDiv.textContent = `File Count: ${fileCount}`;
    document.getElementById('download').style.display = 'block';

    document.getElementById('download').addEventListener('click', () => {
        zip.generateAsync({ type: 'blob' }).then(content => {
            saveAs(content, 'name_list.zip');
        });
    });
});

document.getElementById('reset').addEventListener('click', () => {
    document.getElementById('nameList').value = '';
    document.getElementById('splitNumber').value = '';
    document.getElementById('filePrefix').value = 'Part_';
    document.getElementById('fileList').innerHTML = '';
    document.getElementById('fileList').style.display = 'none';
    document.getElementById('fileCount').style.display = 'none';
    document.getElementById('download').style.display = 'none';
    updateNameCount();
});

function updateNameCount() {
    const nameList = document.getElementById('nameList').value.split('\n').filter(name => name.trim() !== '');
    document.getElementById('nameCount').textContent = `Count: ${nameList.length}`;
}
