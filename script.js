// variables
const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");

const apiURL = "https://api.lyrics.ovh";

// get input
form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchValue = search.value.trim();


  if (!searchValue) {
    alert("Nothing to search");
  } else {
    beginSearch(searchValue);
  }

});

// create search function
async function beginSearch(searchValue) {
  const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
  const data = await searchResult.json();
  
  displayData(data);

}

// Display Search Result
function displayData(data) {
  result.innerHTML = `
  <ul class="songs">
    ${data.data
      .map(song=> `
      <li>
                  <div>
                  <audio controls class="music">
  <source src="${song.preview}" type="audio/mpeg">
  Your browser does not support the audio element.

  </audio></div>
  <div>
                      <strong><img class="smallpic" src="${song.artist.picture_big}"> ${song.artist.name}</strong> - ${song.title} 
                  </div>
                  <span data-artist="${song.artist.name}" data-songtitle="${song.title}">Lyrics</span>
              </li>`
      )
      .join('')}
  </ul>
`;


}


// get lyrics function
result.addEventListener("click", e => {
  const clickedElement = e.target;

  // check get lyrics button
  if (clickedElement.tagName === "SPAN") {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-songtitle");

     getLyrics(artist, songTitle);
  }
});


async function getLyrics(artist, songTitle) {
  const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);

  const data = await response.json();

  // const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
  // const datapreview = await searchResult.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  console.log("data preview is", data)
  result.innerHTML = `
  <button class="homebutton" onClick="window.location.reload();">Home</button>
  
  <p class="resultheader"><strong>${artist}</strong> - ${songTitle}</p>
  <p>${lyrics}</p>`;
}