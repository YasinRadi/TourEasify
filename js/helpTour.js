'use strict';

/**
 *  Base file getting path.
 */
const BASE_PATH = '';

/**
 *  Defualt HTML template.
 */
const DEFAULT_TEMPLATE = "<div class='popover tour'>"
  + "<div class='arrow'></div>"
  + "<h3 class='popover-title'></h3>"
  + "<div class='popover-content'></div>"
  + "<div class='popover-navigation'>"
  + "<button class='btn btn-default' data-role='prev'>Prev</button>"
  + "<button class='btn btn-default' data-role='next'>Next</button>"
  + "</div>"
  + "<button class='btn btn-default' data-role='end'>End tour</button>"
  + "</div>";

/**
 *  Help Tour Active Language Instance.
 */
var lang = 'en';

function HelpTour() {};

/**
 *  Gets the active language.
 */
HelpTour.setLang = function(lg) {
    lang = lg.toUpperCase();
};

/**
 *  Creates a new tour initialized with the id and the data fed from the
 *  config file.
 *  @param id {String}
 *  @param selector {String}
 */
HelpTour.newTour = function(id, selector) {

  /**
   *  New tour init.
   */
  var tour = new Tour({
      name: id,
      steps: [],
      template: DEFAULT_TEMPLATE
  });

  /**
   *  Config file retrieving, tour init and event attaching.
   */
  HelpTour.getFile(id, function(data) {
      var config = JSON.parse(data);

      /**
       *  Tour and steps initialization.
       */
      HelpTour.initTour(tour, config.steps, DEFAULT_TEMPLATE);

      /**
       *  Attaches the click event for the tour to start using the given selector.
       */
      $(selector).on('click', function(e) {
           tour.init().start(true);
           tour.goTo(0);
      });
  });
};

/**
 *  Retrieves a config file data using its name | id.
 *  @param id {String}
 *  @param callback {Function}
 */
HelpTour.getFile = function(id, callback) {
    var file = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", BASE_PATH + id + '_' + lang + '.tour', true);
    rawFile.onreadystatechange = function() {
        if (file.readyState === 4 && file.status === 200) {
            callback(file.responseText);
        } else {
          console.log('HTTP Error: ' + file.status + ' ' + file.statusText);
        }
    }
    file.send(null);
};

/**
 *  Sets the steps' template if not set.
 *  @param tour {Tour}
 *  @param tmpl {String|HTML}
 */
HelpTour.setupTemplates = function(tour, tmpl) {
    var steps = tour._options.steps;
    Object.keys(steps).map(function(k, v) {
        Object.keys(steps[k]).map(function(i, val) {
            if(i.match(/^template/)) {
                steps[k][i] = steps[k][i] === '' ? tmpl : steps[k][i];
            }
        });
    });
};

/**
 *  Adds the steps to the tour.
 *  @param tour {Tour}
 *  @param steps {Array}
 */
HelpTour.addSteps = function(tour, steps) {
    steps.forEach(function(s){
        tour.addStep(s);
    });
};

/**
 *  Initializes the tour and steps structures.
 *  @param tour {Tour}
 *  @param steps {Array}
 *  @param template {String|HTML}
 */
HelpTour.initTour = function(tour, steps, template) {

    /**
     *  Adds all steps to the tour.
     */
    HelpTour.addSteps(tour, steps);

    /**
     *  Sets up steps' templates.
     */
    HelpTour.setupTemplates(tour, template);
};
