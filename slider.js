var AnimationState;
(function (AnimationState) {
    AnimationState["IdleAnimation"] = "idle-animation";
    AnimationState["StartAnimation"] = "start-animation";
    AnimationState["EndAnimation"] = "end-animation";
})(AnimationState || (AnimationState = {}));
class Slider {
    _containerNode;
    _currentAnimationDirection = 1;
    _current = 0;
    _currentAnimation = AnimationState.IdleAnimation;
    _intervalAnimationId = -1;
    _elements;
    _currentElements = [];
    _config = {
        amountElements: 2,
        changeTime: 5,
        startEndAnimationTime: 0.5,
        initialAnimationDirection: 1,
        autoAnimation: true,
        slowMovementOffset: "80px"
    };
    constructor(node, config = undefined) {
        this._config = { ...this._config, ...config };
        //save the children as elements of the slider
        this._elements = [];
        while (node.firstChild) {
            if (node.firstChild.nodeType == Node.ELEMENT_NODE)
                this._elements.push(node.firstChild);
            node.removeChild(node.firstChild);
        }
        // Creating the internal "<div>" that will contain the elements.
        this._containerNode = document.createElement('div');
        this._containerNode.classList.add('sliderinnernode');
        node.appendChild(this._containerNode);
        // refreshing de css var values...
        this.SetSpeedValues(this._config.changeTime, this._config.startEndAnimationTime);
        this.setAnimation(AnimationState.IdleAnimation);
        this.setSlowMovementOffset(this._config.slowMovementOffset);
        this.BeginIdleAnimation();
        this._current = this._elements.length;
        this.Slide(this._config.initialAnimationDirection);
    }
    BeginIdleAnimation() {
        let self = this;
        self._config.autoAnimation = true;
        this._intervalAnimationId = setInterval(function () {
            self.Slide(self._currentAnimationDirection);
        }, this._config.changeTime * 1000);
    }
    RestartIdleAnimation() {
        clearInterval(this._intervalAnimationId);
        this.BeginIdleAnimation();
    }
    NextElements(direction) {
        if (direction > 0)
            this._current = this._current + this._config.amountElements >= this._elements.length
                ? 0 : this._current + this._config.amountElements;
        else
            this._current = this._current - this._config.amountElements < 0
                ? this._elements.length -
                    (this._config.amountElements - (this._elements.length % this._config.amountElements))
                :
                    this._current - this._config.amountElements;
        this._currentElements = this._elements.slice(this._current, Math.min(this._current + this._config.amountElements, this._elements.length));
        while (this._containerNode.firstChild)
            this._containerNode.removeChild(this._containerNode.firstChild);
        this._containerNode.append(...this._currentElements);
    }
    async Slide(direction) {
        if (this._currentAnimation != AnimationState.IdleAnimation)
            return;
        this._containerNode.style.setProperty("--animation-direction", direction.toString());
        this._currentAnimationDirection = direction;
        this.setAnimation(AnimationState.EndAnimation);
        await Slider.waitForSeconds(this._config.startEndAnimationTime);
        if (this._config.autoAnimation)
            this.RestartIdleAnimation();
        this.NextElements(direction);
        this.setAnimation(AnimationState.StartAnimation);
        //await  maybe we can set a wait time in the middle of the end-start 
        //of the animation :D
        await Slider.waitForSeconds(this._config.startEndAnimationTime);
        this.setAnimation(AnimationState.IdleAnimation);
    }
    SlideRight() {
        this.Slide(1);
    }
    SlideLeft() {
        this.Slide(-1);
    }
    SetSpeedValues(changeTime, startEndAnimationTime) {
        this._config.changeTime = changeTime;
        this._config.startEndAnimationTime = startEndAnimationTime;
        this._containerNode.style.setProperty("--animation-time", changeTime.toString() + 's');
        this._containerNode.style.setProperty("--end-animation-time", startEndAnimationTime.toString() + 's');
        return this;
    }
    SetAmountOfElements(amount) {
        this._config.amountElements = amount;
        return this;
    }
    RemoveAutoAnimation() {
        clearInterval(this._intervalAnimationId);
        this.setSlowMovementOffset("0px");
        this._config.autoAnimation = false;
        return this;
    }
    ToogleAutoAnimation() {
        if (this._config.autoAnimation)
            this.RemoveAutoAnimation();
        else {
            this.setSlowMovementOffset(this._config.slowMovementOffset);
            this.Slide(this._currentAnimationDirection);
            this.BeginIdleAnimation();
        }
    }
    SetSlowMovementOffset(offset) {
        this._config.slowMovementOffset = offset;
        this.setSlowMovementOffset(offset);
        return this;
    }
    setSlowMovementOffset(offset) {
        this._containerNode.style.setProperty("--animation-offset", offset);
    }
    SetSpecificAnimation() {
        /* Set an specific animation.  */
        throw "NotImplemented!";
        return this;
    }
    setAnimation(animation) {
        if (!this._containerNode.classList.replace(this._currentAnimation, animation))
            this._containerNode.classList.add(animation);
        this._currentAnimation = animation;
    }
    static waitForSeconds(seconds) {
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }
}
const AddYasToID = (id, config = undefined) => {
    const node = document.getElementById(id);
    if (node === null) {
        console.error(`Node with id ${id} not found!`);
        return null;
    }
    return AddYasToHTMLElement(node, config);
};
const AddYasToHTMLElement = (node, config = undefined) => {
    return new Slider(node, config);
};
export { AddYasToID, AddYasToHTMLElement, Slider };
