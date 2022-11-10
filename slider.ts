
enum AnimationState {
    IdleAnimation="idle-animation",
    StartAnimation="start-animation",
    EndAnimation="end-animation"
}


class Slider {
    private _size: number=2;
    private _changeTime: number=5;
    private _startEndTime: number=1;
    private _containerNode: HTMLElement;
    
    private _currentAnimationDirection: 1 | -1 = 1;
    
    private _current: number=0;
    private _currentAnimation: AnimationState=AnimationState.IdleAnimation;
    
    private _intervalAnimationId: number=-1;
    private _autoAnimation: boolean=true;
    
    private _elements: Node[];
    private _currentElements: Node[]=[];
    public constructor(node: HTMLElement){
        this._elements=[];
        while(node.firstChild){
            if(node.firstChild.nodeType == Node.ELEMENT_NODE)
                this._elements.push(node.firstChild);
            node.removeChild(node.firstChild);
        }

        this._containerNode = document.createElement('div');
        this._containerNode.classList.add('sliderinnernode');
        this.SetSpeedValues(this._changeTime,this._startEndTime);
        this.setAnimation(AnimationState.IdleAnimation);
        node.appendChild(this._containerNode);


        this.SlowMovementOffset("100px");
        this.BeginIdleAnimation();
        this.Slide(1);
    }

    public BeginIdleAnimation(){
        let self: Slider = this;

        self._autoAnimation=true;
        this._intervalAnimationId = setInterval(function(){
            self.Slide(self._currentAnimationDirection);
        }, this._changeTime*1000);
    }
    private RestartIdleAnimation(){
        clearInterval(this._intervalAnimationId);
        this.BeginIdleAnimation();
    }

    private NextElements(direction: number){
        if(direction>0)
            this._current= this._current + this._size >= this._elements.length 
                            ? 0 : this._current + this._size;
        else 
            this._current= this._current - this._size < 0 
                            ? this._elements.length -
                            (this._size - (this._elements.length % this._size))
                            :
                            this._current - this._size ;

        this._currentElements = this._elements.slice(
            this._current,
            Math.min(
                this._current+this._size,
                this._elements.length
            )
        );

        while(this._containerNode.firstChild)
            this._containerNode.removeChild(this._containerNode.firstChild)
        this._containerNode.append(...this._currentElements)
    }

    public async Slide(direction: 1|-1){
        if(this._currentAnimation != AnimationState.IdleAnimation)
            return;

        this._containerNode.style.setProperty("--animation-direction",direction.toString());

        this._currentAnimationDirection=direction;
        this.setAnimation(AnimationState.EndAnimation);
        await Slider.waitForSeconds(this._startEndTime);
        
        if(this._autoAnimation)
            this.RestartIdleAnimation();
        this.NextElements(direction);
        this.setAnimation(AnimationState.StartAnimation);

        //await  maybe we can set a wait time in the middle of the end-start 
        //of the animation :D

        await Slider.waitForSeconds(this._startEndTime);

        this.setAnimation(AnimationState.IdleAnimation);
    }

    public SlideRight(){
        this.Slide(1);
    }
    public SlideLeft(){
        this.Slide(-1);
    }

    public SetSpeedValues(changeTime:number, startEndAnimationTime: number){
        this._changeTime = changeTime;
        this._startEndTime = startEndAnimationTime;
        this._containerNode.style.setProperty("--animation-time",changeTime.toString()+'s');
        this._containerNode.style.setProperty("--end-animation-time",startEndAnimationTime.toString()+'s');

        return this;
    }
    public SetAmountOfElements(amount: number){
        this._size=amount;
        return this; 
    }
    public RemoveAutoAnimation(){
        clearInterval(this._intervalAnimationId)
        this.SlowMovementOffset("0px")
        this._autoAnimation = false;
        return this;
    }
    public ToogleAutoAnimation(){
        if(this._autoAnimation)
            this.RemoveAutoAnimation();
        else{ 
            this.SlowMovementOffset("100px");
            this.Slide(this._currentAnimationDirection);
            this.BeginIdleAnimation();
        }
    }

    public SlowMovementOffset(offset: string){
        this._containerNode.style.setProperty("--animation-offset",offset);
        return this;
    }


    public SetSpecificAnimation(){
    /* Set an specific animation.  */
        throw "NotImplemented!";
        return this;
    }

    private setAnimation(animation: AnimationState){
        if (!this._containerNode.classList.replace(this._currentAnimation,animation))
            this._containerNode.classList.add(animation);
        
        this._currentAnimation = animation;
    }


    private static waitForSeconds(seconds: number){
        return new Promise(
            (resolve)=>setTimeout(resolve,seconds*1000)
        );
    }
}

const AddYasToID = (id: string):Slider | null => {
    const node = document.getElementById(id);
    if (node === null){
        console.error(`Node with id ${id} not found!`)
        return null
    }
    return AddYasToHTMLElement(node);
}

const AddYasToHTMLElement = (node: HTMLElement):Slider => {
    return new Slider(node);
}



export {
    AddYasToID,
    AddYasToHTMLElement,
    Slider
}
