define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'events',
  'globals/datehandler',
  'globals/activeworkout',
  'globals/historydata',
  'models/weight',
  'views/global/topmessage',
  'views/active/row',
  'text!templates/active/list.html'
], function($, _, Backbone, Vm, Events, DateHandler, ActiveWorkouts, HistoryData, WeightModel, TopMessage, ActiveWorkoutRowView, activeListTemplate) {
  var ActivePage = Backbone.View.extend({
    el : '#page',
    events : {
      'click #add-weight' : 'addWeight'
    },
    initialize : function() {
      this.listenTo(ActiveWorkouts, 'add', this.addOne);
      this.listenTo(ActiveWorkouts, 'latest reset sort', this.reset);
      this.listenTo(Events, 'latest:weight', function(weight) {
        this.latestWeight = weight;
      });
      WeightModel.latest(); // Get latest weight
      $(this.el).html(activeListTemplate);
      sessionStorage.removeItem('savedDate'); // Just to be safe
      this.$('#activeDate').val(DateHandler.toDateTimeLocalString(new Date()));
    },
    reset : function() {
      Events.trigger('activeworkouts:clear');
      this.render();
    },
    render : function() {
      this.addAll();
    },
    addOne : function(workout) {
      var activeWorkoutView = Vm.create('awo_' + workout.cid, ActiveWorkoutRowView, {
        model : workout
      });
      this.$el.find('table tbody:first').append(activeWorkoutView.render().el);
    },
    addAll : function() {
      ActiveWorkouts.each(this.addOne, this);
    },
    addWeight : function() {
      TopMessage.close();
      var weight = 75.0; // default value
      if (_.isFinite(this.latestWeight)) {
        // Use latest as base
        weight = this.latestWeight;
      }
      weight = prompt('Enter weight', weight);
      if (_.isFinite(weight)) {
        HistoryData.create({
          time : DateHandler.parseDateTimeLocalString(this.$('#activeDate').val()).getTime(),
          weight : weight
        }, {
          success : function() {
            // Update latest
            WeightModel.latest();
          },
          error : function(w) {
            w.destroy();
            TopMessage.setError({
              message : 'Failed to save the data on the server.'
            });
          }
        });
      }
    }
  });
  return ActivePage;
});
