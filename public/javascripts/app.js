$(function(){


  	var app = app || {};

	var Word = Backbone.Model.extend({
		defaults: {
			index: 0,
			simplified: '',
			traditional: '',
			pinyin: '',
			definition: ''
		},

		initialize: function() {

	      	var pinyinNum = this.get("pinyin_num").match(/[0-9]/);
	      	if (pinyinNum && pinyinNum. length > 0) {
	      		this.set("pinyin", this.get("pinyin") + pinyinNum);
	      	}

	      // this.simplified = params['simplified'];
	      // self.traditional = params['traditional'];
	      // self.pinyin = params['pinyin'];
	      // self.pinyin_accent_raw = params['pinyin_num'];
	      // self.definition = params['definition'];

	      // var accent = self.pinyin_accent_raw.match(/[0-9]/);

	      // if (accent && accent.length > 0) {
	      //   self.pinyin += accent[0];
	      // }
		}

	});


	var WordCollection = Backbone.Collection.extend({
		model: Word,
		url: '/javascripts/hanban.json'
	});

	var WordView = Backbone.View.extend({
		el: '#flashcard-app',

		// tagName: 'div',

// 		template: _.template($('#flashcard-template').html()),

		events: {
			'click .prev' : 'prevWord',
			'click .next': 'nextWord',
			'click .flipper': 'toggleFlipped'
		},

		initialize: function() {
			this.template = _.template($('#flashcard-template').html());
			this.listenTo(this.collection, 'reset', this.pickFirst, this);
			this.collection.fetch({reset: true});

		},

		render: function() {
			// var rendered = this.collection.toJSON();
			
			// this.$el.html(this.template(rendered.at(0)));

			this.collection.each(function(model, idx){

				model.set("index", idx);
			});
			return this;
		},

		pickFirst: function() {
			var firstWordRendered = this.collection.at(0).toJSON();
			//console.log("firstword", firstWord);
			//console.log("firstword", firstWord.toJSON());
			this.$el.html(this.template(firstWordRendered));
			
			// set index to first word 
			this.currentIndex = 0;

			this.render();
		},

		toggleFlipped: function(e) {
			console.log(e);
			console.log("in flip");
			this.$(".flash-card-container").toggleClass("flipped");
		},

		nextWord: function() {
			console.log('in next');
			var nextWord;

			if (this.currentIndex === this.collection.length - 1) {
				nextWord = this.collection.findWhere({index: 0});

				this.currentIndex = 0;
			} else {
				nextWord = this.collection.findWhere({index: this.currentIndex + 1});

				this.currentIndex += 1;
			}

			this.$el.html(this.template(nextWord.toJSON()));
		},

		prevWord: function() {
			console.log('in prev');
			
			var nextWord;

			if (this.currentIndex === 0) {
				nextWord = this.collection.findWhere({index: this.collection.length - 1});

				this.currentIndex = this.collection.length - 1;
			} else {
				nextWord = this.collection.findWhere({index: this.currentIndex - 1});

				this.currentIndex -= 1;
			}

			this.$el.html(this.template(nextWord.toJSON()));
		},

		currentIndex: 0
	});

	var wordList = new WordCollection();
	var wordView = new WordView({
		collection: wordList
	});


	$('body').delegate('.flash-card-container', 'swipeleft', function(e) {
		e.preventDefault();
		$('.next').trigger('click');
	});

	$('body').delegate('.flash-card-container', 'swiperight', function(e) {
		e.preventDefault();
		$('.prev').trigger('click');
	});

});