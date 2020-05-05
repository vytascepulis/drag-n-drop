getPosts();

const addBtn = document.querySelector('.btn');
let cards = Array.from(document.querySelectorAll('.card'));
let closes = Array.from(document.querySelectorAll('.close'));

addBtn.addEventListener('click', () => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.setAttribute('id', cards.length);
    div.style.left = '43%';
    div.style.top = '35%';

    div.innerHTML = `<div class="close">x</div>
                    <div class="card-content" contenteditable></div>`;
    document.body.insertAdjacentElement('afterbegin', div);
    cards.push(div);

    div.addEventListener('mousedown', mousedown);
    div.addEventListener('mouseup', update);
    div.children[0].addEventListener('click', function() { deletePost(div); });
    div.addEventListener('onfocusout', update);
})

cards.forEach(card => {
    card.addEventListener('mousedown', mousedown);
    card.addEventListener('mouseup', update);
    card.addEventListener('onfocusout', update);
    let closes = Array.from(card.children);
    closes[0].addEventListener('click', function() { deletePost(card); }
    );
});


function update() {
    const left = this.style.left;
    const top = this.style.top;
    const id = this.getAttribute('id');
    const content = this.innerHTML;
    let note = {
        "content": content,
        "id": id,
        "top": top,
        "left": left,
    }
    let str = JSON.stringify(note);
    localStorage.setItem(id, str);
}

function getPosts() {  
    let notes = Object.values(localStorage);
    // console.log(Number.isInteger(Object.values(localStorage)));
    console.log(Object.values(localStorage));
    notes.forEach(note => {
        let org = JSON.parse(note);
        if (org.id !== undefined) {
        document.body.innerHTML = `
        <div class="card" id="${org.id}" style="left:${org.left}; top:${org.top}">${org.content}</div>
        ` + document.body.innerHTML;
        }
    });
}

function deletePost(card) {
    let i = card.getAttribute('id');
    let index = cards.indexOf(card);
    cards.splice(index, 1);

    console.log('deleting id: ' + i);
    console.log(cards);
    
    document.getElementById(`${i}`).remove();
    localStorage.removeItem(`${i}`);
}

function mousedown(e) {
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    let prevX = e.clientX;
    let prevY = e.clientY;
    let card = this;

    function mousemove(e) {
        let newX = prevX - e.clientX;
        let newY = prevY - e.clientY;

        const rect = card.getBoundingClientRect();

        card.style.left = rect.left - newX + 'px';
        card.style.top = rect.top - newY + 'px';

        prevX = e.clientX;
        prevY = e.clientY;
        
        // detect collision
        let w = window.innerWidth;
        let h = window.innerHeight;
        if (rect.left < 0) { card.style.left = 0; }
        if (rect.right > w) {card.style.left = (w - rect.width) + 'px' };
        if (rect.top < 0) card.style.top = 0;
        if (rect.bottom > h) card.style.top = (h - rect.height) + 'px';
    }

    function mouseup() {
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
}

