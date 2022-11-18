# Yet Another Slider (yas)

Very simple slider written in TypeScript, easy to set up, it can have HTMLElements as items.

---
## Use 
The center idea is that the slider will be inserted in a `HTMLElement` node selected. The elements of the slider will be (by default) the children nodes of the selected node.


### Without a package manager
You can download the project in the workspace and:
```html
<!-- Import the styles needed. -->
<link rel="stylesheet" href="yas/style.css">

<!-- mark the node where the slider will be with an id -->
<div id="slider_id">
    <!-- Every child will be a slider item. -->
    <div> first child </div>
    <div> second child </div>
    <div> 
        <p> child with an image </p>
        <img src="./testImg.jpg" /> 
    </div>
</div>
<!-- Slide manually -->
<button onclick="mySlider.SlideLeft()">Prev</button>
<button onclick="mySlider.SlideRight()">Next</button>

<script type="module">
    import { AddYasToID } from './yas/slider.js'

    // Create the slider in the HTMLElement with `slider_id` as id
    window.mySlider = AddYasToID('slider_id');
</script>
``` 
The slider will have by default the elements that the node with `id` equal (in this case) to `slider_id` has as children.

The slider can be created using `AddYasToHTMLElement`, passing directly the container Node.

Remember to import the CSS code (`yas/style.css`).

### With NPM
```bash
npm install yaslider
```
then
```js
import { 
    AddYasToID,
    AddYasToHTMLElement,
    YaSlider } from 'yaslider/slider'

```


---
## Actions
Action | Desctiption
---|---
`ToogleAutoAnimation()`| Start/Stop the auto change.
`Slide(direction)`|Change the currentes elements in the selected direction.
`SlideRight()`|Change the currentes elements in the right direction ( `Slider(1)` ).
`SlideLeft()`|Change the currentes elements in the left  direction ( `Slider(-1)` ).


---
## Configuration

### Method Chaining
```js
let slider = AddYasToID('slider_id')
                .ChangeSpeedValues(10,0.5)
                .SetAmountOfElements(2)
                .SlowMovementOffset(100px)
                .SetSpecificAnimation("blur");

```
You can _join_ the configurations chaining the methods when you create the slider using `AddYasToID()`, `AddYasToHTMLElement()` or initializing like `new YaSlider()` 
  #### Available configurations


  Configuration | Description  
  --- | --- | 
  `SetSpeedValues(changeTime, endTime)`  | Sets the animation time, `changeTime` is the delay in seconds waited for change, and `endTime` is  the delay of the change animation.
  `SetAmountOfElements(amount)` |   Sets the number of items displayed at once.
  `SetSlowMovementOffset(offset)` | Sets the distance traveled by the elements after make a change, Ej: `'100px'`. 
  `RemoveAutoAnimation()` | Remove auto change. 
  `SetSpecificAnimation(animation)` | Sets a different animation.
  `SetAnimationToEveryItem(ok)` | Sets individual animation for every item. 
  `ShouldMove(ok)` | ShouldMove?

  We create some defaults animations like:
  `default`, `opacity`, `up-down`,`blur` and `rotation`, but the user can create their own animations following the structure defined by the animations in `./style.css`.

### Configuration object 
You can configure the slider using a configuration object, using the methods `AddYasToID()` and `AddYasToHTMLElement()` 
```js
let slider=AddYasToID('slider_id',{
    amountElements:1,
    changeTime:2,
    startEndAnimationTime:0.8,
    initialAnimationDirection: 1,
    autoAnimation: true,
    slowMovementOffset: "20deg",
    animation:'rotation'
    animEveryItem: false 
})
```



