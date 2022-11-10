var AnimationState;
(function (AnimationState) {
    AnimationState["IdleAnimation"] = "idle-animation";
    AnimationState["StartAnimation"] = "start-animation";
    AnimationState["EndAnimation"] = "end-animation";
})(AnimationState || (AnimationState = {}));
class Slider {
    _size = 2;
    _changeTime = 5;
    _startEndTime = 1;
    _containerNode;
    _currentAnimationDirection = 1;
    _current = 0;
    _currentAnimation = AnimationState.IdleAnimation;
    _intervalAnimationId = -1;
    _autoAnimation = true;
    _elements;
    _currentElements = [];
    constructor(node) {
        this._elements = [];
        while (node.firstChild) {
            if (node.firstChild.nodeType == Node.ELEMENT_NODE)
                this._elements.push(node.firstChild);
            node.removeChild(node.firstChild);
        }
        this._containerNode = document.createElement('div');
        this._containerNode.classList.add('sliderinnernode');
        this.SetSpeedValues(this._changeTime, this._startEndTime);
        this.setAnimation(AnimationState.IdleAnimation);
        node.appendChild(this._containerNode);
        this.SlowMovementOffset("100px");
        this.BeginIdleAnimation();
        this.Slide(1);
    }
    BeginIdleAnimation() {
        let self = this;
        self._autoAnimation = true;
        this._intervalAnimationId = setInterval(function () {
            self.Slide(self._currentAnimationDirection);
        }, this._changeTime * 1000);
    }
    RestartIdleAnimation() {
        clearInterval(this._intervalAnimationId);
        this.BeginIdleAnimation();
    }
    NextElements(direction) {
        if (direction > 0)
            this._current = this._current + this._size >= this._elements.length
                ? 0 : this._current + this._size;
        else
            this._current = this._current - this._size < 0
                ? this._elements.length -
                    (this._size - (this._elements.length % this._size))
                :
                    this._current - this._size;
        this._currentElements = this._elements.slice(this._current, Math.min(this._current + this._size, this._elements.length));
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
        await Slider.waitForSeconds(this._startEndTime);
        if (this._autoAnimation)
            this.RestartIdleAnimation();
        this.NextElements(direction);
        this.setAnimation(AnimationState.StartAnimation);
        //await  maybe we can set a wait time in the middle of the end-start 
        //of the animation :D
        await Slider.waitForSeconds(this._startEndTime);
        this.setAnimation(AnimationState.IdleAnimation);
    }
    SlideRight() {
        this.Slide(1);
    }
    SlideLeft() {
        this.Slide(-1);
    }
    SetSpeedValues(changeTime, startEndAnimationTime) {
        this._changeTime = changeTime;
        this._startEndTime = startEndAnimationTime;
        this._containerNode.style.setProperty("--animation-time", changeTime.toString() + 's');
        this._containerNode.style.setProperty("--end-animation-time", startEndAnimationTime.toString() + 's');
        return this;
    }
    SetAmountOfElements(amount) {
        this._size = amount;
        return this;
    }
    RemoveAutoAnimation() {
        clearInterval(this._intervalAnimationId);
        this.SlowMovementOffset("0px");
        this._autoAnimation = false;
        return this;
    }
    ToogleAutoAnimation() {
        if (this._autoAnimation)
            this.RemoveAutoAnimation();
        else {
            this.SlowMovementOffset("100px");
            this.Slide(this._currentAnimationDirection);
            this.BeginIdleAnimation();
        }
    }
    SlowMovementOffset(offset) {
        this._containerNode.style.setProperty("--animation-offset", offset);
        return this;
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
const AddYasToID = (id) => {
    const node = document.getElementById(id);
    if (node === null) {
        console.error(`Node with id ${id} not found!`);
        return null;
    }
    return AddYasToHTMLElement(node);
};
const AddYasToHTMLElement = (node) => {
    return new Slider(node);
};
export { AddYasToID, AddYasToHTMLElement, Slider };
