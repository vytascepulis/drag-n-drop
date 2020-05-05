# Localstorage išsisaugantys sticky notes
Projekto pagrindinis tikslas - praktika su localstorage, elementų saugojimas ir atvaizdavimas, JS mouse eventai.  
Idėja - naudotojas gali sukurti naują lapelį, jį nuslinkti bet kur ekrane, įrašyti žinutę. Išjungus ir įjungus naršyklę lapeliai lieka savo vietose su tuo pačiu turiniu.  
Projekto trukmė trys paros.  
**Baigtą projektą** galima rasti [čia](http://owner-occupied-bag.000webhostapp.com/dragndrop).

## Dizainas
Dizainas pritaikytas desktop naudotojui.  
[Pagrindinis](https://github.com/vytascepulis/drag-n-drop/blob/master/design/first.jpg)  
[Nauja kortelė](https://github.com/vytascepulis/drag-n-drop/blob/master/design/second.jpg)

### Dizaino idėja
Ekrano centre matomas mygtukas su pliusu viduryje. Jį paspaudus atsiranda naujas lapelis su jau sufokusuotu textarea elementu. Naudotojas įrašo žinutę, pasirenka lapelio spalvą ir išsaugo. Lapelis gali būti nutempiamas ant bet kurios ekrano vietos.  
Lapelio aukštis keičiasi nuo turinio dydžio.

## Funkcionalumas
Lapelis negali išlįsti už ekrano kraštų, todėl su *mousemove* nuolatos klausomasi jo tikslios vietos ir lyginama su ekrano dydžiu:  

```
let w = window.innerWidth;
let h = window.innerHeight;
    if (rect.left < 0) { card.style.left = 0; }
    if (rect.right > w) {card.style.left = (w - rect.width) + 'px' };
    if (rect.top < 0) card.style.top = 0;
    if (rect.bottom > h) card.style.top = (h - rect.height) + 'px';
```

### Localstorage išsaugojimas
Kiekvienas lapelis turi *mouseup* event listenerį, kuris invokina update() funkciją. Kai lapelis yra patraukiamas, funkcija paima lapelio kairės, viršaus koordinates, jo id bei contentą ir sudeda į objektą *note*, kuris yra paverčiamas į JSON ir įdedamas į localstorage:  

```
const left = this.style.left;
const top = this.style.top;
const id = this.getAttribute('id');
const content = this.innerHTML;
let note = {
    "content": content,
    "id": id,
    "top": top,
    "left": left
}
let str = JSON.stringify(note);
localStorage.setItem(id, str);
```

### Localstorage atvaizdavimas
[app.js](https://github.com/vytascepulis/drag-n-drop/blob/master/app.js) failo pirmoji eilutė invokina getPosts() funkciją, kuri paima visus elementus iš localstorage, juos 'praloopina', ištraukia iš JSON ir atvaizduoja su tinkamu id bei innerHTML. Kortelės atvaizduojamos pačiame *body* priekyje su body.innerHTML visišku pakeitimu bei viso innerHTML pridėjimu pabaigoj.  
Nerodomi elementai, kurių *key* yra undefined. Hostas turi du elementus, kuriuos saugo localstorage.  

```
let notes = Object.values(localStorage);
    notes.forEach(note => {
        let org = JSON.parse(note);
        if (org.id !== undefined) {
            document.body.innerHTML = `
            <div class="card" id="${org.id}" style="left:${org.left}; top:${org.top}">${org.content}</div>
            ` + document.body.innerHTML;
        }
    });
```

### Ištrinimas iš DOM ir localstorage
Visi lapeliai yra saugomi tiek localstorage tiek masyve "cards" (su querySelectorAll surenkami visi .card elementai). Localstorage skirtas tam, kad išsaugotų atmintyje, o masyvas - kad pasiektų DOM. Čia yra didžiausias aplikacijos "loop hole":  


tarkim yra sukuriamos trys kortelės (jų id = 0, 1, 2), išsaugojamos localstorage atmintyje. Atvėrus programą iš naujo, kortelės atvaizduojamos teisingai. Ištrynus antrą kortelę (su id = 1), localstorage lieka tik id = 0, 2. Kai yra sukuriama nauja kortelė, jos id yra nusprendžiamas pagal masyvo DOMe ilgį (length). Vadinasi, sukūrus naują kortelę, jos id bus 2 ir taip tiesiog atnaujins kortelę, esančią localstorage, su id = 2.

## Galimybės plėsti arba tobulinti
* Sinchronizuoti DOM *cards* array su localstorage elementais deletePost() funkcijoje  
* Mobili versija  

### Iš dizaino pusės: 
* Sukuriant lapelį, suteikti random rotate laipsnius
* Galimybė keisti lapelių background-color
* .card CSS savybė *hover* scale(1.2) su transition