"use strict";
window.addEventListener("load", () => {

  let borstiUrl = "http://borsti.inf.fh-flensburg.de/dirble/getDirbleCORS.php"
  let contentdiv = document.getElementById("content");
  let searchdiv = document.getElementById("search");

  let select_genre = document.createElement("SELECT");
  let xhr_genre = new XMLHttpRequest();
  let dirble_genre = "?dirbleRequest=http://api.dirble.com/v2/categories";
  let defaultoptiongenre = document.createElement("option");
  defaultoptiongenre.text = "---";

  let select_cntry = document.createElement("SELECT");
  let xhr_cntry = new XMLHttpRequest();
  let dirble_cntry = "?dirbleRequest=http://api.dirble.com/v2/countries";
  let defaultoptioncntry = document.createElement("option");
  defaultoptioncntry.text = "---";

  select_cntry.add(defaultoptioncntry);
  select_genre.add(defaultoptiongenre);

  let xhr_search = new XMLHttpRequest();

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
  searchdiv.appendChild(select_genre);
  searchdiv.appendChild(select_cntry);

  select_genre.addEventListener("change", (e) => {

    select_cntry.value = "---";

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

    select_genre.value = "---";

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

  document.getElementById("searchBtn").addEventListener("click", () => {

    xhr_search.open("GET", borstiUrl+"?dirbleRequest=http://api.dirble.com/v2/stations/popular");
    xhr_search.send();

    xhr_search.onreadystatechange = () => {
      if (xhr_search.readyState === 4) {
        if (xhr_search.status === 200) {
          let searchObj = JSON.parse(xhr_search.responseText);
          let div_array = [];
          for (var i in searchObj) {
            {
              div_array[i] = document.createElement("div");
              let img = document.createElement("img");
              img.classList.add("thumbnail");
              img.src = ""+searchObj[i].image.thumb.url+"";
              img.alt = "FEHLER";
              div_array[i].appendChild(img);
              contentdiv.appendChild(div_array[i]);
            }
          }
        }
      }
    }
  });

  function showStations(stationObject){

    contentdiv.innerHTML = "";
    let end = 0;
    console.log(stationObject);
    for (var i in stationObject) {
      {
        let wrapper = document.createElement("div");
        wrapper.dataset.object = JSON.stringify(stationObject[i]);
        let img = document.createElement("img");
        img.src = ""+stationObject[i].image.thumb.url+"";
        img.alt = "FEHLER";
        img.classList.add("thumbnail");
        let spanName = document.createElement("span");
        spanName.innerText = stationObject[i].name;
        let spanCntry = document.createElement("span");
        spanCntry.innerText = stationObject[i].country;
        let spanGenre = document.createElement("span");
        if (stationObject[i].categories.length > 3) {
          end = 3;
        } else {
          end = stationObject[i].categories.length;
        }
        for (let j = 0; j < end; j++) {
          spanGenre.innerText += stationObject[i].categories[j].title+", ";
        }
        let streamBtn = document.createElement("Button");
        streamBtn.innerText = "Play";
        streamBtn.addEventListener("click", (e) => {
          document.getElementById("audioelement").src = JSON.parse(e.path[1].dataset.object).streams[0].stream;
          console.log(e.path[1].dataset.object);
          document.getElementById("audioelement").play();
        });

        let select_fav = document.createElement("select");
        let defaultoptionfav = document.createElement("option");

        defaultoptionfav.text = "Zur Liste hinzufügen";
        select_fav.add(defaultoptionfav);

        for (let k = 0; k < document.getElementById("favoritenListe").getElementsByTagName("li").length; k++) {
          let option = document.createElement("option");
          option.text = document.getElementById("favoritenListe").getElementsByTagName("li")[k].innerText;
          select_fav.add(option);
        }

        select_fav.addEventListener("change", (e) => {
          let liElement = document.getElementById("favoritenListe").getElementsByTagName("li")[e.srcElement.options.selectedIndex-1]; //li-Element identifizieren

          if (liElement.dataset.favObject == undefined) { //undefined muss überschrieben werden
            let array = [];
            array[0] = JSON.parse(e.path[1].dataset.object);
            liElement.dataset.favObject = JSON.stringify(array);
          }else {
            let array = JSON.parse(liElement.dataset.favObject);
            array[array.length] = JSON.parse(e.path[1].dataset.object);
            liElement.dataset.favObject = JSON.stringify(array);
          }
        });

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

  document.getElementById("addListBtn").addEventListener("click", () =>{
    let favName = prompt("Bitte Namen für neue Favoritenliste eingeben")
    if (favName != "" && favName != null) {
      let favItem = document.createElement("li");
      favItem.innerText = favName;
      document.getElementById("favoritenListe").appendChild(favItem);
    }
  });

});
