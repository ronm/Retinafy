(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Retinafy = factory();
  }
}(this, function () {
	
	const klass = "retina-processed";
	
	return class Retinafy {
		constructor(sel, run = true) {
			this.sel = sel;
			this._watcher = this.watch();
			this._process();
		}
		
		_process() {
			[].slice.apply(document.querySelectorAll(this.sel + ":not(." + klass + ")")).forEach(img => this._processImages(img));
		}
		
		_processImages(img) {
			return img.tagName.toLowerCase() === "img" ? this._half(img) : [].slice.apply(img.querySelectorAll("img")).forEach(i => this._half(i));
		}
		
		_half(img) {
			if ( img.complete ) { 
				img.style.maxWidth = (img.naturalWidth/2) + "px";
			} else {
				img.addEventListener("load", function() { this.style.maxWidth = (this.naturalWidth/2) + "px"; });
			}

			img.classList.add(klass);
		}
		
		watch() {
			let observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					if (mutation.addedNodes.length) {
						if ( mutation.addedNodes[0].nodeType !== 1 ) return;				

						[].slice.apply( mutation.addedNodes[0].querySelectorAll(this.sel) );
						
						if ( mutation.addedNodes[0].classList.contains(this.sel) ) {
							this._processImages(mutation.addedNodes[0]);
						} else {
							[].slice.apply( mutation.addedNodes[0].querySelectorAll(this.sel) ).forEach(el => this._processImages(el));
						}
					}
				});
			});
	
			// pass in the target node, as well as the observer options
			observer.observe(document.body, {childList: true, subtree: true});
		}
		
		unwatch() {
			this._wactcher.disconnect();
		}
	}
}));