document.onload = init();

function init() {
	var i = 0,
		k = 0,
		textarea = document.getElementById("text"),
		preview = document.getElementById("preview"),
		converter = new Markdown.Converter(),
		isPreviewActive = false,
		words = [],
		settings = {
			soundBtn: document.getElementById("muteBtn"),
			fullBtn: document.getElementById("fsBtn"),
			sound: "yes",
			full: "no"
		},
		key = {
			0: document.getElementById("one"),
			1: document.getElementById("two"),
			2: document.getElementById("three"),
			3: document.getElementById("four"),
			4: document.getElementById("five"),
			5: document.getElementById("six")
		},
		enter = {
			0: document.getElementById("enter1"),
			1: document.getElementById("enter2"),
			2: document.getElementById("enter3"),
			3: document.getElementById("enter4"),
			4: document.getElementById("enter5"),
			5: document.getElementById("enter6")
		};

	textarea.focus();
	
	try {
		if(localStorage.getItem("firstTime") != "false")
			localStorage.setItem("firstTime", "true");

		if(localStorage.getItem("sound") == "no") {
			settings.sound = "no";
			document.getElementById("muteVal").innerHTML = "no";	
	}
	} catch(e) {}

	// Get the previous text, if any
	savedText = "";
	try {
		savedText = localStorage.getItem("text");
	} catch(e) {}

	if(savedText) {
		textarea.value = savedText;

		savedText = savedText.replace(/(^\s*)|(\s*$)/gi,"");
		savedText = savedText.replace(/[ ]{2,}/gi," ");
		savedText = savedText.replace(/\n /,"\n");
		document.getElementById("wordCount").innerHTML = savedText.split(' ').length + " words";
	}

	// Play the sound
	textarea.addEventListener("keypress", function(e) {
		if(settings.sound == "yes") {
			keyCode = e.keyCode || e.which;

			if(keyCode == 13) {
				enter[k].volume = 0.2 + (Math.random() * 0.5);
				enter[k].play();
				if(k > 4)
					k = 0;
				else
					k++;
			}

			else {
				key[i].volume = 0.2 + (Math.random() * 0.5);
				key[i].play();
				if(i > 4)
					i = 0;
				else
					i++;

			}
		}
		// console.log(e.keyCode);
	}, false);

	// Insert tab when "tab" is pressed
	// Thanks to http://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
	textarea.addEventListener("keydown", function(e) {
		keyCode = e.keyCode || e.which;

		if(keyCode == 9) {
			e.preventDefault();

			var start = textarea.selectionStart,
				end = textarea.selectionEnd;

			// set textarea value to: text before caret + tab + text after caret
			textarea.value = textarea.value.substring(0, start)
				+ "\t"
                + textarea.value.substring(end);

            // put caret at right position again
		    textarea.selectionStart = textarea.selectionEnd = start + 1;
		}

		value = textarea.value;
		value = value.replace(/(^\s*)|(\s*$)/gi,"");
		value = value.replace(/[ ]{2,}/gi," ");
		value = value.replace(/\n /,"\n");
		document.getElementById("wordCount").innerHTML = value.split(' ').length + " words";

  	}, false);

	document.addEventListener("keydown", function(e) {
		// Markdown!
		keyCode = e.keyCode || e.which;

		if(e.ctrlKey && keyCode == 77) {
			if(!isPreviewActive) {
				preview.innerHTML  = converter.makeHtml(textarea.value);
				preview.style.opacity = 1;
				preview.style.visibility = "visible";

				isPreviewActive = true;
				textarea.blur();
			}
			else {
				preview.style.opacity = 0;
				preview.style.visibility = "hidden";

				isPreviewActive = false;
				textarea.focus();
			}

			e.preventDefault();
		}
	}, false);

	// Saving after every 2 seconds
	try {
		if(localStorage.getItem("firstTime") == "false")
			setInterval(function() {
					localStorage.setItem("text", textarea.value);
			}, 2000);
	} catch(e) {}

	// Settings
	settings.soundBtn.addEventListener("click", function(e) {
		if(settings.sound == "yes") {
			settings.sound = "no"
			document.getElementById("muteVal").innerHTML = "no";
			localStorage.setItem("sound", "no");
		}

		else {
			settings.sound = "yes"
			document.getElementById("muteVal").innerHTML = "yes";
			localStorage.setItem("sound", "yes");
		}

		e.preventDefault();
	}, false);

	settings.fullBtn.addEventListener("click", function(e) {
		if(settings.full == "yes") {
			settings.full = "no"
			document.getElementById("fsVal").innerHTML = "no";

			cancelFullScreen(document.body);
		}

		else {
			settings.full = "yes"
			document.getElementById("fsVal").innerHTML = "yes";

			requestFullScreen(document.body);
			document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);		
		}
		
		e.preventDefault();
	}, false);

	try {
		if(localStorage.getItem("firstTime") == "true") {
			// Typing Animation - First time users only
			var introText = "(Refresh to skip this intro)\n\n\nAbout\
			\n-----\
			\n\nHello! I created this small webapp to help people write without any distractions.\
			\nIt does not store any of your stories/poems on the server or send them anywhere so feel free to type whatever you want.\
			\n\nThis is the first time intro and you'll never see this again.\
			\n\nSome Features\n------------\n\n* Markdown support. (Press CTRL+M to view the preview)\
			\n* Autosave using HTML5 localStorage.\
			\n* More features coming soon.\
			\n\nTo start typing, just remove everything from here or refresh the page. Happy writing :)";

			var myString = introText,
				frameRate = 100,
				myArray = myString.split(""),
				isStop = false;

				localStorage.setItem("firstTime", "false");
				textarea.value = "";

			function frameLooper() {
				if(myArray.length > 0) {
					textarea.value += myArray.shift();
					// console.log(myArray[0]);

					if(myArray[1] != "\n") {
						if(settings.sound == "yes") {
							key[i].volume = 0.2 + (Math.random() * 0.2);
							key[i].play();
							if(i > 4)
								i = 0;
							else
								i++;
						}

						isStop = false;
					}

					else {
						if(settings.sound == "yes") {
							enter[k].volume = 0.2 + (Math.random() * 0.5);
							enter[k].play();
							if(k > 4)
								k = 0;
							else
								k++;
						}

						isStop = true;
					}
				}
		 	}

			(function loop() {
				if(isStop)
					var rand = 300;
				else
			    	var rand = Math.round(Math.random() * (150 - 20)) + 20;

			    setTimeout(function() {
		            frameLooper();
		            loop();  
			    }, rand);
			}());
		}
	} catch(e) {}

	function requestFullScreen(element) {
	    // Supports most browsers and their versions.
	    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

	    if (requestMethod) { // Native full screen.
	        requestMethod.call(element);
	    } 
	}

	function cancelFullScreen(element) {
	    // Supports most browsers and their versions.
	    var requestMethod = element.exitFullscreen || element.webkitCancelFullScreen || element.mozCancelFullScreen;

	    if (requestMethod) { // Native full screen.
	        requestMethod.call(element);
	    } 
	}

}
