let weather = {
    fetchWeather: function (city) {
        const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${city}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '87ea4d3321msh860880726043332p1db060jsnf40a386d1318',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };
        fetch(url, options)
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        console.log(data);
        const name  = data.location.name;
        const icon = data.current.condition.icon;
        const description = data.current.condition.text;
        const temp = data.current.temp_f;
        const humidity = data.current.humidity;
        const speed = data.current.wind_mph;
        console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = `Weather in ${name}`;
        document.querySelector(".temp").innerText = `${temp}°`;
        document.querySelector(".icon").src = icon;
        document.querySelector(".description").innerText = description;
        document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
        document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = `url('https://source.unsplash.com/random/1600x900/?${name}')`;
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

let geocode = {
    getLoc: function () {
        const url = 'https://weatherapi-com.p.rapidapi.com/ip.json?q=auto%3Aip';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '87ea4d3321msh860880726043332p1db060jsnf40a386d1318',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };
        fetch(url, options)
            .then((response) => response.json())
            .then((data) => weather.fetchWeather(data.city));
    },
}

document.querySelector(".search button")
    .addEventListener("click", function () {
        weather.search();
    });

document.querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key == "Enter") {
            weather.search();
        }
    });

geocode.getLoc();

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

const cities = [];

readTextFile("./cities.json", function (text) {
    var data = JSON.parse(text);
    for (let i = 0; i < data.length; i++) {
        cities[i] = data[i].name;
    }
});

const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

let suggBox = document.querySelector(".autocom-box");
let searchBar = document.querySelector(".search-bar");
const searchWrapper = document.querySelector(".wrapper");

searchBar.onkeyup = debounce((e) => {
    let userData = e.target.value;
    let emptyArray = [];

    if (userData) {
        document.querySelector(".search button")
            .addEventListener("click", function () {
                weather.search();
            });
        document.querySelector(".search-bar")
            .addEventListener("keyup", function (event) {
                if (event.key == "Enter") {
                    weather.search();
                }
            });
        emptyArray = cities.filter((data) => {
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });
        emptyArray = emptyArray.map((data) => {
            return data = `<li>${data}</li>`;
        });
        searchWrapper.classList.add("active");
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            allList[i].setAttribute("onclick", "select(this)");
        }
    } else {
        searchWrapper.classList.remove("active");
    }
}, 500);

function select(element) {
    let selectData = element.textContent;
    searchBar.value = selectData;

    weather.search();

    document.querySelector(".search button")
        .addEventListener("click", function () {
            weather.search();
        });

    document.querySelector(".search-bar")
        .addEventListener("keyup", function (event) {
            if (event.key == "Enter") {
                weather.search();
            }
        });

    searchWrapper.classList.remove("active");
}

function showSuggestions(list) {
    let listData;

    if (!list.length) {
        userValue = searchBar.value;
        listData = `<li>${userValue}</li>`;
    } else {
        listData = list.join('');
    }

    suggBox.innerHTML = listData;
}