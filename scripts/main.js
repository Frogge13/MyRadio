window.addEventListener("load", () => {
  borstiUrl = "http://borsti.inf.fh-flensburg.de/dirble/getDirbleCORS.php"
  let contentdiv = document.getElementById("content");

  let select_genre = document.createElement("SELECT");
  let xhr_genre = new XMLHttpRequest();
  let dirble_genre = "?dirbleRequest=http://api.dirble.com/v2/categories";

  let select_cntry = document.createElement("SELECT");
  let xhr_cntry = new XMLHttpRequest();
  let dirble_cntry = "?dirbleRequest=http://api.dirble.com/v2/countries";

  let xhr_search = new XMLHttpRequest();

  xhr_genre.open("GET", borstiUrl+dirble_genre);
  xhr_genre.send();

  xhr_cntry.open("GET", borstiUrl+dirble_cntry);
  xhr_cntry.send();



  xhr_genre.onreadystatechange = () => {
    if (xhr_genre.readyState === 4) { // DONE
      if (xhr_genre.status === 200) { //DONE
        let genreObj = JSON.parse(xhr_genre.responseText);
        for (var i in genreObj) {
          let option = document.createElement("option");
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
        for (var i in cntryObj) {
          let option = document.createElement("option");
          option.text = cntryObj[i].name;
          select_cntry.add(option);
        }
      }
    }
  }
  contentdiv.appendChild(select_genre);
  contentdiv.appendChild(select_cntry);
  document.getElementById("searchBtn").addEventListener("click", () => {

    console.log(contentdiv.hasNextChild());

    xhr_search.open("GET", borstiUrl+"?dirbleRequest=http://api.dirble.com/v2/stations/popular");
    xhr_search.send();

    xhr_search.onreadystatechange = () => {
      if (xhr_search.readyState === 4) {
        if (xhr_search.status === 200) {
          let searchObj = JSON.parse(xhr_search.responseText);
          for (var i in searchObj) {
            {
              let div = document.createElement("div");
              let img = document.createElement("img");
              img.src = ""+searchObj[5].image.thumb.url+"";
              img.alt = "FEHLER";
              div.appendChild(img);
              let label = document.createElement("label");
              label.value = "test";

              contentdiv.appendChild(div);
            }
          }
        }
      }
    }
  });
});
