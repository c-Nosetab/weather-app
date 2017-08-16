document.addEventListener('DOMContentLoaded', function(event) {
  var app = new Vue({

    el: '#weather',
    data: {
      zipcode: '',
      location: '',
      weatherReport: [],

      lastSearch: 0,
      loading: false,
      cache: {},
      errors: []


    },

    methods: {

      tooFast: function(now) {
        if (this.lastSearch + 2000 > now) {
          this.errors = ['You\'re requesting too often! Wait at least 2 seconds'];
        } else {
          this.errors = [];
          this.searchZipcode()
        };
      },

      searchZipcode: function() {
        this.errors = ['Zipcode cannot be blank.', 'Zipcode must be 5 numbers. IE: 60622' ]

        if (this.zipcode != '') {
          this.weatherReport = [];
          this.loading = true;
          this.errors = []
          this.lastSearch = Date.now()

          if (this.fetch(this.zipcode)) {
            var weatherInfo = this.fetch(this.zipcode)

            for (var i = 0; i < 3; i++) {
              this.weatherReport.push(weatherInfo[i]);
            };

            this.zipcode = '';
            this.loading = false;
          } else {
            $.get('http://api.wunderground.com/api/624c587a66ec60af/forecast/q/' + this.zipcode +'.json', function(list) {

              if (list['forecast']) {
                this.store(this.zipcode, list['forecast']['simpleforecast']['forecastday']);
                for (var i = 0; i < 3; i++) {
                  this.weatherReport.push(list['forecast']['simpleforecast']['forecastday'][i]);
                };
              } else if (list['response']){
                this.errors = ['Zipcode must be 5 numbers. IE: 60622', list['response']['error']['description']]
              };

              this.zipcode = '';
              this.loading = false;

            }.bind(this))
          }
        }
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
          };
        } else {
          return null;
        };
      }
    },



  });
})