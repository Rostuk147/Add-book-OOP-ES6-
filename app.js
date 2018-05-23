
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

let testIndex = 0;
class Ui{
    addBookToList(book){
        testIndex++
        const list =  document.getElementById('book-list');
        const tr = document.createElement('tr');
        tr.setAttribute('id', `id${testIndex}`)
        tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `
        list.appendChild(tr) 
    }

    showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
    
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
    
        container.insertBefore(div, form);
    
        setTimeout(()=> {
            document.querySelector('.alert').remove();
        }, 2000)
    }

    clearFields(){
        document.getElementById('title').value = '',
        document.getElementById('author').value = '',
        document.getElementById('isbn').value= ''
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
            const ui = new Ui();
            ui.showAlert('Book deleted', 'success');

            const booksArr = Store.getBooks();
            let element = target.parentNode.closest('tr');
            let elemtId = element.getAttribute('id').split('')[2] -1;
            Store.removeBook(elemtId);
        }
    }
}



class Store{
    constructor(){}

    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(book => {
            const ui = new Ui();
            ui.addBookToList(book)
        });
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(index){
        const books = Store.getBooks();
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
        console.log(Store.getBooks())
    }
}


document.addEventListener('DOMContentLoaded', Store.displayBooks);

document.getElementById('book-form').addEventListener('submit', function(e){
    const   title = document.getElementById('title').value,
            author = document.getElementById('author').value,
            isbn = document.getElementById('isbn').value

    const book = new Book(title, author, isbn); 

    const ui = new Ui();
    if( title === '' || author === '' || isbn === '' ){
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        ui.addBookToList(book);
        Store.addBook(book);
        ui.showAlert('Book Added!', 'success')
        ui.clearFields();
    }
    e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', (e)=>{
    const ui = new Ui();
    ui.deleteBook(e.target);
    e.preventDefault();
})