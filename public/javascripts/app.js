$(function(){


  	var app = app || {};

	var Word = Backbone.Model.extend({
		defaults: {
			index: 0,
			simplified: '',
			traditional: '',
			pinyin: '',
			definition: '',
			saved: false
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
			'click .save': 'saveCard',
			'click .search': 'searchCard',
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

			console.log('renderin the view', this);
			return this;
		},

		pickFirst: function() {
			var firstWordRendered = this.collection.at(0).toJSON();
			this.$el.html(this.template(firstWordRendered));
			
			// set index to first word 
			this.currentIndex = 0;

			this.render();
		},

		toggleFlipped: function(e) {
			console.log("in flip", e);
			this.$(".flash-card-container").toggleClass("flipped");
		},


		transitionWord: function(word) {
			var el = this.$el,
				that = this;
			el.hide(200, function() {
				el.html(that.template(word.toJSON())).show(200);
			});
		},

		nextWord: function() {
			var nextWord;

			if (this.currentIndex === this.collection.length - 1) {
				nextWord = this.collection.findWhere({index: 0});

				this.currentIndex = 0;
			} else {
				nextWord = this.collection.findWhere({index: this.currentIndex + 1});

				this.currentIndex += 1;
			}

			// TODO: improve UI transition from one word to next
			// this.transitionWord(nextWord);

			this.$el.html(this.template(nextWord.toJSON()));
		},

		prevWord: function() {			
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

		searchCard: function() {
			console.log('searchng..', this);
		
			var searchTerm = $('.search-term').val(),
				foundTerm = null;

			if ( !searchTerm.match(/[a-zA-Z]/gi) ) {
				foundTerm = this.collection.findWhere({ simplified: searchTerm });
			} else {

			}

			if (foundTerm) {
				this.$el.html(this.template(foundTerm.toJSON()));
			} else {

			}
		},

		saveCard: function() {
			console.log('saving', this);
		},

		currentIndex: 0
	});

	app.wordList = new WordCollection();
	app.wordView = new WordView({
		collection: app.wordList
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