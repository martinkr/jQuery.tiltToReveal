<a name="README">[jQuery.tiltToReveal](https://github.com/martinkr/jQuery.tiltToReveal)</a>
=======
**jQuery.tiltToReveal - Tilt your device to reveal... more content, parts of an image, or just 'more' .**
jQuery.tiltToReveal supports two different modes:
- **treshold based**: as soons as the user tilts the device above the treshold angle the animation starts and runs the whole distance
- **percentage based**: until the user tilts the device to the maximum angle the elements are animated. If the maximum angle is reached, the whole distance has been animated

## API
```JavaScript
 	jQuery('.fx--tiltToReveal').tiltToReveal({
		useTreshold: {BOOLEAN - indicate if you want to use the threshold or the percentage variation},
		// set the options for left/right tilting
		leftright: {
			distance: {NUMBER - the maximum distance to go in pixel},
			treshold: {NUMBER - the angle the device have to be tilted before the treshold based animation is triggered},
			maxAngle: {NUMBER - the maximum angle for the percentage based animation. This angle equals 100% - the maximum distance to go}
		},
		// set the options for front/back tilting
		frontback: {
			distance: {NUMBER - the maximum distance to go in pixel},
			treshold: {NUMBER - the angle the device have to be tilted before the treshold based animation is triggered},
			maxAngle: {NUMBER - the maximum angle for the percentage based animation. This angle equals 100% - the maximum distance to go}
		},
		// set the animation properties
		animation : {
			duration: {NUMBER - the maximum duration for the css transition},
			easing: {String - easing for the css transition, eg 'linear'},
		}
 	});

```


## Example
```JavaScript
	jQuery(document).ready(function(){
		jQuery('.fx--tiltToReveal').tiltToReveal({});
	})
```

## Requires
* jQuery JavaScript Library - http://jquery.com/; Copyright 2010, John Resig; Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license

## License
Dual licensed under the MIT and GPL licenses.

* MIT - http://www.opensource.org/licenses/mit-license.php
* LGPL-3.0 - http://opensource.org/licenses/lgpl-3.0.html

Copyright (c) 2014 Martin Krause (martinkr.github.io)
