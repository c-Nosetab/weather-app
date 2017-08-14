document.addEventListener('DOMContentLoaded', function(event) {
  var app = new Vue({

    el: '#weather',
    data: {
      zipcode: '',
      location: '',
      weatherReport: [],
      cache: {}


    },

    methods: {

      searchZipcode: function() {
        if (this.zipcode != '') {
          this.weatherReport = [];

          if (this.fetch(this.zipcode)) {
            var weatherInfo = this.fetch(this.zipcode)

            for (var i = 0; i < 3; i++) {
                this.weatherReport.push(weatherInfo[i]);
            };

            this.zipcode = '';
          } else {
            $.get('http://api.wunderground.com/api/624c587a66ec60af/forecast/q/' + this.zipcode +'.json', function(list) {

              this.store(this.zipcode, list['forecast']['simpleforecast']['forecastday']);


              for (var i = 0; i < 3; i++) {
                this.weatherReport.push(list['forecast']['simpleforecast']['forecastday'][i]);
              };
              this.zipcode = '';
            }.bind(this)).fail(function(response) {
              console.log('nope');
            }.bind(this));
          }
        }
      },

      showCache: function() {
        console.log(localStorage);
      },

      store: function(zipcode, weather) {
        object = {
          timestamp: Date.now(),
          weather: weather
        };

        localStorage[zipcode] = JSON.stringify(object);
      },

      fetch: function(zipcode) {
        var object = localStorage[zipcode]


        if(object) {
          if (JSON.parse(object).timestamp + 3600000 > Date.now()) {
            return JSON.parse(object).weather;
          } else {
            localStorage.removeItem(zipcode);
            return null;
          }

        } else {
          return null;
        }
      }
    },



  });
})