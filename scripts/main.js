"use strict";
window.addEventListener("load", () => {

  let borstiUrl = "http://borsti.inf.fh-flensburg.de/dirble/getDirbleCORS.php"
  let contentdiv = document.getElementById("content");
  let searchdiv = document.getElementById("search");

  //----------------Select für Genre-------------------------------------------
  let select_genre = document.createElement("SELECT");
  let xhr_genre = new XMLHttpRequest();
  let dirble_genre = "?dirbleRequest=http://api.dirble.com/v2/categories";
  let defaultoptiongenre = document.createElement("option");

  //----------------Select für Countries---------------------------------------
  let select_cntry = document.createElement("SELECT");
  let xhr_cntry = new XMLHttpRequest();
  let dirble_cntry = "?dirbleRequest=http://api.dirble.com/v2/countries";
  let defaultoptioncntry = document.createElement("option");

  defaultoptiongenre.text = "---";
  defaultoptioncntry.text = "---";
  select_cntry.add(defaultoptioncntry);
  select_genre.add(defaultoptiongenre);

  let xhr_search = new XMLHttpRequest();

//------------------- Requests für alle Länder und Genres-----------------
  xhr_genre.open("GET", borstiUrl+dirble_genre);
  xhr_genre.send();

  xhr_cntry.open("GET", borstiUrl+dirble_cntry);
  xhr_cntry.send();

  xhr_genre.onreadystatechange = () => {
    if (xhr_genre.readyState === 4) { // DONE
      if (xhr_genre.status === 200) { //DONE
        let genreObj = JSON.parse(xhr_genre.responseText);
        genreObj = genreObj.sort(function(a, b) {
          const textA = a.title.toUpperCase();
          const textB = b.title.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        for (let i in genreObj) {
          let option = document.createElement("option");
          option.dataset.id = genreObj[i].id;
          option.text = genreObj[i].title;
          select_genre.add(option);
        }
      }
    }
  }
  xhr_cntry.onreadystatechange = () => {
    if (xhr_cntry.readyState === 4) { // DONE
      if (xhr_cntry.status === 200) { //DONE
        let cntryObj = JSON.parse(xhr_cntry.responseText);
        cntryObj = cntryObj.sort(function(a, b) {
          const textA = a.name.toUpperCase();
          const textB = b.name.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        for (var i in cntryObj) {
          let option = document.createElement("option");
          option.text = cntryObj[i].name;
          option.dataset.country_code = cntryObj[i].country_code;
          select_cntry.add(option);
        }
      }
    }
  }
  //----------------- Selects anzeigen------------------------------------------
  searchdiv.appendChild(select_genre);
  searchdiv.appendChild(select_cntry);

  //---------------- EventListener für die Select Suche-------------------------
  select_genre.addEventListener("change", (e) => {
    select_cntry.value = "---"; //Wird auf Default gesetzt, da nur nach einem Kriterum gesucht werden kann
    if (select_genre.value != "---") {
      xhr_search.open("GET", borstiUrl+"?dirbleRequest=http://api.dirble.com/v2/category/"+select_genre.options[select_genre.selectedIndex].dataset.id+"/stations");
      xhr_search.send();
      xhr_search.onreadystatechange = () => {
        if (xhr_search.readyState === 4) {
          if (xhr_search.status === 200) {
            showStations(JSON.parse(xhr_search.responseText));
          }
        }
      }
    }
  });

  select_cntry.addEventListener("change", (e) => {
    select_genre.value = "---"; //Wird auf Default gesetzt, da nur nach einem Kriterum gesucht werden kann
    if (select_cntry.value != "---") {
      xhr_search.open("GET", borstiUrl+"?dirbleRequest=http://api.dirble.com/v2/countries/"+select_cntry.options[select_cntry.selectedIndex].dataset.country_code+"/stations");
      xhr_search.send();
      xhr_search.onreadystatechange = () => {
        if (xhr_search.readyState === 4) {
          if (xhr_search.status === 200) {
            showStations(JSON.parse(xhr_search.responseText));
          }
        }
      }
    }

  });
//---- Allgemeine Funktion um StationObjekte im Content anzuzeigen------------
  function showStations(stationObject){
    contentdiv.innerHTML = ""; // Contentbereich leeren
    for (var i in stationObject) {
      {
        //---------------- Elemente zur Visualisierung der Stations------------
        let wrapper = document.createElement("div");
        let img = document.createElement("img");
        let spanName = document.createElement("span");
        let spanCntry = document.createElement("span");
        let spanGenre = document.createElement("span");
        let end; //wird benötigt um zu viele Kategorien auf ein minimun zu reduzieren
        if (stationObject[i].categories.length > 3) {
          end = 3;
        } else {
          end = stationObject[i].categories.length;
        }
        let streamBtn = document.createElement("Button");
        let select_fav = document.createElement("select"); // Auswahl mit allen Favoritenlisten
        let defaultoptionfav = document.createElement("option");
        //---------------- Elemente mit Werten füllen ------------------------
        wrapper.dataset.object = JSON.stringify(stationObject[i]); //Das gesamte StationObject wird zwischengespeichert für die spätere Verwendung
        img.src = ""+stationObject[i].image.thumb.url+"";
        //img.alt = "noImage.png";
        img.classList.add("thumbnail"); // Das Thumbnail wird auf 100x100px beschränkt
        spanName.innerText = stationObject[i].name;
        spanCntry.innerText = stationObject[i].country;
        for (let j = 0; j < end; j++) {
          spanGenre.innerText += stationObject[i].categories[j].title+", ";
        }
        streamBtn.innerText = "Play";
        defaultoptionfav.text = "Zur Liste hinzufügen";
        select_fav.add(defaultoptionfav);
        for (let k = 0; k < document.getElementById("favoritenListe").getElementsByTagName("li").length; k++) {
          let option = document.createElement("option");
          option.text = document.getElementById("favoritenListe").getElementsByTagName("li")[k].innerText;
          select_fav.add(option);
        }
//------------- Event um einen Stream zu spielen------------------------------------------------------------------------
        streamBtn.addEventListener("click", (e) => {
          document.getElementById("audioelement").src = JSON.parse(e.path[1].dataset.object).streams[0].stream;
          document.getElementById("audioelement").play();
        });
//------------- Event um eine Station in einem Favoriten zu speichern --------------------------------------------------
        select_fav.addEventListener("change", (e) => {
          let liElement = document.getElementById("favoritenListe").getElementsByTagName("li")[e.srcElement.options.selectedIndex-1]; //li-Element identifizieren
          if (liElement.dataset.favObject == undefined) { //undefined muss überschrieben werden
            let array = [];
            array[0] = JSON.parse(e.path[1].dataset.object); // der Dataset aus dem entsprechenden Wrapper-Div wird als Object gespeichert
            liElement.dataset.favObject = JSON.stringify(array); // das Array wird im FavoritenListenElement in der Sidebar gespeichert
          }else { // Hier werden die weiteren Stations als Objecte hinzugefügt
            let array = JSON.parse(liElement.dataset.favObject);
            array[array.length] = JSON.parse(e.path[1].dataset.object);
            liElement.dataset.favObject = JSON.stringify(array);
          }
        });
//-------------- Elemente anzeigen ---------------------------------------
        wrapper.appendChild(img);
        wrapper.appendChild(spanName);
        wrapper.appendChild(spanCntry);
        wrapper.appendChild(spanGenre);
        wrapper.appendChild(streamBtn);
        wrapper.appendChild(select_fav);
        contentdiv.appendChild(wrapper);
      }
    }
  }
//-------------------EventListener um eine Liste hinzuzufügen--------------
  document.getElementById("addListBtn").addEventListener("click", () =>{
    let favName = prompt("Bitte Namen für neue Favoritenliste eingeben")
    if (favName != "" && favName != null) {
      let favItem = document.createElement("li");
      favItem.innerText = favName;
      //------------- Eventlistener um die Favoritenliste anzuzuzeigen------
      favItem.addEventListener("click", (e) => {
        showStations(JSON.parse(e.target.dataset.favObject));
      });
      document.getElementById("favoritenListe").appendChild(favItem);
    }
  });
});
