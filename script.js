const shelves = [];
let activeShelfIndex = 0;

class Shelf {
    constructor(index) {
        this.index = index;
        this.rows = 8;
        this.cols = 5;
        this.data = [];
        this.selectedColumn = null;
        this.element = this.createShelfElement();
        this.initializeData();
    }

    createShelfElement() {
        const shelf = document.createElement('div');
        shelf.className = 'shelf';
        shelf.id = `shelf-${this.index}`;
        
        for(let i = 0; i < this.rows; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            this.data[i] = [];
            
            for(let j = 0; j < this.cols; j++) {
                const column = document.createElement('div');
                column.className = 'column';
                column.dataset.row = i;
                column.dataset.col = j;
                column.onclick = () => this.selectColumn(column);
                
                this.data[i][j] = [];
                row.appendChild(column);
            }
            shelf.appendChild(row);
        }
        return shelf;
    }

    initializeData() {
        for(let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for(let j = 0; j < this.cols; j++) {
                this.data[i][j] = [];
            }
        }
    }

    selectColumn(column) {
        if(this.selectedColumn) this.selectedColumn.classList.remove('selected');
        this.selectedColumn = column;
        column.classList.add('selected');
        updateCountInfo();
    }
}

// Initialize shelves
function initShelves() {
    const shelfContainer = document.getElementById('shelfContainer');
    const tabContainer = document.getElementById('shelfTabs');

    for(let i = 0; i < 5; i++) {
        const shelf = new Shelf(i);
        shelves.push(shelf);
        shelfContainer.appendChild(shelf.element);

        const tab = document.createElement('button');
        tab.className = `tab${i === 0 ? ' active' : ''}`;
        tab.textContent = `Shelf ${i + 1}`;
        tab.onclick = () => switchShelf(i);
        tabContainer.appendChild(tab);
    }

    shelves[0].element.classList.add('active');
}

function switchShelf(index) {
    shelves[activeShelfIndex].element.classList.remove('active');
    document.querySelectorAll('.tab')[activeShelfIndex].classList.remove('active');
    
    activeShelfIndex = index;
    shelves[index].element.classList.add('active');
    document.querySelectorAll('.tab')[index].classList.add('active');
    updateCountInfo();
}

function insertItem() {
    const shelf = shelves[activeShelfIndex];
    if(!shelf.selectedColumn) return;
    
    const maxItems = parseInt(document.getElementById('maxItems').value);
    const itemName = document.getElementById('itemName').value.trim();
    const row = parseInt(shelf.selectedColumn.dataset.row);
    const col = parseInt(shelf.selectedColumn.dataset.col);
    
    if(shelf.data[row][col].length < maxItems && itemName) {
        const item = document.createElement('div');
        item.className = 'item';
        item.textContent = itemName;
        shelf.selectedColumn.appendChild(item);
        shelf.data[row][col].push(itemName);
        document.getElementById('itemName').value = '';
        updateCountInfo();
    }
}

function updateCountInfo() {
    const shelf = shelves[activeShelfIndex];
    if(!shelf.selectedColumn) {
        document.getElementById('countInfo').textContent = 'No column selected';
        return;
    }
    
    const row = parseInt(shelf.selectedColumn.dataset.row);
    const col = parseInt(shelf.selectedColumn.dataset.col);
    document.getElementById('countInfo').innerHTML = `
        Selected Cell: Row ${row + 1}, Column ${col + 1} - Items: ${shelf.data[row][col].length}
    `;
}

function showAllCounts() {
    const shelf = shelves[activeShelfIndex];
    let table = `<table class="count-table"><tr><th></th>`;
    
    // Create header
    for(let j = 0; j < shelf.cols; j++) {
        table += `<th>Column ${j + 1}</th>`;
    }
    table += '</tr>';
    
    // Create rows
    for(let i = 0; i < shelf.rows; i++) {
        table += `<tr><td>Row ${i + 1}</td>`;
        for(let j = 0; j < shelf.cols; j++) {
            table += `<td>${shelf.data[i][j].length}</td>`;
        }
        table += '</tr>';
    }
    table += '</table>';
    
    document.getElementById('countInfo').innerHTML = table;
}

// Initialize the application
initShelves();
