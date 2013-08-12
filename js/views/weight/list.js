define([ 'jquery', 'underscore', 'backbone', 'collections/weight', 'text!templates/weight/list.html' ], function($, _, Backbone, WeightCollection, weightListTemplate) {
  var WeightListPage = Backbone.View.extend({
    el : '#page',
    render : function() {
      var self = this;
      var weight = new WeightCollection();
      weight.fetch({
        success : function(weights) {
          $(self.el).html(_.template(weightListTemplate, {
            weights : weights.models
          }));
        }
      });
    }
  });
  return WeightListPage;
});