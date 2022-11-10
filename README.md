# Yet Another Slider (yas)

Very simple slider, easy to configure, may have HTMLElements as Elements.



---
## Use 
The center idea is that the slider will be inserted in a `HTMLElement` node selected. The elements of the slider will be (by default) the children nodes of the selected node.

### Without a package manager
You can download the project in the workspace and:
```html
<div id="slider_id">
    <div> first child </div>
    <div> second child </div>
    <div> 
        <img src="./testImg.jpg" /> 
    </div>
<button onclick="mySlider.SlideLeft()">Prev</button>
<button onclick="mySlider.SlideRight()">Next</button>


<script type="module">
    import { AddYasToID } from './yas/slider.js'

    window.mySlider = AddYasToID('slider_id');
</script>
``` 
The slider will have by default the elements that the node with `id` equal (in this case) to `slider_id` has as children.

The slider may be created using `AddYasToHTMLElement`, passing directly the container Node.

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

```js
let slider = AddYasToID('slider_id')
                .ChangeSpeedValues(10,0.5)
                .SetAmountOfElements(2)
                .SlowMovementOffset(100px);

```
You can _join_ the configurations when you create the slider using `AddYasToID(id:string)`, `AddYasToHTMLElement(node:HTMLElement)` or initializing like `new Slider(node:HTMLElement)` 

### Available configurations


Configuration | Description  
--- | --- | 
`SetSpeedValues(changeTime, endTime)`  | Sets the animation time, `changeTime` is the delay in seconds waited for change, and `endTime` is  the delay of the change animation.
`SetAmountOfElements(amount)` |   Sets the number of items displayed at once.
`SetSlowMovementOffset(offset)` | Sets the distance traveled by the elements after make a change, Ej: `'100px'`. 
`RemoveAutoAnimation()` | Remove auto change. 