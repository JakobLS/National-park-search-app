'use-strict';


function formatQueryParameters(params) {
    // Function for formatting query parameters
    const queryParams = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryParams.join('&');
}

function createNationalParkURL(searchTerm, nbrResults) {
    // Function for creating a URL out of the search term
    // (Feel free to use following api key)
    const params = {
        api_key: "SapS6TPUOVvEA6uWyo43SPGXEEgTiScN2zyPetmS",
        q: searchTerm,
        limit: nbrResults
    };
    const queryString = formatQueryParameters(params);
    return 'https://developer.nps.gov/api/v1/parks' + '?' + queryString;
}

function cleanResponse(response) {
    // Function for cleaning the json response
    const cleaned = [];
    for (let i=0; i<response.length; i++) {
        cleaned.push({name: response[i].fullName,
                      description: response[i].description,
                      url: response[i].url});
    };
    return cleaned;
}

function generateOutputElement(item) {
    // Function for generating the output string
    return `<div class="output-element">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p><a href="${item.url}" target="_blank">${item.url}</a></p>
            </div>`;
}

function generateOutputString(outputList) {
    // Function for generating the output string
    const searchOutput = outputList.map(item => generateOutputElement(item));
    return searchOutput.join("");
}

function displayResults(responseJson) {
    // Function for displaying the results in the DOM
    const cleanedResponse = cleanResponse(responseJson.data);
    console.log(cleanedResponse);
    if (cleanedResponse.length > 0) {
        const outputStr = generateOutputString(cleanedResponse);
        $('.js-output-section').html(outputStr);
    } 
    throw new Error("Could not find any results. Please try another search term.")
}

function getNationalParkHandle(url) {
    // Function for fetching the query
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => alert(`Oops. ${error.message}`));
}

function searchButtonClicked() {
    // Function for dealing when the Search button is clicked
    $('#js-search-form').submit(event => {
        event.preventDefault();
        let searchTerm = $('.js-search-entry').val();
        let nbrResults = $('#js-max-results').val();
        const urlString = createNationalParkURL(searchTerm, nbrResults);
        getNationalParkHandle(urlString);
    });
}


function main() {
    searchButtonClicked();
}

$(main);
