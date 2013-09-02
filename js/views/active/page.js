define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'events',
  'globals/activeworkout',
  'globals/historydata',
  'models/weight',
  'views/active/row',
  'text!templates/active/list.html'
], function($, _, Backbone, Vm, Events, ActiveWorkouts, HistoryData, WeightModel, ActiveWorkoutRowView, activeListTemplate) {
  var ActivePage = Backbone.View.extend({
    el : '#page',
    events : {
      'click #add-weight' : 'addWeight'
    },
    initialize : function() {
      // TODO Move date select to this page?
      this.listenTo(ActiveWorkouts, 'add', this.addOne);
      this.listenTo(ActiveWorkouts, 'latest reset sort', this.reset);
      this.listenTo(Events, 'latest:weight', function(weight) {
        this.latestWeight = weight;
      });
      WeightModel.latest(); // Get latest weight
      $(this.el).html(_.template(activeListTemplate));
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
      var weight = 75.0; // default value
      if (_.isFinite(this.latestWeight)) {
        // Use latest as base
        weight = this.latestWeight;
      }
      weight = prompt('Enter weight', weight);
      var newDate = new Date();
      if (_.isFinite(weight)) {
        HistoryData.create({
          time : newDate.getTime(),
          weight : weight
        });
      }
    }
  });
  return ActivePage;
});
