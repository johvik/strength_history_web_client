define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  var ExerciseModel = Backbone.Model.extend({
    idAttribute : '_id',
    urlRoot : '/exercise',
    validate : function(attributes) {
      var exerciseName = attributes.name;
      var standardIncrease = attributes.standardIncrease;
      var len = exerciseName.length;
      var invalidName = !(len >= 1 && len <= 64);
      var invalidStandardIncrease = !_.isFinite(standardIncrease);
      if (invalidName || invalidStandardIncrease) {
        return {
          str : 'Invalid exercise attributes: ' + exerciseName + ' ' + standardIncrease,
          name : invalidName,
          standardIncrease : invalidStandardIncrease
        };
      }
    },
    initialize : function() {
      this.bind('invalid', function(model, error) {
        console.log(error);
      });
    },
    latest : function() {
      if (!_.isUndefined(this.id)) {
        var _self = this;
        Backbone.ajax('/exercise/latest/' + this.id, {
          success : function(data) {
            var res = _.find(data.data, function(d) {
              return d.exercise == _self.id;
            });
            if (!_.isUndefined(res)) {
              _self.set({
                latest : res.sets
              });
              _self.trigger('latest:exercise', _self);
            }
          },
          error : function() {
            _self.unset('latest');
            _self.trigger('latest:exercise');
          }
        });
      }
    },
    bestLatest : function() {
      var latest = this.get('latest');
      if (_.isArray(latest)) {
        var best = _.reduce(latest, function(memo, i) {
          if (memo) {
            if (i.weight > memo.weight) {
              return i;
            } else if (i.weight == memo.weight) {
              if (i.reps > memo.reps) {
                return i;
              }
            }
            return memo;
          }
          return i;
        }, undefined);
        return best;
      }
    }
  });
  return ExerciseModel;
});
